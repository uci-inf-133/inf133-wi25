import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import moment from 'moment';

@Component({
  selector: 'app-calendar',
  imports: [],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  calendar:any[] = [];

  constructor(private http:HttpClient) {
  	this.http.get('calendar.json').subscribe(calendar => {
  		this.parseCalendar(calendar as any);
  	});
  }

  parseCalendar(calendar:any) {
  	const typeOrder = ["holiday", "absence", "assignment", "quiz", "lecture", "discussion", "officehours_sohyeon", "officehours_weijun", "officehours_emily", "officehours_ziqi", "officehours_daniel"]

    let events:any[] = calendar['events'];
    //Add date string to each event
    
    events.sort((a, b) => {
		return moment(a.date).diff(moment(b.date));
	});
	var start_date = moment(events[0].date);
	var end_date = moment(events[events.length - 1].date);
	var calendar_start_date = moment(start_date).subtract(start_date.day(), "days");
	var calendar_end_date = moment(end_date).subtract(end_date.day(), "days").add(1, "weeks");
	var calendar_dates:any = [];
	// Add each date between the first and last event
	while(calendar_start_date.isBefore(calendar_end_date)) {
		calendar_dates.push({
			"month": calendar_start_date.month(),
			"date": calendar_start_date.date(),
			"weekday": calendar_start_date.weekday(),
			"dateStr": calendar_start_date.format("MMM D"),
			"dateStrFull": calendar_start_date.format("ddd MMM D"),
			"today": calendar_start_date.isSame(moment(), 'day'),
			"weekend": calendar_start_date.day() == 0 || calendar_start_date.day() == 6, //Saturday or Sunday
			"events": []
		});
		calendar_start_date.add(1, "days");
	}
	//Add events for each date
	var eventI = 0;
	for(var calendarI = 0; calendarI < calendar_dates.length; ) {
		if(eventI >= events.length) {
			calendarI++;
			continue;
		}
		var event = events[eventI];
		var calendar_date = calendar_dates[calendarI];
		var eventDate = moment(event.date);
		if(calendar_date.month == eventDate.month() && calendar_date.date == eventDate.date()) {
			var eventsToPush:any[] = [];
			//Add defaults
			if(event.type in calendar['defaults'] && "place" in calendar['defaults'][event.type]) {
				var ev:any = {
					"places": []
				}
				if(Array.isArray(calendar['defaults'][event.type]["place"])) {
					ev.places = calendar['defaults'][event.type]["place"].map((place:any) => {
						var start_time = moment(event.date + " " + place.time);
						if("time" in event) {
							start_time = moment(event.date + " " + event.time);
						}
						var end_time = moment(start_time).add(place.duration, "minutes");
						if("duration" in event) {
							end_time = moment(start_time).add(event.duration, "minutes");
						}
						return {
							"timeStr": start_time.format("h:mm") + "-" + end_time.format("h:mm"),
							"location": "location" in event ? event.location : place.location,
							"link": place.link ? place.link : null
						};
					});
					if("time" in event && "duration" in event) {
						ev.places = [ev.places[0]];
					}
				} else if(!calendar['defaults'][event.type]["place"]) {
					var start_time = null
					if("time" in event) {
						start_time = moment(event.date + " " + event.time);
					}
					var end_time = null;
					if("duration" in event) {
						end_time = moment(start_time).add(event.duration, "minutes");
					}
					if("location" in event) {
						loc = event.location;
					}
					if(start_time && end_time) {
						ev.places.push({
							"timeStr": [start_time.format("h:mm") + "-" + end_time.format("h:mm")],
							"location": [loc],
							"link": place.link ? place.link : null
						});
					}
				} else {
					var place = calendar['defaults'][event.type]["place"];
					var start_time:any = moment(event.date + " " + place.time);
					var loc = place.location;
					if("time" in event) {
						start_time = moment(event.date + " " + event.time);
					}
					var end_time:any = moment(start_time).add(place.duration, "minutes");
					if("duration" in event) {
						end_time = moment(start_time).add(event.duration, "minutes");
					}
					if("location" in event) {
						loc = event.location;
					}
					ev.places.push({
						"timeStr": [start_time.format("h:mm") + "-" + end_time.format("h:mm")],
						"location": [loc],
						"link": place.link ? place.link : null
					});
					ev["label"] = place.label;
				}
				eventsToPush.push(ev);
			} else {
				eventsToPush.push({});
			}
			eventsToPush.forEach((e, i) => {
				eventsToPush[i].type = event.type;
				if("title" in event) {
					eventsToPush[i].title = event.title;
				}
				if("name" in event) {
					eventsToPush[i].name = event.name;
				}
				if("link" in event) {
					eventsToPush[i].link = event.link;
				}
				if("recording" in event) {
					eventsToPush[i].recording = event.recording;
				}
				if("location" in event) {
					eventsToPush[i].location = event.location;
				}
				if("demo" in event) {
					eventsToPush[i].demo = event.demo;
				}
			});
			calendar_dates[calendarI].events = (calendar_dates[calendarI].events as any[]).concat(eventsToPush as any[]);
			eventI++;
		} else {
			//Sort events in date
			calendar_dates[calendarI].events.sort((a:any, b:any) => {
				return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
			});
			calendarI++;
		}
	}
	this.calendar = calendar_dates;
  }
}
