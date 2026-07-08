import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getInstitutions = async (req: Request, res: Response) => {
  try {
    const institutions = await prisma.institution.findMany();
    res.json(institutions);
  } catch (error: any) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

export const getInstitutionById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const institution = await prisma.institution.findUnique({ where: { id } });
    if (!institution) {
      res.status(404).json({ error: 'Institution not found' });
      return;
    }
    res.json(institution);
  } catch (error: any) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

export const createInstitution = async (req: Request, res: Response) => {
  try {
    const { name, address, contactInfo } = req.body;
    const institution = await prisma.institution.create({
      data: { name, address, contactInfo }
    });
    res.status(201).json(institution);
  } catch (error: any) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

export const updateInstitution = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, address, contactInfo } = req.body;
    const institution = await prisma.institution.update({
      where: { id },
      data: { name, address, contactInfo }
    });
    res.json(institution);
  } catch (error: any) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

export const deleteInstitution = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.institution.delete({ where: { id } });
    res.json({ message: 'Institution deleted' });
  } catch (error: any) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};
