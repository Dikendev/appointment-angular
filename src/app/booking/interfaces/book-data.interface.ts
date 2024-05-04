export interface Data {
  date: string;
  time: TimeRange;
}
export interface BookingData {
  [day: string]: string[];
}

export interface TimeRange {
  start: string;
  end: string;
}

export interface Time {
  hour: string;
  minute: string;
}
