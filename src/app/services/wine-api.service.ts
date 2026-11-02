import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Wine } from '../models/wine.model';
import { environment } from '../../environments/environment';

/**
 * Service for communicating with the Wine API backend.
 * This service handles all HTTP calls to the NestJS backend.
 * Catalog load and write failures propagate so the UI can report them.
 */
@Injectable({
  providedIn: 'root',
})
export class WineApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  // ==================== WINES ====================

  getAllWines(): Observable<Wine[]> {
    return this.http.get<Wine[]>(`${this.baseUrl}/wines`);
  }

  getWine(id: number): Observable<Wine | null> {
    return this.http.get<Wine>(`${this.baseUrl}/wines/${id}`).pipe(catchError(() => of(null)));
  }

  createWine(wine: Omit<Wine, 'id'>): Observable<Wine> {
    return this.http.post<Wine>(`${this.baseUrl}/wines`, wine);
  }

  updateWine(id: number, wine: Partial<Wine>): Observable<Wine> {
    return this.http.patch<Wine>(`${this.baseUrl}/wines/${id}`, wine);
  }

  deleteWine(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/wines/${id}`);
  }

  getVarietals(): Observable<string[]> {
    return this.http
      .get<string[]>(`${this.baseUrl}/wines/varietals`)
      .pipe(catchError(() => of([])));
  }

  // ==================== VARIETAL MAPPINGS ====================

  getAllMappings(): Observable<Record<string, number[]>> {
    return this.http.get<Record<string, number[]>>(`${this.baseUrl}/varietal-mappings`);
  }

  getWinesForVarietal(varietal: string): Observable<Wine[]> {
    return this.http
      .get<Wine[]>(`${this.baseUrl}/varietal-mappings/${encodeURIComponent(varietal)}`)
      .pipe(catchError(() => of([])));
  }

  getRecommendations(varietals: string[], limit: number = 10): Observable<Wine[]> {
    const params = {
      varietals: varietals.join(','),
      limit: limit.toString(),
    };
    return this.http
      .get<Wine[]>(`${this.baseUrl}/varietal-mappings/recommendations`, { params })
      .pipe(catchError(() => of([])));
  }

  addMapping(varietal: string, wineId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/varietal-mappings`, { varietal, wineId });
  }

  removeMapping(varietal: string, wineId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/varietal-mappings/${encodeURIComponent(varietal)}/${wineId}`,
    );
  }

  getMappingVarietals(): Observable<string[]> {
    return this.http
      .get<string[]>(`${this.baseUrl}/varietal-mappings/varietals`)
      .pipe(catchError(() => of([])));
  }

  // ==================== HEALTH CHECK ====================

  checkApiHealth(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.http.get(`${this.baseUrl}`, { responseType: 'text' }).subscribe({
        next: () => {
          observer.next(true);
          observer.complete();
        },
        error: () => {
          observer.next(false);
          observer.complete();
        },
      });
    });
  }
}
