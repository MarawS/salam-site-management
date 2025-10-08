export interface Site {
  id: number;
  siteId: string;
  legacyId: string | null;
  region5: string;
  region13: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
  installationDate: Date | string;
  status: string;
  technicianName: string;
  technicianEmail: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SiteStats {
  total: number;
  active: number;
  dismantled: number;
  byRegion: Record<string, number>;
}   