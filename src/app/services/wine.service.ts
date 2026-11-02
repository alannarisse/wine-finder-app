import { Injectable, inject, signal } from '@angular/core';
import { Wine } from '../models/wine.model';
import { WINE_RECOMMENDATION_MESSAGE } from '../data/wines.data';

import { firstValueFrom, forkJoin } from 'rxjs';
import { WineApiService } from './wine-api.service';
import { PairingService } from './pairing.service';

@Injectable({
  providedIn: 'root',
})
export class WineService {
  private readonly api = inject(WineApiService);
  private readonly pairingService = inject(PairingService);
  private readonly wines = signal<Wine[]>([]);
  private readonly varietalMappingSignal = signal<Map<string, number[]>>(new Map());
  readonly loading = signal(true);
  readonly error = signal('');
  readonly saving = signal(false);

  constructor() {
    void this.refresh();
  }

  async refresh(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      const { wines, mappings } = await firstValueFrom(
        forkJoin({
          wines: this.api.getAllWines(),
          mappings: this.api.getAllMappings(),
        }),
      );
      this.wines.set(
        wines.map((wine) => ({ ...wine, estimatedPrice: Number(wine.estimatedPrice) })),
      );
      this.varietalMappingSignal.set(new Map(Object.entries(mappings)));
    } catch {
      this.error.set('Could not load saved wines. Check that the API is running, then retry.');
    } finally {
      this.loading.set(false);
    }
  }

  private async save<T>(action: () => Promise<T>, update: (result: T) => void): Promise<void> {
    if (this.saving()) throw new Error('Another change is still being saved. Please try again.');
    this.saving.set(true);
    try {
      update(await action());
    } finally {
      this.saving.set(false);
    }
  }

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
    return this.wines().find((wine) => wine.id === id);
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
      const matchingKey = Object.keys(this.varietalMapping).find(
        (key) =>
          key.toLowerCase().includes(varietalLower) || varietalLower.includes(key.toLowerCase()),
      );
      if (matchingKey) {
        wineIds = this.varietalMapping[matchingKey];
      }
    }

    if (!wineIds || wineIds.length === 0) {
      return [];
    }

    return wineIds
      .map((id) => this.getWineById(id))
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
      maximumFractionDigits: 0,
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

  async addWine(wine: Omit<Wine, 'id'>): Promise<void> {
    await this.save(
      () => firstValueFrom(this.api.createWine(wine)),
      (saved) => {
        this.wines.update((wines) => [
          ...wines,
          { ...saved, estimatedPrice: Number(saved.estimatedPrice) },
        ]);
      },
    );
  }

  async updateWine(wine: Wine): Promise<void> {
    const { id, ...payload } = wine;
    await this.save(
      () => firstValueFrom(this.api.updateWine(id, payload)),
      (saved) => {
        this.wines.update((wines) =>
          wines.map((w) =>
            w.id === id ? { ...saved, estimatedPrice: Number(saved.estimatedPrice) } : w,
          ),
        );
      },
    );
  }

  async deleteWine(id: number): Promise<void> {
    await this.save(
      () => firstValueFrom(this.api.deleteWine(id)),
      () => {
        this.wines.update((wines) => wines.filter((w) => w.id !== id));
        this.varietalMappingSignal.update(
          (mapping) =>
            new Map(
              [...mapping].map(([label, ids]) => [label, ids.filter((wineId) => wineId !== id)]),
            ),
        );
      },
    );
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

  getMappingLabels(): string[] {
    return [
      ...new Set([
        ...this.varietalMappingSignal().keys(),
        ...this.pairingService.getAllPairings().flatMap((pairing) => pairing.pairingSuggestions),
      ]),
    ].sort();
  }

  async addWineToVarietal(varietal: string, wineId: number): Promise<void> {
    await this.save(
      () => firstValueFrom(this.api.addMapping(varietal, wineId)),
      () => {
        this.varietalMappingSignal.update((mapping) => {
          const next = new Map(mapping);
          next.set(varietal, [...new Set([...(next.get(varietal) || []), wineId])]);
          return next;
        });
      },
    );
  }

  async removeWineFromVarietal(varietal: string, wineId: number): Promise<void> {
    await this.save(
      () => firstValueFrom(this.api.removeMapping(varietal, wineId)),
      () => {
        this.varietalMappingSignal.update((mapping) => {
          const next = new Map(mapping);
          next.set(
            varietal,
            (next.get(varietal) || []).filter((id) => id !== wineId),
          );
          return next;
        });
      },
    );
  }

  // ==================== DATA EXPORT ====================

  /**
   * Export all wine data and mappings for backup/database migration
   */
  exportData(): { wines: Wine[]; varietalMappings: Record<string, number[]> } {
    return {
      wines: this.wines(),
      varietalMappings: Object.fromEntries(this.varietalMappingSignal()),
    };
  }
}
