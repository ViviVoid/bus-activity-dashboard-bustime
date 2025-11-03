import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BustimeService } from '../services/bustime.service';
import { Route } from '../models/bustime.models';

@Component({
  selector: 'app-routes-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="routes-container">
      <h2>Bus Routes</h2>
      @if (loading()) {
        <div class="loading">Loading routes...</div>
      }
      @if (error()) {
        <div class="error">{{ error() }}</div>
      }
      @if (routes().length > 0) {
        <div class="routes-grid">
          @for (route of routes(); track route.rt) {
            <div class="route-card" [style.border-left-color]="'#' + route.rtclr">
              <div class="route-number">{{ route.rt }}</div>
              <div class="route-name">{{ route.rtnm }}</div>
              @if (route.rtdd) {
                <div class="route-desc">{{ route.rtdd }}</div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .routes-container {
      padding: 1rem;
    }

    h2 {
      color: #333;
      margin-bottom: 1rem;
    }

    .loading, .error {
      padding: 1rem;
      text-align: center;
      border-radius: 8px;
    }

    .loading {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .error {
      background-color: #ffebee;
      color: #c62828;
    }

    .routes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }

    .route-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-left: 4px solid;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .route-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .route-number {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .route-name {
      font-size: 1rem;
      color: #666;
      margin-bottom: 0.25rem;
    }

    .route-desc {
      font-size: 0.875rem;
      color: #999;
    }
  `]
})
export class RoutesListComponent implements OnInit {
  private readonly bustimeService = inject(BustimeService);

  protected readonly routes = signal<Route[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadRoutes();
  }

  private loadRoutes(): void {
    this.loading.set(true);
    this.error.set(null);

    this.bustimeService.getRoutes().subscribe({
      next: (response) => {
        if (response['bustime-response'].error) {
          this.error.set(response['bustime-response'].error[0].msg);
        } else {
          this.routes.set(response['bustime-response'].routes || []);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load routes. Please try again later.');
        this.loading.set(false);
        console.error('Error loading routes:', err);
      }
    });
  }
}
