import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const getIncidents = async (req: AuthRequest, res: Response) => {
  try {
    const incidents = await prisma.incident.findMany({
      include: { assignedOfficer: { select: { id: true, firstName: true, lastName: true } } }
    });
    res.json(incidents);
  } catch (error: any) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

export const getIncidentById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const incident = await prisma.incident.findUnique({
      where: { id },
      include: { assignedOfficer: { select: { id: true, firstName: true, lastName: true } } }
    });
    if (!incident) {
      res.status(404).json({ error: 'Incident not found' });
      return;
    }
    res.json(incident);
  } catch (error: any) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

export const createIncident = async (req: Request, res: Response) => {
  try {
    const { title, description, severity, status, evidenceUrl, assignedOfficerId } = req.body;
    const incident = await prisma.incident.create({
      data: { title, description, severity, status, evidenceUrl, assignedOfficerId }
    });
    res.status(201).json(incident);
  } catch (error: any) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

export const updateIncident = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { title, description, severity, status, evidenceUrl, assignedOfficerId } = req.body;
    
    const incident = await prisma.incident.update({
      where: { id },
      data: { title, description, severity, status, evidenceUrl, assignedOfficerId }
    });
    res.json(incident);
  } catch (error: any) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

export const deleteIncident = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.incident.delete({ where: { id } });
    res.json({ message: 'Incident deleted' });
  } catch (error: any) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};
