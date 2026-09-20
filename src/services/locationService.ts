// ==============================================================================
// LANDSLIDE GUARDIAN 360° — Location Service
// SIH26001 — Ministry of Development of North Eastern Region (MDoNER)
// ==============================================================================

import { LocationRecord, RoadStatus } from '../types';
import { LocalStore } from '../lib/storage';

export class LocationService {
  static getLocations(): LocationRecord[] {
    return LocalStore.getLocations();
  }

  static getLocationById(id: string): LocationRecord | undefined {
    return LocalStore.getLocations().find(l => l.id === id);
  }

  static updateTelemetry(
    id: string,
    updates: Partial<Pick<LocationRecord, 'rainfall' | 'soil_moisture' | 'slope' | 'road_status'>>
  ): LocationRecord | null {
    return LocalStore.updateLocation(id, updates);
  }

  static getRoadConnectivitySummary(): {
    open: number;
    restricted: number;
    blocked: number;
    critical: number;
    items: Array<{
      locationId: string;
      locationName: string;
      roadName: string;
      status: RoadStatus;
      alternateRoute?: string;
      updatedAt: string;
    }>;
  } {
    const locations = this.getLocations();
    let open = 0;
    let restricted = 0;
    let blocked = 0;
    let critical = 0;

    const items = locations.map(loc => {
      if (loc.road_status === 'OPEN') open++;
      else if (loc.road_status === 'RESTRICTED') restricted++;
      else if (loc.road_status === 'BLOCKED') blocked++;
      else if (loc.road_status === 'CRITICAL') critical++;

      return {
        locationId: loc.id,
        locationName: loc.name,
        roadName: loc.road_name,
        status: loc.road_status,
        alternateRoute: loc.alternate_route,
        updatedAt: loc.updated_at
      };
    });

    return { open, restricted, blocked, critical, items };
  }
}
