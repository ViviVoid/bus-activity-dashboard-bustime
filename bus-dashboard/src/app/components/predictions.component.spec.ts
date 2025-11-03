import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { PredictionsComponent } from './predictions.component';
import { BustimeService } from '../services/bustime.service';
import { PredictionsResponse } from '../models/bustime.models';

describe('PredictionsComponent', () => {
  let component: PredictionsComponent;
  let fixture: ComponentFixture<PredictionsComponent>;
  let bustimeService: jasmine.SpyObj<BustimeService>;

  beforeEach(async () => {
    const bustimeServiceSpy = jasmine.createSpyObj('BustimeService', ['getPredictions']);

    await TestBed.configureTestingModule({
      imports: [PredictionsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BustimeService, useValue: bustimeServiceSpy }
      ]
    }).compileComponents();

    bustimeService = TestBed.inject(BustimeService) as jasmine.SpyObj<BustimeService>;
    fixture = TestBed.createComponent(PredictionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load predictions when stop ID is provided', () => {
    const mockResponse: PredictionsResponse = {
      'bustime-response': {
        prd: [
          {
            tmstmp: '20231103 10:30',
            typ: 'A',
            stpnm: 'Stop Name',
            stpid: '1234',
            vid: '5678',
            dstp: 1000,
            rt: '10',
            rtdd: 'Route 10',
            rtdir: 'North',
            des: 'Downtown',
            prdtm: '20231103 10:35',
            tablockid: 'block1',
            tatripid: 'trip1',
            dly: false,
            prdctdn: '5'
          }
        ]
      }
    };
    bustimeService.getPredictions.and.returnValue(of(mockResponse));

    component['stopId'] = '1234';
    component['loadPredictions']();

    expect(bustimeService.getPredictions).toHaveBeenCalledWith('1234');
    expect(component['predictions']().length).toBe(1);
    expect(component['predictions']()[0].rt).toBe('10');
  });

  it('should show error when stop ID is empty', () => {
    component['stopId'] = '';
    component['loadPredictions']();

    expect(component['error']()).toBe('Please enter a stop ID');
    expect(bustimeService.getPredictions).not.toHaveBeenCalled();
  });

  it('should handle error response', () => {
    const errorResponse: PredictionsResponse = {
      'bustime-response': {
        error: [{ msg: 'Invalid stop ID' }]
      }
    };
    bustimeService.getPredictions.and.returnValue(of(errorResponse));

    component['stopId'] = '9999';
    component['loadPredictions']();

    expect(component['error']()).toBe('Invalid stop ID');
    expect(component['predictions']().length).toBe(0);
  });

  it('should handle network error', () => {
    bustimeService.getPredictions.and.returnValue(throwError(() => new Error('Network error')));

    component['stopId'] = '1234';
    component['loadPredictions']();

    expect(component['error']()).toBe('Failed to load predictions. Please try again later.');
    expect(component['predictions']().length).toBe(0);
  });
});
