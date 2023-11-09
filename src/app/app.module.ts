import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BookingComponent } from './booking/booking.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BookingListComponent } from './booking-list/booking-list.component';

@NgModule({
  declarations: [
    AppComponent,
    BookingComponent,
    HomeComponent,
    NavbarComponent,
    BookingListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MatButtonModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],

  bootstrap: [AppComponent],
})
export class AppModule {}
