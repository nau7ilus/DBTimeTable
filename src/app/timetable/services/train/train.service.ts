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

type TrainInfo = {
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
  remarks: string[];
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
  }

  constructor(private http: HttpClient) { }

  getTrainData(stopId: string): Observable<TrainInfo[]> {
    const url = `${this.apiUrl}/${stopId}/departures?${this.toQueryString(this.options)}`;
    return this.http.get<any>(url).pipe(
      map(data => {

        const test = {
          "tripId": "2|#VN#1#ST#1729107992#PI#0#ZI#668365#TA#0#DA#221024#1S#8011471#1T#736#LS#8010224#LT#1047#PU#80#RT#1#CA#DPN#ZE#73725#ZB#RE 73725#PC#3#FR#8011471#FT#736#TO#8010224#TT#1047#",
          "stop": {
            "type": "station",
            "id": "8012666",
            "name": "Potsdam Hbf",
            "location": {
              "type": "location",
              "id": "8012666",
              "latitude": 52.391551,
              "longitude": 13.066711
            },
            "products": {
              "nationalExpress": true,
              "national": true,
              "regionalExp": false,
              "regional": true,
              "suburban": true,
              "bus": true,
              "ferry": false,
              "subway": false,
              "tram": true,
              "taxi": false
            }
          },
          "when": "2024-10-22T09:33:00+02:00",
          "plannedWhen": "2024-10-22T09:31:00+02:00",
          "delay": 120,
          "platform": "3",
          "plannedPlatform": "3",
          "prognosisType": "prognosed",
          "direction": "Magdeburg Hbf",
          "provenance": null,
          "line": {
            "type": "line",
            "id": "re-1",
            "fahrtNr": "73725",
            "name": "RE 1",
            "public": true,
            "adminCode": "OWRE__",
            "productName": "RE",
            "mode": "train",
            "product": "regional",
            "operator": {
              "type": "operator",
              "id": "ostdeutsche-eisenbahn-gmbh",
              "name": "Ostdeutsche Eisenbahn GmbH"
            },
            "additionalName": "RE 1"
          },
          "remarks": [],
          "origin": null,
          "destination": {
            "type": "station",
            "id": "8010224",
            "name": "Magdeburg Hbf",
            "location": {
              "type": "location",
              "id": "8010224",
              "latitude": 52.130495,
              "longitude": 11.6269
            },
            "products": {
              "nationalExpress": true,
              "national": true,
              "regionalExp": true,
              "regional": true,
              "suburban": true,
              "bus": true,
              "ferry": false,
              "subway": false,
              "tram": true,
              "taxi": false
            }
          },
          "currentTripPosition": {
            "type": "location",
            "latitude": 52.391551,
            "longitude": 13.066711
          }
        }

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
