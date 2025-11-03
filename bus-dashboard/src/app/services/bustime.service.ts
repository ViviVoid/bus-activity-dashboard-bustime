import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoutesResponse, PredictionsResponse } from '../models/bustime.models';

@Injectable({
  providedIn: 'root'
})
export class BustimeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/bustime';

  getRoutes(): Observable<RoutesResponse> {
    return this.http.get<RoutesResponse>(`${this.apiUrl}/routes`);
  }

  getPredictions(stopId: string): Observable<PredictionsResponse> {
    return this.http.get<PredictionsResponse>(`${this.apiUrl}/predictions/${stopId}`);
  }
}
