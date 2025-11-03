import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BustimeService } from '../services/bustime.service';
import { Prediction } from '../models/bustime.models';

@Component({
  selector: 'app-predictions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="predictions-container">
      <h2>Bus Predictions</h2>
      <div class="input-group">
        <input
          type="text"
          [(ngModel)]="stopId"
          placeholder="Enter Stop ID"
          class="stop-input"
          (keyup.enter)="loadPredictions()"
        />
        <button (click)="loadPredictions()" class="search-btn">
          Get Predictions
        </button>
      </div>

      @if (loading()) {
        <div class="loading">Loading predictions...</div>
      }
      @if (error()) {
        <div class="error">{{ error() }}</div>
      }
      @if (predictions().length > 0) {
        <div class="predictions-list">
          @for (pred of predictions(); track pred.tatripid) {
            <div class="prediction-card">
              <div class="prediction-header">
                <span class="route-badge">Route {{ pred.rt }}</span>
                <span class="countdown" [class.arriving]="pred.prdctdn === 'DUE'">
                  {{ pred.prdctdn === 'DUE' ? 'ARRIVING' : pred.prdctdn + ' min' }}
                </span>
              </div>
              <div class="prediction-details">
                <div class="detail-row">
                  <span class="label">To:</span>
                  <span class="value">{{ pred.des }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Stop:</span>
                  <span class="value">{{ pred.stpnm }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Direction:</span>
                  <span class="value">{{ pred.rtdir }}</span>
                </div>
                @if (pred.dly) {
                  <div class="delay-badge">Delayed</div>
                }
              </div>
            </div>
          }
        </div>
      }
      @if (!loading() && predictions().length === 0 && searchPerformed()) {
        <div class="no-results">No predictions found for this stop ID.</div>
      }
    </div>
  `,
  styles: [`
    .predictions-container {
      padding: 1rem;
    }

    h2 {
      color: #333;
      margin-bottom: 1rem;
    }

    .input-group {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .stop-input {
      flex: 1;
      padding: 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .stop-input:focus {
      outline: none;
      border-color: #1976d2;
    }

    .search-btn {
      padding: 0.75rem 1.5rem;
      background-color: #1976d2;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .search-btn:hover {
      background-color: #1565c0;
    }

    .loading, .error, .no-results {
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

    .no-results {
      background-color: #fff3e0;
      color: #e65100;
    }

    .predictions-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .prediction-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .prediction-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .route-badge {
      background-color: #1976d2;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 16px;
      font-weight: bold;
      font-size: 0.875rem;
    }

    .countdown {
      font-size: 1.25rem;
      font-weight: bold;
      color: #2e7d32;
    }

    .countdown.arriving {
      color: #d32f2f;
      animation: pulse 1s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    .prediction-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .detail-row {
      display: flex;
      gap: 0.5rem;
    }

    .label {
      font-weight: bold;
      color: #666;
      min-width: 80px;
    }

    .value {
      color: #333;
    }

    .delay-badge {
      display: inline-block;
      background-color: #ff9800;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: bold;
      margin-top: 0.5rem;
    }
  `]
})
export class PredictionsComponent {
  private readonly bustimeService = inject(BustimeService);

  protected stopId = '';
  protected readonly predictions = signal<Prediction[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly searchPerformed = signal(false);

  protected loadPredictions(): void {
    if (!this.stopId.trim()) {
      this.error.set('Please enter a stop ID');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.searchPerformed.set(true);

    this.bustimeService.getPredictions(this.stopId.trim()).subscribe({
      next: (response) => {
        if (response['bustime-response'].error) {
          this.error.set(response['bustime-response'].error[0].msg);
          this.predictions.set([]);
        } else {
          this.predictions.set(response['bustime-response'].prd || []);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load predictions. Please try again later.');
        this.predictions.set([]);
        this.loading.set(false);
        console.error('Error loading predictions:', err);
      }
    });
  }
}
