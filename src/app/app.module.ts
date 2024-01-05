import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ViewerModule } from 'ng2-adsk-forge-viewer';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ViewerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
