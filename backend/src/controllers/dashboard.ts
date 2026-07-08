import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const institutionId = req.user?.institutionId;
    const filter = institutionId ? { institutionId } : {};

    // 1. Active Threat Alerts (HIGH/CRITICAL + OPEN/UNDER_INVESTIGATION)
    const activeThreatsCount = await prisma.incident.count({
      where: {
        severity: { in: ['HIGH', 'CRITICAL'] },
        status: { in: ['OPEN', 'UNDER_INVESTIGATION'] }
      }
    });

    // 2. Open Incidents Count
    const openIncidentsCount = await prisma.incident.count({
      where: { status: 'OPEN' }
    });

    // 3. Assets for Compliance and Risk
    const assets = await prisma.asset.findMany({ where: filter });
    const totalAssets = assets.length;

    const healthyAssets = assets.filter(a => a.patchStatus === 'Healthy').length;
    const compliancePercent = totalAssets > 0 ? Math.round((healthyAssets / totalAssets) * 100) : 100;

    let avgRiskScore = 0;
    if (totalAssets > 0) {
      const sumRisk = assets.reduce((sum, a) => sum + (a.riskScore || 0), 0);
      avgRiskScore = sumRisk / totalAssets;
    }

    let securityScore = 100 - (activeThreatsCount * 5) - (avgRiskScore * 2);
    securityScore = Math.min(100, Math.max(0, securityScore));

    // 4. ISO 27001 Doughnut data
    const passedControls = Math.round(114 * (compliancePercent / 100));
    const failedControls = Math.round(114 * ((100 - compliancePercent) / 100) * 0.7);
    const missingControls = 114 - passedControls - failedControls;

    // 5. ---- REAL TREND DATA ----
    // Record today's score in ScoreHistory (upsert by month)
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Upsert: if a record for this month already exists, update it; otherwise create
    const existing = await (prisma as any).scoreHistory.findFirst({
      where: { month: currentMonth, institutionId: institutionId || null }
    });

    if (existing) {
      await (prisma as any).scoreHistory.update({
        where: { id: existing.id },
        data: { score: Math.round(securityScore) }
      });
    } else {
      await (prisma as any).scoreHistory.create({
        data: {
          score: Math.round(securityScore),
          month: currentMonth,
          institutionId: institutionId || null
        }
      });
    }

    // Fetch last 6 months of score history
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    const sixMonthsAgoStr = `${sixMonthsAgo.getFullYear()}-${String(sixMonthsAgo.getMonth() + 1).padStart(2, '0')}`;

    const history = await (prisma as any).scoreHistory.findMany({
      where: {
        month: { gte: sixMonthsAgoStr },
        institutionId: institutionId || null
      },
      orderBy: { month: 'asc' }
    });

    // Build the last 6 month labels and fill in scores (use 0 if no data yet)
    const months: string[] = [];
    const trendData: number[] = [];
    const monthLabels: string[] = [];
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months.push(key);
      monthLabels.push(monthNames[d.getMonth()]);
    }

    for (const key of months) {
      const record = history.find((h: any) => h.month === key);
      trendData.push(record ? record.score : 0);
    }

    res.json({
      securityScore: Math.round(securityScore),
      activeThreats: activeThreatsCount,
      compliancePercent,
      openIncidents: openIncidentsCount,
      trendData,
      monthLabels,
      doughnutData: [passedControls, failedControls, missingControls]
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to load dashboard stats', details: error.message });
  }
};
