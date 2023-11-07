import { Component } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  services!: any;

  title = 'appointment-angular';

  constructor(private readonly appService: AppService) {}

  getServices() {
    this.appService.getServices().subscribe(
      (data: any) => {
        this.services = data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
}
