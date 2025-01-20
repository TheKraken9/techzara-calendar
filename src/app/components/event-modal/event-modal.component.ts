import {Component, EventEmitter, Input, LOCALE_ID, OnInit, Output} from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarEvent } from '../../models/event.model';
import localefr from '@angular/common/locales/fr';

registerLocaleData(localefr);

@Component({
  selector: 'app-event-modal',
  standalone: true,
  providers: [{provide: LOCALE_ID, useValue: 'fr'}],
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">
          {{ editingEvent ? 'Modifier' : 'Ajouter' }} un événement pour le {{ selectedDate | date:'fullDate':'':'fr' }}
        </h2>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Type</label>
          <div class="flex">
            <select
                [(ngModel)]="eventData.type"
                class="w-full p-2 border rounded"
            >
              <option value="atelier">Atelier</option>
              <option value="formation">Formation</option>
              <option value="reunion">Réunion</option>
              <option value="evenement">Évènement</option>
              <option value="autre">Autre</option>
            </select>
            <input
                *ngIf="eventData.type === 'autre'"
                type="text"
                [(ngModel)]="customType"
                class="w-full p-2 border rounded ml-2"
                placeholder="Autre type"
            >
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Nom</label>
          <input
              type="text"
              [(ngModel)]="eventData.nom"
              class="w-full p-2 border rounded"
          >
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Prénoms *</label>
          <input
              type="text"
              [(ngModel)]="eventData.prenoms"
              class="w-full p-2 border rounded"
          >
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Thème *</label>
          <input
              type="text"
              [(ngModel)]="eventData.theme"
              class="w-full p-2 border rounded"
          >
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Heure *</label>
          <input
              type="time"
              [(ngModel)]="eventData.heure"
              class="w-full p-2 border rounded"
          >
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Description</label>
          <textarea
              [(ngModel)]="eventData.description"
              class="w-full p-2 border rounded"
              rows="3"
          ></textarea>
        </div>

        <small class="text-red-500 mb-4" *ngIf="errorMessage">
          {{ errorMessage }}
        </small>

        <div class="flex justify-end gap-2">
          <button
              (click)="onClose()"
              class="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Annuler
          </button>
          <button
              (click)="onSave()"
              [disabled]="!eventData.heure || !eventData.theme || !eventData.prenoms"
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

  customType: string = '';
  errorMessage: string = '';

  ngOnInit() {
    if (this.editingEvent) {
      this.eventData = { ...this.editingEvent };
      if (!['atelier', 'formation', 'reunion', 'evenement'].includes(this.eventData.type)) {
        this.customType = this.eventData.type;
        this.eventData.type = 'autre';
      }
    }
  }

  onClose() {
    this.close.emit();
  }

  onSave() {
    if (this.eventData.type === 'autre') {
      this.eventData.type = this.customType;
    }

    if (this.selectedDate) {
      const currentTime = new Date();
      const selectedTime = new Date(this.selectedDate);
      const [hours, minutes] = this.eventData.heure.split(':').map(Number);
      selectedTime.setHours(hours, minutes, 0, 0);

      if (selectedTime < currentTime) {
        this.errorMessage = 'L\'heure sélectionnée est dans le passé. Veuillez choisir une heure future.';
        return;
      }

      this.eventData.date = this.selectedDate;
      this.save.emit(this.eventData);
      this.errorMessage = ''; // Clear the error message on successful save
    }
  }
}