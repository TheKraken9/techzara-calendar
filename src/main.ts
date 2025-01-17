import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CalendarComponent } from './app/components/calendar/calendar.component';
import { EventService } from './app/services/event.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CalendarComponent],
  providers: [EventService],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Calendrier annuel des activités 2025 | TechZara</h1>
      <app-calendar></app-calendar>
    </div>
  `,
})
export class App {
  name = 'Calendar App';
}

bootstrapApplication(App, {
  providers: [EventService]
});