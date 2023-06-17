import { Component } from '@angular/core';
import { MapService } from '../map.service';

@Component({
  selector: 'app-search-ip',
  templateUrl: './search-ip.component.html',
  styleUrls: ['./search-ip.component.css']
})
export class SearchIpComponent {
  ipAddress!: string;

  constructor(private mapService: MapService) {
  }

  searchIPAddress(): void {
    this.mapService.searchIPAddress(this.ipAddress);
  }
}
