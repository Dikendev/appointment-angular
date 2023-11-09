import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { HttpServiceService } from '../services/http-service.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingComponent implements OnInit {
  formInputs!: FormGroup;
  serviceData!: any;

  serviceSignal = signal(0);
  ngOnInit(): void {
    this.formInputs = this.formBuilder.group({
      username: [''],
      bookingDateTime: [''],
      serviceName: [''],
    });
  }

  constructor(
    private formBuilder: FormBuilder,
    private readonly serviceApi: HttpServiceService,
    private apiService: HttpServiceService
  ) {}

  onSubmit(formInputs: FormGroup) {
    console.log(this.formInputs.value);
    const data = this.getServices();
    console.log('Service DATA', this.serviceData);
    console.log('Service signal', this.serviceSignal());
  }

  getServices() {
    this.apiService.getServices().subscribe((data: any) => {
      this.serviceData = data;
      this.serviceSignal.set(data);
    });
  }
}
