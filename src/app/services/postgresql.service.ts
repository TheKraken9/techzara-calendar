import { Injectable } from '@angular/core';
import { Pool } from 'pg';
import { CalendarEvent } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class PostgresqlService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: 'your_username',
      host: 'localhost',
      database: 'calendar_db',
      password: 'your_password',
      port: 5432,
    });
  }

  async getEvents(): Promise<CalendarEvent[]> {
    try {
      const result = await this.pool.query('SELECT * FROM events');
      return result.rows.map(row => ({
        id: row.id,
        date: new Date(row.date),
        nom: row.nom,
        prenoms: row.prenoms,
        theme: row.theme,
        heure: row.heure,
        type: row.type,
        description: row.description
      }));
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  async addEvent(event: CalendarEvent): Promise<CalendarEvent> {
    try {
      const result = await this.pool.query(
        'INSERT INTO events (date, nom, prenoms, theme, heure, type, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [event.date, event.nom, event.prenoms, event.theme, event.heure, event.type, event.description]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  }

  async updateEvent(event: CalendarEvent): Promise<CalendarEvent> {
    try {
      const result = await this.pool.query(
        'UPDATE events SET date = $1, nom = $2, prenoms = $3, theme = $4, heure = $5, type = $6, description = $7 WHERE id = $8 RETURNING *',
        [event.date, event.nom, event.prenoms, event.theme, event.heure, event.type, event.description, event.id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  async deleteEvent(id: string): Promise<void> {
    try {
      await this.pool.query('DELETE FROM events WHERE id = $1', [id]);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }
}