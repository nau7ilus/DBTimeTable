import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

type Location = {
  type: "location";
  id: string;
  latitude: number;
  longitude: number;
};

type Products = {
  nationalExpress: boolean;
  national: boolean;
  regionalExp: boolean;
  regional: boolean;
  suburban: boolean;
  bus: boolean;
  ferry: boolean;
  subway: boolean;
  tram: boolean;
  taxi: boolean;
};

type Station = {
  type: "station";
  id: string;
  name: string;
  location: Location;
  products: Products;
};

type LineOperator = {
  type: "operator";
  id: string;
  name: string;
};

type Line = {
  type: "line";
  id: string;
  fahrtNr: string;
  name: string;
  public: boolean;
  adminCode: string;
  productName: string;
  mode: string;
  product: string;
  operator: LineOperator;
  additionalName: string;
};

export type TrainInfo = {
type Remark = {
  type: 'status';
  code: null;
  text: string;
  summary?: string;
}

  tripId: string;
  stop: Station;
  when: string;
  plannedWhen: string;
  delay: number;
  platform: string;
  plannedPlatform: string;
  prognosisType: string;
  direction: string;
  provenance: string | null;
  line: Line;
  remarks: Remark[];
  origin: Station | null;
  destination: Station;
  currentTripPosition: Location;
};

@Injectable({
  providedIn: 'root'
})
export class TrainService {
  private apiUrl = 'https://v5.db.transport.rest/stops';
  private options = {
    bus: false,
    ferry: false,
    taxi: false,
    subway: false,
    tram: false,
    suburban: false,
    duration: 60
    duration: 60,
    language: 'de',
    remarks: true
  }

  constructor(private http: HttpClient) { }

  getTrainData(stopId: string): Observable<TrainInfo[]> {
    const url = `${this.apiUrl}/${stopId}/departures?${this.toQueryString(this.options)}`;
    return this.http.get<any>(url).pipe(
      map(data => {
        return data as TrainInfo[];
      }),
      catchError(error => {
        console.error('Fehler beim Datenabruf:', error);
        return throwError(() => new Error('Zugdaten können nicht abgerufen werden'));
      })
    );
  }

  private toQueryString(params: Record<string, any>): string {
    return Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
  }
}
