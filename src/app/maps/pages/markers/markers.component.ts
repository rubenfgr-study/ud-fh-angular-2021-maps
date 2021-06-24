import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarkerColor {
  color: string;
  marker?: mapboxgl.Marker;
  center?: mapboxgl.LngLat;
}

@Component({
  selector: 'app-markers',
  templateUrl: './markers.component.html',
  styles: [
    `
      .list-group {
        z-index: 9999;
        > li {
          cursor: pointer;
        }
      }

      .map-container {
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class MarkersComponent implements AfterViewInit, OnDestroy {
  @ViewChild('map') divMap!: ElementRef;
  map!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [number, number] = [-2.413466432567081, 36.84070683548545];

  // Markers
  markers: MarkerColor[] = [];

  constructor() {}

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel,
      minZoom: 1,
      maxZoom: 18,
    });

    /* const markerHtml: HTMLElement = document.createElement('div');
    markerHtml.innerHTML = 'Hello World'; */

    /*  const marker = new mapboxgl.Marker({ draggable: true })
      .setLngLat(this.center)
      .addTo(this.map); */

    this.readMarkersFromLocalStorage();
  }

  ngOnDestroy(): void {
    this.saveMarkersInLocalStorage();
  }

  addMarker() {
    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );

    const newMarker = new mapboxgl.Marker({ draggable: true, color })
      .setLngLat(this.center)
      .addTo(this.map);

    this.markers.push({
      color,
      marker: newMarker,
    });
    newMarker.on('dragend', () => {
      this.saveMarkersInLocalStorage();
    });
  }

  goMarker(center: mapboxgl.LngLat) {
    this.map.flyTo({ center });
  }

  saveMarkersInLocalStorage() {
    const toSave = this.markers.map((m): MarkerColor => {
      return {
        color: m.color,
        center: m.marker!.getLngLat(),
      };
    });
    localStorage.setItem('markers', JSON.stringify(toSave));
  }

  readMarkersFromLocalStorage() {
    if (!localStorage.getItem('markers')) {
      return;
    }
    const markersData: MarkerColor[] = JSON.parse(
      localStorage.getItem('markers')!
    );
    markersData.forEach((m) => {
      const newMarker = new mapboxgl.Marker({ color: m.color, draggable: true })
        .setLngLat(m.center!)
        .addTo(this.map);
      this.markers.push({
        color: m.color,
        marker: newMarker,
      });
      newMarker.on('dragend', () => {
        this.saveMarkersInLocalStorage();
      });
    });
  }

  removeMarker(i: number) {
    this.markers[i].marker?.remove();
    this.markers.splice(i, 1);
    this.saveMarkersInLocalStorage();
  }
}
