import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const getAssets = async (req: AuthRequest, res: Response) => {
  try {
    const institutionId = req.user?.institutionId;
    const filter = institutionId ? { institutionId } : {};
    
    const assets = await prisma.asset.findMany({
      where: filter,
      include: { department: true }
    });
    res.json(assets);
  } catch (error: any) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

export const getAssetById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const asset = await prisma.asset.findUnique({
      where: { id },
      include: { department: true }
    });
    if (!asset) {
      res.status(404).json({ error: 'Asset not found' });
      return;
    }
    res.json(asset);
  } catch (error: any) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

export const createAsset = async (req: Request, res: Response): Promise<void> => {
  try {
    let { name, type, owner, location, os, patchStatus, riskScore, departmentId, institutionId } = req.body;
    
    // If no institutionId provided, find or create a default one
    if (!institutionId) {
      let defaultInst = await prisma.institution.findFirst();
      if (!defaultInst) {
        defaultInst = await prisma.institution.create({
          data: { name: 'Default Institution' }
        });
      }
      institutionId = defaultInst.id;
    }

    const asset = await prisma.asset.create({
      data: { name, type, owner, location, os, patchStatus, riskScore, departmentId, institutionId }
    });
    res.status(201).json(asset);
  } catch (error: any) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

export const updateAsset = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, type, owner, location, os, patchStatus, riskScore, departmentId, institutionId } = req.body;
    
    const asset = await prisma.asset.update({
      where: { id },
      data: { name, type, owner, location, os, patchStatus, riskScore, departmentId, institutionId }
    });
    res.json(asset);
  } catch (error: any) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

export const deleteAsset = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.asset.delete({ where: { id } });
    res.json({ message: 'Asset deleted' });
  } catch (error: any) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};
