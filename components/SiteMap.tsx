'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Site {
  Site_ID: string;
  Latitude?: number;
  Longitude?: number;
  City?: string;
  Status?: string;
}

interface SiteMapProps {
  sites: Site[];
}

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function SiteMap({ sites }: SiteMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map centered on Saudi Arabia
    const map = L.map(containerRef.current).setView([24.7136, 46.6753], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add markers for sites with coordinates
    const validSites = sites.filter(
      (site) => site.Latitude != null && site.Longitude != null
    );

    validSites.forEach((site) => {
      const marker = L.marker([site.Latitude!, site.Longitude!]).addTo(map);

      const popupContent = `
        <div class="p-2">
          <h3 class="font-bold text-green-700">${site.Site_ID}</h3>
          ${site.City ? `<p class="text-sm">City: ${site.City}</p>` : ''}
          ${site.Status ? `<p class="text-sm">Status: ${site.Status}</p>` : ''}
        </div>
      `;

      marker.bindPopup(popupContent);
    });

    // Fit bounds if there are valid sites
    if (validSites.length > 0) {
      const bounds = L.latLngBounds(
        validSites.map((site) => [site.Latitude!, site.Longitude!])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [sites]);

  return <div ref={containerRef} className="w-full h-[500px] rounded-lg shadow-lg" />;
}