import { z } from 'zod';

export const siteSchema = z.object({
  siteId: z.string().min(1, 'Site ID is required'),
  legacyId: z.string().optional(),
  region5: z.string().min(1, 'Region5 is required'),
  region13: z.string().min(1, 'Region13 is required'),
  city: z.string().min(1, 'City is required'),
  district: z.string().min(1, 'District is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  installationDate: z.string().or(z.date()),
  status: z.enum(['Active', 'Inactive']).default('Active'),
  technicianName: z.string().min(1, 'Technician name is required'),
  technicianEmail: z.string().email('Invalid email address'),
});

export type SiteInput = z.infer<typeof siteSchema>;