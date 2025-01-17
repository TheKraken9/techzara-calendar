import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environment/environment';
import { CalendarEvent } from '../models/event.model';

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            environment.supabaseUrl,
            environment.supabaseKey
        );
    }

    async getEvents(): Promise<CalendarEvent[]> {
        const { data, error } = await this.supabase
            .from('events')
            .select('*');

        if (error) throw error;
        return data || [];
    }

    async addEvent(event: CalendarEvent): Promise<CalendarEvent> {
        const { data, error } = await this.supabase
            .from('events')
            .insert([{
                date: event.date,
                nom: event.nom,
                prenoms: event.prenoms,
                theme: event.theme,
                heure: event.heure,
                type: event.type,
                description: event.description
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async updateEvent(event: CalendarEvent): Promise<CalendarEvent> {
        const { data, error } = await this.supabase
            .from('events')
            .update({
                date: event.date,
                nom: event.nom,
                prenoms: event.prenoms,
                theme: event.theme,
                heure: event.heure,
                type: event.type,
                description: event.description
            })
            .eq('id', event.id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async deleteEvent(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('events')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
}