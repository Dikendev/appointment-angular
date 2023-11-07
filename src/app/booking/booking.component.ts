import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingComponent implements OnInit {
  formInputs!: FormGroup;

  ngOnInit(): void {
    this.formInputs = this.formBuilder.group({
      username: [''],
    });
  }

  constructor(private formBuilder: FormBuilder) {}

  onSubmit(formInputs: FormGroup) {
    console.log(this.formInputs.value);
  }
}
