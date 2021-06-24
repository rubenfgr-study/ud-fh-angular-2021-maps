import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
      .map-container {
        width: 100%;
        height: 100%;
      }

      .row {
        background-color: white;
        position: fixed;
        bottom: 50px;
        left: 50px;
        padding: 10px;
        border-radius: 5px;
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        z-index: 9999;
        max-width: 450px;
      }
    `,
  ],
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('map') divMap!: ElementRef;
  map!: mapboxgl.Map;
  zoomLevel: number = 10;
  lat: number = 36.84070683548545;
  lng: number = -2.413466432567081;

  constructor() {}

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.lng, this.lat],
      zoom: this.zoomLevel,
      minZoom: 1,
      maxZoom: 18
    });

    this.map.on('zoom', () => {
      this.zoomLevel = this.map.getZoom();
    });

    this.map.on('move', () => {
      const lngLat: mapboxgl.LngLat = this.map.getCenter();
      this.lng = lngLat.lng;
      this.lat = lngLat.lat;
    });
  }

  ngOnDestroy(): void {
    this.map.off('zoom', () =>{});
    this.map.off('move', () =>{});
  }

  rangeChange(zoom: string) {
    this.map.zoomTo(parseFloat(zoom));
  }

  zoomIn() {
    this.map.zoomIn();
  }

  zoomOut() {
    this.map.zoomOut();
  }
}
