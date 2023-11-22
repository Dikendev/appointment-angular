import { Component } from '@angular/core';

export interface BookingTable {
  hour: string;
  name: string;
  service: string;
  observation: string;
  duration: number;
}

const DATA: BookingTable[] = [
  {
    hour: '8:00',
    name: 'Cristina',
    service: 'Corte Cabelo',
    observation: 'Pagou adiantado',
    duration: 1,
  },
  {
    hour: '',
    name: '',
    service: '',
    observation: '',
    duration: 1,
  },
  {
    hour: '09:00',
    name: 'Diego',
    service: 'Corte Cabelo',
    observation: '',
    duration: 0,
  },
  {
    hour: '',
    name: '',
    service: '',
    observation: '',
    duration: 0,
  },

  {
    hour: '10:00',
    name: 'Diego',
    service: 'Corte Cabelo',
    observation: '',
    duration: 0,
  },
  {
    hour: '',
    name: '',
    service: '',
    observation: '',
    duration: 0,
  },
  {
    hour: '11:00',
    name: 'Joy',
    service: 'Unha',
    observation: 'Cor azul do esmalte',
    duration: 1,
  },
  {
    hour: '',
    name: '',
    service: '',
    observation: '',
    duration: 1,
  },
];

@Component({
  selector: 'app-booking-day',
  templateUrl: './booking-day.component.html',
  styleUrls: ['./booking-day.component.css'],
})
export class BookingDayComponent {
  displayedColumns: string[] = ['hour', 'name'];
  dataSource = DATA;
  clickedRows = new Set<BookingTable>();

  logClickedRow(row: BookingTable): void {
    console.log('Clicked row:', row);
  }
}
