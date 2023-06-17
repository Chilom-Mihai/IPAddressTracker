import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { MapService, LocationDetails } from '../map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnDestroy {
  private map!: L.Map;
  ipAddress: string = ''; // IP address of the location
  location: string = ''; // Location description
  timezone: string = ''; // Timezone of the location
  isp: string = ''; // ISP of the location
  private marker: L.Marker | null = null; // Marker object on the map
  private subscription: Subscription; // Subscription to IP address changes

  constructor(private http: HttpClient, private mapService: MapService) {
    this.subscription = new Subscription(); // Initialize the subscription
  }

  // Initialize the map
  private initMap(): void {
    this.map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 3
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 1,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  // Display marker on the map with location details
  private showMarker(latitude: number, longitude: number, location: string, timezone: string, isp: string): void {
    const markerIcon = L.icon({
      iconUrl: 'assets/images/icon-location.svg',
      iconSize: [20, 20],
    });

    // Remove previous marker if it exists
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    // Add marker to the map
    this.marker = L.marker([latitude, longitude], { icon: markerIcon }).addTo(this.map);

    // Update location details
    this.location = location;
    this.timezone = timezone;
    this.isp = isp;
  }

  // After the view has been initialized
  ngAfterViewInit(): void {
    this.initMap(); // Initialize the map

    this.subscription.add(
      this.mapService.ipAddress$.subscribe(async (ipAddress: string) => {
        this.ipAddress = ipAddress; // Update the IP address property
        try {
          const locationDetails = await this.mapService.fetchLocation(ipAddress); // Fetch location details
          this.location = locationDetails.location; // Update location property
          this.timezone = locationDetails.timezone; // Update timezone property
          this.isp = locationDetails.isp; // Update ISP property
          this.showMarker(
            locationDetails.latitude, // Latitude of the location
            locationDetails.longitude, // Longitude of the location
            locationDetails.location, // Location description
            locationDetails.timezone, // Timezone of the location
            locationDetails.isp // ISP of the location
          );
          this.map.setView([locationDetails.latitude, locationDetails.longitude], 14); // Set the view to the location
        } catch (error) {
          console.error('Error fetching IP address location', error);
        }
      })
    );
  }

  // Before the component is destroyed
  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Unsubscribe from IP address changes
  }
}
