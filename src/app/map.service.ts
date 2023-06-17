import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// Interface for location details
export interface LocationDetails {
  latitude: number;
  longitude: number;
  location: string;
  timezone: string;
  isp: string;
}

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private ipAddressSubject = new Subject<string>();
  ipAddress$ = this.ipAddressSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Method to search for an IP address
  searchIPAddress(ipAddress: string): void {
    this.ipAddressSubject.next(ipAddress);
  }

  // Method to fetch location details for an IP address
  fetchLocation(ipAddress: string): Promise<LocationDetails> {
    return new Promise((resolve) => {
      // Check if the location data is cached in localStorage
      const cachedLocation = localStorage.getItem(ipAddress);
      if (cachedLocation) {
        const cachedData = JSON.parse(cachedLocation);
        resolve(cachedData); // Resolve with cached location data
      } else {
        this.http.get(`https://ipapi.co/${ipAddress}/json/`).subscribe(
          (data: any) => {
            const latitude = parseFloat(data.latitude);
            const longitude = parseFloat(data.longitude);

            // Check if latitude and longitude values are valid
            if (!isNaN(latitude) && !isNaN(longitude)) {
              const locationDetails: LocationDetails = {
                latitude,
                longitude,
                location: `${data.city}, ${data.region}, ${data.country_name}`,
                timezone: `${data.timezone}`,
                isp: `${data.org}`
              };

              localStorage.setItem(ipAddress, JSON.stringify(locationDetails)); // Cache location data
              resolve(locationDetails); // Resolve with fetched location details
            }
          },
        );
      }
    });
  }
}
