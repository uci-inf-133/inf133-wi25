import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import moment from 'moment';

@Component({
  selector: 'app-homepage',
  imports: [],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  assignments_and_quizzes:any[] = [];
  lectures:any[] = [];

  constructor(private http:HttpClient) {
  	this.http.get('./calendar.json').subscribe(calendar => {
  		this.parseCalendar(calendar as {});
  	});
  }

  parseCalendar(calendar:any) {
    let events:any[] = calendar['events'];
    //Add date string to each event
    events.map(e => {
      e['dateStr'] = moment(e['date']).format('ddd MMM D');
      return e;
    });
    //Filter by type
    this.assignments_and_quizzes = events.filter(e => e['type'] == 'assignment' || e['type'] == 'quiz');
    this.lectures = events.filter(e => e['type'] == 'lecture' || e['type'] == 'discussion');
    //Filter by past/future
    this.assignments_and_quizzes = this.assignments_and_quizzes.filter(e => moment().isSameOrBefore(moment(e['date']), 'days')).slice(0, 2);
    this.lectures = this.lectures.filter(e => moment().isSameOrAfter(moment(e['date']), 'days'));
    this.lectures = this.lectures.reverse().slice(0, 5);
  }

}
