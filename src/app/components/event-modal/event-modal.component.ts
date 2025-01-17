import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarEvent } from '../../models/event.model';

@Component({
  selector: 'app-event-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">
          {{ editingEvent ? 'Modifier' : 'Ajouter' }} un événement pour le {{ selectedDate | date }}
        </h2>
        
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Nom</label>
          <input 
            type="text" 
            [(ngModel)]="eventData.nom"
            class="w-full p-2 border rounded"
          >
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Prénoms</label>
          <input 
            type="text"     
            [(ngModel)]="eventData.prenoms"
            class="w-full p-2 border rounded"
          >
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Thème</label>
          <input 
            type="text" 
            [(ngModel)]="eventData.theme"
            class="w-full p-2 border rounded"
          >
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Heure</label>
          <input 
            type="time" 
            [(ngModel)]="eventData.heure"
            class="w-full p-2 border rounded"
          >
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Type</label>
          <select 
            [(ngModel)]="eventData.type"
            class="w-full p-2 border rounded"
          >
            <option value="atelier">Atelier</option>
            <option value="formation">Formation</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Description</label>
          <textarea 
            [(ngModel)]="eventData.description"
            class="w-full p-2 border rounded"
            rows="3"
          ></textarea>
        </div>

        <div class="flex justify-end gap-2">
          <button 
            (click)="onClose()"
            class="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Annuler
          </button>
          <button 
            (click)="onSave()"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  `
})
export class EventModalComponent implements OnInit {
  @Input() selectedDate: Date | null = null;
  @Input() editingEvent: CalendarEvent | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CalendarEvent>();

  eventData: CalendarEvent = {
    date: new Date(),
    nom: '',
    prenoms: '',
    theme: '',
    heure: '',
    type: 'atelier',
    description: ''
  };

  ngOnInit() {
    if (this.editingEvent) {
      this.eventData = { ...this.editingEvent };
    }
  }

  onClose() {
    this.close.emit();
  }

  onSave() {
    if (this.selectedDate) {
      this.eventData.date = this.selectedDate;
      this.save.emit(this.eventData);
    }
  }
}