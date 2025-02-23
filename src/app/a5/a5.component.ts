import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import moment from 'moment';

@Component({
  selector: 'app-a5',
  imports: [],
  templateUrl: './a5.component.html',
  styleUrl: './a5.component.css'
})
export class A5Component {
  assignment:any;

  constructor(private http:HttpClient) {
  	this.http.get('./assets/calendar.json').subscribe(calendar => {
  		this.parseAssignment(calendar as {}, 'A4');
  	});
  }

  ngOnInit() {
  }

  parseAssignment(calendar:any, assignment:string) {
    let events:any[] = calendar['events'];

    //Filter to this assignment
    this.assignment = events.filter(e => e['type'] == 'assignment' && e['title'] == assignment)[0];
    
    //Set due date
	let due = moment(this.assignment['date'] + " " + calendar['defaults'].assignment.due);
    this.assignment['due'] = due.format('dddd, MMMM Do, h:mma');
  }
}
