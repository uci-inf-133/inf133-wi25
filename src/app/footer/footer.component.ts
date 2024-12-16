import { Component } from '@angular/core';
import { MomentModule } from 'ngx-moment';

@Component({
  selector: 'app-footer',
  imports: [MomentModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  date: Date;

  constructor() {
    this.date = new Date();
  }
}
