import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { HeaderComponent } from './header/header.component';
import { TrackerComponent } from './tracker/tracker.component';
import { SearchIpComponent } from './search-ip/search-ip.component';
import { IpDetailsComponent } from './ip-details/ip-details.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    HeaderComponent,
    TrackerComponent,
    SearchIpComponent,
    IpDetailsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
