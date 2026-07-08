import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getComplianceRecords = async (req: Request, res: Response) => {
  try {
    const records = await prisma.complianceRecord.findMany();
    res.json(records);
  } catch (error: any) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

export const createComplianceRecord = async (req: Request, res: Response) => {
  try {
    const { framework, controlName, isCompliant, evidence, recommendation } = req.body;
    const record = await prisma.complianceRecord.create({
      data: { framework, controlName, isCompliant, evidence, recommendation }
    });
    res.status(201).json(record);
  } catch (error: any) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};
