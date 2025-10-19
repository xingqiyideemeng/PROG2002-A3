import { Component } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EventsApi} from '../api/events-api';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-event-details',
  imports: [CommonModule],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css'
})
export class EventDetails {
  event: any;
  loading = true;
  errorMessage = '';
  showModalFlag = false;

  constructor(private route: ActivatedRoute, private eventsApi: EventsApi) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.queryParamMap.get('id');
    if (!eventId) {
      this.errorMessage = 'No event ID provided.';
      this.loading = false;
      return;
    }

    this.loadEventDetails(eventId);
  }

  loadEventDetails(id: string): void {
    this.eventsApi.getEventDetails(id).subscribe({
      next: (data: any) => {
        this.event = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error loading event details. Please try again.';
        this.loading = false;
      },
    });
  }

  formatDateTime(start: string, end: string): string {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `
      ${startDate.toLocaleDateString()}
      ${startDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit',})} -
      ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }

  openModal(): void {
    this.showModalFlag = true;
  }

  closeModal(): void {
    this.showModalFlag = false;
  }
}
