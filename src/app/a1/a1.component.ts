import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import moment from 'moment';

@Component({
  selector: 'app-a1',
  imports: [],
  templateUrl: './a1.component.html',
  styleUrl: './a1.component.css'
})
export class A1Component {
  assignment:any;

  constructor(private http:HttpClient) {
  	this.http.get('calendar.json').subscribe(calendar => {
  		this.parseAssignment(calendar as {}, 'A1');
  	});
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
