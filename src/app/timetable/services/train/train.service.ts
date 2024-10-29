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
  type: "station" | "stop";
  id: string;
  name: string;
  location: Location;
  products: Products;
};

type ArrivalDepartureInfo = {
  departure: string;
  plannedDeparture: string;
  departureDelay: number | null;
  departurePlatform: string;
  departurePrognosisType: string | null;
  plannedDeparturePlatform: string;

  arrival: string;
  plannedArrival: string;
  arrivalDelay: number | null;
  arrivalPlatform: string;
  arrivalPrognosisType: string | null;
  plannedArrivalPlatform: string;
}

type StopOverStation = ArrivalDepartureInfo & Station;

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

type Remark = {
  type: 'status' | 'hint' | 'ZL' | 'hint';
  code: string;
  text: string;
  summary?: string;
}

export type DepartureInfo = {
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

type StopOver = {
  stop: Station;
} & ArrivalDepartureInfo;

export type TripInfo = {
  id: string;
  realtimeDataUpdatedAt: number;
  origin: Station;
  destination: Station;
  reachable: boolean;
  line: Line;
  direction: string;
  stopovers: StopOver[];
  remarks: Remark[];
} & StopOverStation;

@Injectable({
  providedIn: 'root'
})
export class TrainService {
  protected apiUrl = 'https://v5.db.transport.rest';

  constructor(private http: HttpClient) { }

  getDepartures(stopId: string): Observable<DepartureInfo[]> {
    const options = {
      bus: false,
      ferry: false,
      taxi: false,
      subway: false,
      tram: false,
      suburban: false,
      duration: 60,
      language: 'de',
      remarks: true
    }
    const requestUri = `${this.apiUrl}/stops/${stopId}/departures?${this.toQueryString(options)}`;
    return this.http.get<any>(requestUri).pipe(
      map(data => data as DepartureInfo[]),
      // TODO: Code dublicate
      catchError(error => {
        console.error('Fehler beim Abruf der Zugdaten:', error);
        return throwError(() => new Error('Zugdaten können nicht abgerufen werden'));
      }));
  }

  getTrip(tripId: string, lineName: string): Observable<TripInfo> {
    const uriEncodedTripId = encodeURIComponent(tripId);
    const uriEncodedLineName = encodeURIComponent(lineName)
    const requestUri = `${this.apiUrl}/trips/${uriEncodedTripId}?lineName=${uriEncodedLineName}`;
    return this.http.get<any>(requestUri).pipe(
      map(data => data as TripInfo),
      catchError(error => {
        console.error('Fehler beim Abruf der Zugdaten:', error);
        return throwError(() => new Error('Zugdaten können nicht abgerufen werden'));
      }));
  }

  private toQueryString(params: Record<string, any>): string {
    return Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
  }
}
