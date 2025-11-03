import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { RoutesListComponent } from './routes-list.component';
import { BustimeService } from '../services/bustime.service';
import { RoutesResponse } from '../models/bustime.models';

describe('RoutesListComponent', () => {
  let component: RoutesListComponent;
  let fixture: ComponentFixture<RoutesListComponent>;
  let bustimeService: jasmine.SpyObj<BustimeService>;

  beforeEach(async () => {
    const bustimeServiceSpy = jasmine.createSpyObj('BustimeService', ['getRoutes']);

    await TestBed.configureTestingModule({
      imports: [RoutesListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BustimeService, useValue: bustimeServiceSpy }
      ]
    }).compileComponents();

    bustimeService = TestBed.inject(BustimeService) as jasmine.SpyObj<BustimeService>;
    fixture = TestBed.createComponent(RoutesListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load routes on init', () => {
    const mockResponse: RoutesResponse = {
      'bustime-response': {
        routes: [
          { rt: '10', rtnm: 'Route 10', rtclr: 'FF0000' }
        ]
      }
    };
    bustimeService.getRoutes.and.returnValue(of(mockResponse));

    fixture.detectChanges(); // triggers ngOnInit

    expect(bustimeService.getRoutes).toHaveBeenCalled();
    expect(component['routes']().length).toBe(1);
    expect(component['routes']()[0].rt).toBe('10');
  });

  it('should handle error response', () => {
    const errorResponse: RoutesResponse = {
      'bustime-response': {
        error: [{ msg: 'API Error' }]
      }
    };
    bustimeService.getRoutes.and.returnValue(of(errorResponse));

    fixture.detectChanges();

    expect(component['error']()).toBe('API Error');
  });

  it('should handle network error', () => {
    bustimeService.getRoutes.and.returnValue(throwError(() => new Error('Network error')));

    fixture.detectChanges();

    expect(component['error']()).toBe('Failed to load routes. Please try again later.');
  });
});
