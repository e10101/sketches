import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import {
  MisraGriesComponent,
  MajorityPositionPipe,
} from './misra-gries';

@NgModule({
  declarations: [
    MajorityPositionPipe,
    AppComponent,
    MisraGriesComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
