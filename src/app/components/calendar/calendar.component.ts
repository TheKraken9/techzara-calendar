import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, setYear, startOfWeek, endOfWeek } from 'date-fns';
import { EventService } from '../../services/event.service';
import { CalendarEvent } from '../../models/event.model';
import { EventModalComponent } from '../event-modal/event-modal.component';
import { EventDetailsComponent } from '../event-details/event-details.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, EventModalComponent, EventDetailsComponent],
  template: `
    <div class="p-4">
      <div class="flex items-center justify-between mb-4">
        <button 
          (click)="previousMonth()" 
          class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Précédent
        </button>
        <div class="text-2xl font-bold">
          {{ currentMonthYear }}
        </div>
        <button 
          (click)="nextMonth()" 
          class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Suivant
        </button>
      </div>
      <div class="grid grid-cols-7 gap-2">
        <div *ngFor="let day of weekDays" class="text-center font-bold p-2">
          {{ day }}
        </div>
        <ng-container *ngFor="let date of calendarDays">
          <div [class]="'p-2 border rounded hover:bg-gray-50 min-h-[80px] relative ' + (isCurrentMonth(date) ? '' : 'bg-gray-50')">
            <div class="flex justify-between items-center mb-2">
              <span>{{ date | date:'d' }}</span>
              <button 
                *ngIf="isCurrentMonth(date)"
                (click)="openAddEventModal(date)"
                class="text-blue-500 hover:text-blue-700 font-bold text-lg"
              >
                +
              </button>
            </div>
            <div *ngFor="let event of getEventsForDate(date)" 
                 class="text-xs bg-blue-100 p-1 mb-1 rounded group relative">
              <div class="flex justify-between items-center">
                <span class="cursor-pointer" (click)="openEventDetails(event)">
                  {{ event.nom }} - {{ event.heure }}
                </span>
                <div class="flex gap-1">
                  <button 
                    (click)="editEvent(event)"
                    class="text-blue-500 hover:text-blue-700"
                  >
                    ✎
                  </button>
                  <button 
                    (click)="deleteEvent(event)"
                    class="text-red-500 hover:text-red-700"
                  >
                    -
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
    <app-event-modal
      *ngIf="showModal"
      [selectedDate]="selectedDate"
      [editingEvent]="editingEvent"
      (close)="closeModal()"
      (save)="saveEvent($event)">
    </app-event-modal>
    <app-event-details
      *ngIf="showDetails"
      [event]="selectedEvent"
      (close)="closeDetails()">
    </app-event-details>
  `
})
export class CalendarComponent implements OnInit {
  weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  calendarDays: Date[] = [];
  currentMonthYear = '';
  events: CalendarEvent[] = [];
  showModal = false;
  showDetails = false;
  selectedDate: Date | null = null;
  selectedEvent: CalendarEvent | null = null;
  editingEvent: CalendarEvent | null = null;
  currentDate: Date;

  constructor(private eventService: EventService) {
    this.currentDate = setYear(new Date(), 2025);
    this.currentDate.setMonth(0);
  }

  async ngOnInit() {
    this.loadCalendarDays();
    await this.loadEvents();
  }

  private async loadEvents() {
    this.events = await this.eventService.getEvents();
  }

  private loadCalendarDays() {
    const start = startOfWeek(startOfMonth(this.currentDate));
    const end = endOfWeek(endOfMonth(this.currentDate));
    this.calendarDays = eachDayOfInterval({ start, end });
    this.currentMonthYear = format(this.currentDate, 'MMMM yyyy');
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentDate.getMonth();
  }

  getEventsForDate(date: Date): CalendarEvent[] {
    return this.events.filter(event => 
      format(new Date(event.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  }

  openAddEventModal(date: Date) {
    this.selectedDate = date;
    this.editingEvent = null;
    this.showModal = true;
  }

  editEvent(event: CalendarEvent) {
    this.editingEvent = event;
    this.selectedDate = new Date(event.date);
    this.showModal = true;
  }

  deleteEvent(event: CalendarEvent) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      this.eventService.deleteEvent(event.id!);
      this.loadEvents();
    }
  }

  openEventDetails(event: CalendarEvent) {
    this.selectedEvent = event;
    this.showDetails = true;
  }

  closeDetails() {
    this.showDetails = false;
    this.selectedEvent = null;
  }

  closeModal() {
    this.showModal = false;
    this.selectedDate = null;
    this.editingEvent = null;
  }

  saveEvent(event: CalendarEvent) {
    if (this.editingEvent) {
      this.eventService.updateEvent(event);
    } else {
      this.eventService.addEvent(event);
    }
    this.loadEvents();
    this.closeModal();
  }

  nextMonth() {
    this.currentDate = addMonths(this.currentDate, 1);
    this.loadCalendarDays();
  }

  previousMonth() {
    this.currentDate = subMonths(this.currentDate, 1);
    this.loadCalendarDays();
  }
}