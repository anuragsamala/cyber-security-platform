import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getRisks = async (req: Request, res: Response) => {
  try {
    const risks = await prisma.risk.findMany();
    res.json(risks);
  } catch (error: any) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

export const createRisk = async (req: Request, res: Response) => {
  try {
    const { title, description, likelihood, impact, mitigationPlan } = req.body;
    
    const riskScore = likelihood * impact;
    let level = 'LOW';
    if (riskScore > 15) level = 'CRITICAL';
    else if (riskScore > 10) level = 'HIGH';
    else if (riskScore > 5) level = 'MEDIUM';

    const risk = await prisma.risk.create({
      data: { title, description, likelihood, impact, riskScore, level: level as any, mitigationPlan }
    });
    res.status(201).json(risk);
  } catch (error: any) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};
