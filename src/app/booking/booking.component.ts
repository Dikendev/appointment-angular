import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpServiceService } from '../services/http-service.service';
import { Service } from '../booking-list/booking-list.component';
import { formatDate } from '@angular/common';
import { ConstantPool } from '@angular/compiler';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export interface Time {
  hour: string;
  minute: string;
}

export interface Data {
  date: string;
  time: TimeRange;
}

export interface TimeRange {
  start: string;
  end: string;
}

export interface BookingData {
  [day: string]: string[];
}

export interface CellClasses {
  [dayAndTime: string]: string;
}

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingComponent implements OnInit {
  have2HoursSelected: boolean = false;
  formInputs!: FormGroup;
  servicesData!: Service[];
  times: Time[] = [];
  cleanButton: boolean = false;

  bookingData: BookingData = {
    'Sat : 04/05': ['07:30', '09:30'],
  };

  bookingByDay: BookingData = {};

  isBookingData(day: string, time: string): boolean {
    const bookingData = this.bookingData[day];

    if (!bookingData) {
      return false;
    }

    const [start, end] = bookingData;
    const timeRange = this.generateTimeBetween(start, end, 30);
    const rangeDate = [start, ...timeRange, end];
    const noDuplicates = this.removeDuplicates(rangeDate);

    if (!this.bookingByDay[day]) {
      this.bookingByDay[day] = timeRange;
    }

    return noDuplicates.includes(time);
  }

  isAlreadyBookend(day: string, time: string): boolean {
    const bookingData = this.bookingByDay[day];

    if (!bookingData) return false;

    return bookingData.includes(time);
  }

  timeToConfirm!: TimeRange;

  tabs = new Array(7).fill(0).map((_, index) => {
    const today = new Date();
    const currentDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + index
    );
    const formattedDate = formatDate(currentDate, 'dd/MM', 'en-US');
    console.log(`Tab ${index + 1}: ${formattedDate}`);
    const weekDays = WEEK_DAYS[currentDate.getDay()];
    console.log(`Tab ${index + 1}: ${weekDays}`);
    return `${weekDays} : ${formattedDate}`;
  });

  mockUsers = [
    {
      dayTime: 'Thu : 02/05',
      professional: 'Cristina',
      start: '06:00',
      end: '07:30',
      serviceName: 'Haircut',
      client: 'Diego',
    },
    {
      dayTime: 'Wed : 01/05',
      professional: 'Kennedy',
      start: '15:00',
      end: '17:30',
      serviceName: 'Haircut',
      client: 'Diego',
    },
  ];

  timeF(time: string) {
    console.log(`Time: ${time}`);
  }

  // Define a property to keep track of clicked cells
  clickedCells: BookingData = {};
  uniqueTimes: BookingData = {};

  hovering(): void {}

  isHoverEnable: boolean = false;
  // Function to handle cell click
  onCellClick(day: string, hour: string): void {
    if (this.have2HoursSelected) {
      this.cleanSelected();
      this.have2HoursSelected = false;
    }

    console.log(`Day: ${day}`);
    console.log(`Hour: ${hour}`);

    if (!this.clickedCells[day]) {
      // if another day reset the clicked cells
      this.clickedCells = {};
      this.clickedCells[day] = [hour];
      this.uniqueTimes = {};
      this.uniqueTimes[day] = [hour];

      this.canHoverCell();
      console.log('pushed and reset clicked cells');
    } else {
      if (this.clickedCells[day].length === 2) {
        console.log(this.clickedCells[day].length);
        // Cannot book more than 2 hours'

        this.clickedCells[day] = [hour];
        console.log(this.clickedCells);
        return;
      }

      console.log('pushing the second hour clicked');
      //if the second hour is lower then then first hour clicked then swap the hours

      this.clickedCells[day].push(hour);

      const times = this.clickedCells[day];
      const sortString = this.sortTime(times);

      this.clickedCells[day] = sortString;

      const start = this.clickedCells[day][0];
      const end = this.clickedCells[day][1];

      this.timeToConfirm = {
        start,
        end,
      };

      const timeBetween = this.generateTimeBetween(start, end, 30);
      const allTimesMerged = [...this.clickedCells[day], ...timeBetween];
      const uniqueTimes = this.removeDuplicates(allTimesMerged);

      this.uniqueTimes[day] = uniqueTimes;

      console.log('clicked', this.uniqueTimes);
      this.have2HoursSelected = true;
      this.canHoverCell();
      this.updateCellClasses();
      console.log('??????????');
    }
  }

  canHoverCell(): void {
    this.isHoverEnable = !this.isHoverEnable;
  }

  cleanSelected() {
    console.log('clean function');
    this.clickedCells = {};
    this.uniqueTimes = {};

    console.log('cleaned');
    console.log('clicked', this.clickedCells);
  }

  clean() {
    this.cleanButton = true;
    this.cleanSelected();

    setTimeout(() => {
      this.cleanButton = false;
    }, 100);
  }

  isLastCell(day: string, time: string): boolean {
    const lastTime = this.uniqueTimes[day];

    if (!lastTime) return false;

    const lastTimeIndex = lastTime[lastTime?.length - 1];

    if (!lastTimeIndex) {
      return false;
    } else if (lastTimeIndex === time) {
      return true;
    }
    return false;
  }

  cellClasses: CellClasses = {};

  calculateCellClasses() {
    for (const day of this.tabs) {
      for (const time of this.times) {
        const dayAndTime = `${day}-${time.hour}`;
        this.cellClasses[dayAndTime] = this.isCellClicked(day, time.hour);
      }
    }
  }

  // Call this function whenever data affecting CSS classes changes
  updateCellClasses() {
    this.calculateCellClasses();
  }

  getCellClass(day: string, hour: string): string {
    const dayAndTime = `${day}-${hour}`;
    return this.cellClasses[dayAndTime] || '';
  }

  isCellClicked(day: string, time: string): string {
    console.log('clicked ?????', this.clickedCells);
    if (this.uniqueTimes[day]?.includes(time)) {
      return 'bg-purple-700 hover:bg-blue-700';
    }

    return 'bg-green-700 hover:bg-purple-700';
  }

  removeDuplicates(times: string[]): string[] {
    const uniqueStrings = new Set(times);
    const arrayString = Array.from(uniqueStrings);
    const stringSorted = this.sortTime(arrayString);

    return stringSorted;
  }

  sortTime(times: string[]): string[] {
    return times.sort((a, b) => {
      return (
        new Date(`1970/01/01 ${a}`).getTime() -
        new Date(`1970/01/01 ${b}`).getTime()
      );
    });
  }

  generateTimeBetween(start: string, end: string, interval: number) {
    const timesBetween: string[] = [];

    const startTime = new Date(`1970/01/01 ${start}`);
    const endTime = new Date(`1970/01/01 ${end}`);

    let currentTime = startTime;
    while (currentTime < endTime) {
      timesBetween.push(this.formatTime(currentTime));
      currentTime.setMinutes(currentTime.getMinutes() + interval);
    }
    return timesBetween;
  }

  formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  public isBooked(day: string, hour: string): boolean {
    return this.mockUsers.some((user) => {
      const startTime = user.start;
      const endTime = user.end;
      const [bookingDay, bookingMonth] = user.dayTime
        .split(' : ')[1]
        .split('/');
      const currentDay = parseInt(bookingDay, 10);
      const currentMonth = parseInt(bookingMonth, 10);

      // Check if the time falls between start and end times
      if (
        user.dayTime === day &&
        parseInt(hour.split(':')[0]) >= parseInt(startTime.split(':')[0]) &&
        parseInt(hour.split(':')[0]) <= parseInt(endTime.split(':')[0])
      ) {
        return true;
      }
      // Check if the time falls between the previous day's end time and the current booking's start time
      else if (
        currentDay > 0 &&
        this.tabs.indexOf(day) > 0 &&
        this.tabs[this.tabs.indexOf(day) - 1].includes(bookingMonth) &&
        parseInt(hour.split(':')[0]) >= parseInt(endTime.split(':')[0]) &&
        parseInt(hour.split(':')[0]) < parseInt(startTime.split(':')[0])
      ) {
        return true;
      }
      return false;
    });
  }

  getBookingClient(day: string, hour: string): string {
    const user = this.mockUsers.find((user) => {
      const startTime = user.start;
      return user.dayTime === day && hour === startTime;
    });

    return user ? user.client : '';
  }

  ngOnInit(): void {
    this.formInputs = this.formBuilder.group({
      username: [''],
      bookingDateTime: [''],
      serviceName: [''],
    });

    this.bookingDateTime();
    this.formInputs.get('serviceName')?.setValue(2);
    // this.populate();
  }

  constructor(
    private formBuilder: FormBuilder,
    private backendService: HttpServiceService,
    public dialog: MatDialog
  ) {}

  async onSubmit(formInputs: FormGroup) {
    console.log(this.formInputs.value);
  }

  bookingDateTime() {
    for (let i = 6; i <= 24; i++) {
      const prefixHour = i < 10 ? `0${i}` : `${i}`;
      const hour = i < 10 ? `${prefixHour}:00` : `${prefixHour}:00`;
      this.times.push({
        hour: hour,
        minute: `${prefixHour}:30`,
      });
    }
  }

  public onDayClick(date: string): void {
    this.cleanButton = true;

    const timeRange = this.timeToConfirm;
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      date,
      time: { start: timeRange.start, end: timeRange.end },
    };

    this.openDialog(ConfirmModalComponent, dialogConfig);
  }

  openDialog(component: any, dialogConfig: MatDialogConfig<Time>): void {
    const dialogReference = this.dialog.open(component, dialogConfig);

    dialogReference.afterClosed().subscribe((result) => {
      if (result) {
        console.log('confirmed', result);
      } else {
        this.clean();

        console.log('canceled');
      }
    });

    setTimeout(() => {
      this.cleanButton = false;
    }, 100);
  }
}
