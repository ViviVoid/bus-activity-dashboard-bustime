import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BustimeService } from './bustime.service';
import { RoutesResponse, PredictionsResponse } from '../models/bustime.models';

describe('BustimeService', () => {
  let service: BustimeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(BustimeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch routes', () => {
    const mockResponse: RoutesResponse = {
      'bustime-response': {
        routes: [
          { rt: '10', rtnm: 'Route 10', rtclr: '#FF0000' }
        ]
      }
    };

    service.getRoutes().subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(response['bustime-response'].routes?.length).toBe(1);
    });

    const req = httpMock.expectOne('/api/bustime/routes');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch predictions for a stop', () => {
    const stopId = '1234';
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

    service.getPredictions(stopId).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(response['bustime-response'].prd?.length).toBe(1);
    });

    const req = httpMock.expectOne(`/api/bustime/predictions/${stopId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
