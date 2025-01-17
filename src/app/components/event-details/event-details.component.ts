import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarEvent } from '../../models/event.model';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Détails de l'événement</h2>
        
        <div class="space-y-4">
          <div>
            <span class="font-medium">Date:</span>
            <p>{{ event?.date | date }}</p>
          </div>
          
          <div>
            <span class="font-medium">Nom:</span>
            <p>{{ event?.nom }}</p>
          </div>
          
          <div>
            <span class="font-medium">Prénoms:</span>
            <p>{{ event?.prenoms }}</p>
          </div>
          
          <div>
            <span class="font-medium">Thème:</span>
            <p>{{ event?.theme }}</p>
          </div>
          
          <div>
            <span class="font-medium">Heure:</span>
            <p>{{ event?.heure }}</p>
          </div>
          
          <div>
            <span class="font-medium">Type:</span>
            <p>{{ event?.type }}</p>
          </div>
          
          <div>
            <span class="font-medium">Description:</span>
            <p>{{ event?.description }}</p>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button 
            (click)="onClose()"
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  `
})
export class EventDetailsComponent {
  @Input() event: CalendarEvent | null = null;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}