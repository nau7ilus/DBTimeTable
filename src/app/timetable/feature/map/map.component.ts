import { AfterViewInit, Component, Input } from '@angular/core';
import * as L from 'leaflet';
import { TripInfo } from '../../services/train/train.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit {
  private map!: L.Map;
  @Input('trainCoords') trainCoords: L.LatLngTuple = [52.52, 13.40];
  @Input('tripInfo') tripInfo!: TripInfo;
  trainMarker!: L.Marker;

  private initMap(): void {
    this.map = L.map('map', {
      center: this.trainCoords,
      zoom: 13
    })

    L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
      maxZoom: 15,
      minZoom: 10,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map)

    L.tileLayer('https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', {
      maxZoom: 15,
      minZoom: 10,
      attribution: 'Map data: © OpenRailwayMap contributors'
    }).addTo(this.map);


    setTimeout(() => {
      this.map.invalidateSize(true);
    }, 100);


    const stationIcon = L.icon({
      iconUrl: '/assets/images/stop.svg',
      iconSize: [25, 25]
    })


    for (const stopover of this.tripInfo.stopovers) {
      L.marker([stopover.stop.location.latitude, stopover.stop.location.longitude], { icon: stationIcon }).addTo(this.map)
    }

    L.polyline(this.tripInfo.stopovers.map(s => [s.stop.location.latitude, s.stop.location.longitude]), {
      color: 'blue',
      weight: 4,
      opacity: 0.7,
      smoothFactor: 2
    }).addTo(this.map)


    this.setTrainMarker()

    setInterval(() => {
      this.setTrainMarker()
    }, 5000)
  }

  setTrainMarker(): void {
    const trainIcon = L.icon({
      iconUrl: '/assets/images/train.png',
      iconSize: [30, 45]
    })

    if (!this.trainMarker) {
      this.trainMarker = L.marker(this.trainCoords, { icon: trainIcon }).addTo(this.map);
    } else {
      this.trainMarker.setLatLng(this.trainCoords)
      this.map.panTo(this.trainCoords)
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
