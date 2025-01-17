import { Injectable } from '@angular/core';
import { CalendarEvent } from '../models/event.model';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private events: CalendarEvent[] = [];

  constructor(private supabaseService: SupabaseService) {}

  async getEvents(): Promise<CalendarEvent[]> {
    try {
      this.events = await this.supabaseService.getEvents();
      return this.events;
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  async addEvent(event: CalendarEvent): Promise<void> {
    try {
      const newEvent = await this.supabaseService.addEvent(event);
      this.events.push(newEvent);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  }

  async updateEvent(event: CalendarEvent): Promise<void> {
    try {
      const updatedEvent = await this.supabaseService.updateEvent(event);
      const index = this.events.findIndex(e => e.id === event.id);
      if (index !== -1) {
        this.events[index] = updatedEvent;
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  }

  async deleteEvent(id: string): Promise<void> {
    try {
      await this.supabaseService.deleteEvent(id);
      const index = this.events.findIndex(e => e.id === id);
      if (index !== -1) {
        this.events.splice(index, 1);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  }
}