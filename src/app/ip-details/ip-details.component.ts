import { Component, OnInit } from '@angular/core';
import { MapService } from '../map.service';

@Component({
  selector: 'app-ip-details',
  templateUrl: './ip-details.component.html',
  styleUrls: ['./ip-details.component.css']
})
export class IpDetailsComponent implements OnInit {
  ipAddress: string = '';
  location: string = '';
  timezone: string = '';
  isp: string = '';

  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    // Subscribe to the ipAddress$ observable in the MapService
    this.mapService.ipAddress$.subscribe(async (ipAddress: string) => {
      this.ipAddress = ipAddress; // Assign the received IP address to the component property

      try {
        // Fetch the location details using the MapService
        const locationDetails = await this.mapService.fetchLocation(ipAddress);
        
        // Update the component properties with the fetched location details
        this.location = locationDetails.location;
        this.timezone = locationDetails.timezone;
        this.isp = locationDetails.isp;
      } catch (error) {
        console.error('Error fetching IP address location', error); // Log error message if fetching fails
      }
    });
  }
}
