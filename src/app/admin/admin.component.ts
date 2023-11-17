import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../services/http-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';

export interface ServiceData {
  id: number;
  name: string;
  price: number;
  requiredTimeMin: number;
  serviceImage: string;
  updatedAt: Date;
}
export interface CreateService {
  name: string;
  price: number;
  requiredTimeMin: number;
  serviceImage: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  services: ServiceData[] = [];
  createServiceFormInputs!: FormGroup;

  ngOnInit(): void {
    this.createServiceFormInputs = this.formBuilder.group({
      name: [''],
      price: [''],
      requiredTimeMin: [''],
      serviceImage: [''],
    });
    this.getServices();
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly backendService: HttpServiceService
  ) {}

  async getServices() {
    this.backendService.services().subscribe(
      (response) => {
        this.services = response;
      },
      (error) => {
        console.error('Error fetching services:', error);
      }
    );
  }

  async deleteService(serviceName: string) {
    this.backendService.deleteService(serviceName).subscribe(
      () => {
        this.getServices();
      },
      (error) => {
        console.error('Error deleting service:', error);
      }
    );
  }

  async onSubmit(createServiceFormInputs: FormGroup) {
    console.log(this.createServiceFormInputs.value);
    this.backendService.createService(createServiceFormInputs.value).subscribe(
      () => {
        this.getServices();
      },
      (error) => {
        console.error('Error creating service:', error);
      }
    );
  }
}
