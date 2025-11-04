import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { RoutesResponse, PredictionsResponse } from '../models/bustime.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BustimeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  // Cached observable in memory and constants for localStorage keys and TTL
  private routesCache$?: Observable<RoutesResponse>;
  private readonly cacheKey = 'bus_routes_cache';
  private readonly cacheTimeKey = 'bus_routes_cache_timestamp';
  private readonly cacheTTL = 24 * 60 * 60 * 1000; // 24 hours

  getRoutes(): Observable<RoutesResponse> {
    const cachedData = localStorage.getItem(this.cacheKey);
    const cachedTime = localStorage.getItem(this.cacheTimeKey);
    const isCacheValid = cachedData && cachedTime && (Date.now() - +cachedTime) < this.cacheTTL;

    if (isCacheValid) {
      return of(JSON.parse(cachedData));
    } else {
      if (!this.routesCache$) { // Only create traffic when needed
        this.routesCache$ = this.http.get<RoutesResponse>(`${this.apiUrl}/routes`).pipe(
          tap((response) => {
            localStorage.setItem(this.cacheKey, JSON.stringify(response));
            localStorage.setItem(this.cacheTimeKey, Date.now().toString());
          }),
          shareReplay(1)
        );
      }
      return this.routesCache$;
    }
  }


  getPredictions(stopId: string): Observable<PredictionsResponse> {
    return this.http.get<PredictionsResponse>(`${this.apiUrl}/predictions/${stopId}`);
  }

  // Optional: manually clear cache (e.g. from a "Refresh" button)
  clearRoutesCache(): void {
    this.routesCache$ = undefined;
    localStorage.removeItem(this.cacheKey);
    localStorage.removeItem(this.cacheTimeKey);
  }
}
