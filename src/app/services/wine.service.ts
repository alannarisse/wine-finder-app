import { Injectable, signal } from '@angular/core';
import { Wine } from '../models/wine.model';
import { WINES_DATA, VARIETAL_TO_WINES, WINE_RECOMMENDATION_MESSAGE } from '../data/wines.data';

@Injectable({
  providedIn: 'root'
})
export class WineService {
  private readonly wines = signal<Wine[]>([...WINES_DATA]);
  private readonly varietalMappingSignal = signal<Map<string, number[]>>(
    new Map(Object.entries(VARIETAL_TO_WINES))
  );
  private nextId = Math.max(...WINES_DATA.map(w => w.id)) + 1;

  readonly recommendationMessage = WINE_RECOMMENDATION_MESSAGE;

  // For backwards compatibility
  private get varietalMapping(): Record<string, number[]> {
    return Object.fromEntries(this.varietalMappingSignal());
  }

  /**
   * Get all wines
   */
  getAllWines(): Wine[] {
    return this.wines();
  }

  /**
   * Get a single wine by ID
   */
  getWineById(id: number): Wine | undefined {
    return this.wines().find(wine => wine.id === id);
  }

  /**
   * Get wines for a specific varietal suggestion
   * @param varietal - The varietal name (e.g., "Pinot Noir", "Chardonnay")
   * @returns Array of Wine objects matching the varietal
   */
  getWinesForVarietal(varietal: string): Wine[] {
    // Try exact match first
    let wineIds = this.varietalMapping[varietal];

    // If no exact match, try to find a partial match
    if (!wineIds) {
      const varietalLower = varietal.toLowerCase();
      const matchingKey = Object.keys(this.varietalMapping).find(key =>
        key.toLowerCase().includes(varietalLower) ||
        varietalLower.includes(key.toLowerCase())
      );
      if (matchingKey) {
        wineIds = this.varietalMapping[matchingKey];
      }
    }

    if (!wineIds || wineIds.length === 0) {
      return [];
    }

    return wineIds
      .map(id => this.getWineById(id))
      .filter((wine): wine is Wine => wine !== undefined);
  }

  /**
   * Get wine recommendations for multiple varietal suggestions
   * Returns unique wines (no duplicates) limited to specified count
   * @param varietals - Array of varietal names from pairing suggestions
   * @param limit - Maximum number of wines to return (default 10)
   * @returns Array of unique Wine objects
   */
  getWineRecommendations(varietals: string[], limit: number = 10): Wine[] {
    const wineSet = new Map<number, Wine>();

    for (const varietal of varietals) {
      const wines = this.getWinesForVarietal(varietal);
      for (const wine of wines) {
        if (!wineSet.has(wine.id)) {
          wineSet.set(wine.id, wine);
        }
        // Stop if we've reached the limit
        if (wineSet.size >= limit) {
          break;
        }
      }
      if (wineSet.size >= limit) {
        break;
      }
    }

    return Array.from(wineSet.values());
  }

  /**
   * Format price for display
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  /**
   * Format year for display (handles NV wines)
   */
  formatYear(year: number | null): string {
    return year ? year.toString() : 'NV';
  }

  /**
   * Get full wine display name
   */
  getWineDisplayName(wine: Wine): string {
    const year = this.formatYear(wine.year);
    return `${wine.wineryName} ${wine.wineName} ${year}`;
  }

  // ==================== ADMIN CRUD OPERATIONS ====================

  /**
   * Add a new wine
   */
  addWine(wine: Omit<Wine, 'id'>): Wine {
    const newWine: Wine = {
      ...wine,
      id: this.nextId++
    };
    this.wines.update(wines => [...wines, newWine]);
    return newWine;
  }

  /**
   * Update an existing wine
   */
  updateWine(wine: Wine): void {
    this.wines.update(wines =>
      wines.map(w => w.id === wine.id ? wine : w)
    );
  }

  /**
   * Delete a wine by ID
   */
  deleteWine(id: number): void {
    this.wines.update(wines => wines.filter(w => w.id !== id));
    // Also remove from all varietal mappings
    this.varietalMappingSignal.update(mapping => {
      const newMapping = new Map(mapping);
      for (const [varietal, ids] of newMapping.entries()) {
        newMapping.set(varietal, ids.filter(wId => wId !== id));
      }
      return newMapping;
    });
  }

  /**
   * Get all unique varietals from the wine data
   */
  getAvailableVarietals(): string[] {
    const varietals = new Set<string>();
    for (const wine of this.wines()) {
      varietals.add(wine.varietal);
    }
    // Also add varietals from mappings
    for (const varietal of this.varietalMappingSignal().keys()) {
      varietals.add(varietal);
    }
    return Array.from(varietals).sort();
  }

  // ==================== VARIETAL MAPPING OPERATIONS ====================

  /**
   * Get the current varietal mappings
   */
  getVarietalMappings(): Map<string, number[]> {
    return new Map(this.varietalMappingSignal());
  }

  /**
   * Add a wine to a varietal mapping
   */
  addWineToVarietal(varietal: string, wineId: number): void {
    this.varietalMappingSignal.update(mapping => {
      const newMapping = new Map(mapping);
      const currentIds = newMapping.get(varietal) || [];
      if (!currentIds.includes(wineId)) {
        newMapping.set(varietal, [...currentIds, wineId]);
      }
      return newMapping;
    });
  }

  /**
   * Remove a wine from a varietal mapping
   */
  removeWineFromVarietal(varietal: string, wineId: number): void {
    this.varietalMappingSignal.update(mapping => {
      const newMapping = new Map(mapping);
      const currentIds = newMapping.get(varietal) || [];
      newMapping.set(varietal, currentIds.filter(id => id !== wineId));
      return newMapping;
    });
  }

  /**
   * Add a new varietal to the mapping
   */
  addVarietal(varietal: string): void {
    this.varietalMappingSignal.update(mapping => {
      if (!mapping.has(varietal)) {
        const newMapping = new Map(mapping);
        newMapping.set(varietal, []);
        return newMapping;
      }
      return mapping;
    });
  }

  // ==================== DATA EXPORT ====================

  /**
   * Export all wine data and mappings for backup/database migration
   */
  exportData(): { wines: Wine[]; varietalMappings: Record<string, number[]> } {
    return {
      wines: this.wines(),
      varietalMappings: Object.fromEntries(this.varietalMappingSignal())
    };
  }
}
