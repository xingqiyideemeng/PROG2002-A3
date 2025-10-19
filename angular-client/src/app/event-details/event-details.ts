import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EventsApi, CharityEvent} from '../api/events-api';
import {CommonModule} from '@angular/common';
import {Navbar} from '../navbar/navbar';
import {Registration, RegistrationsApi} from '../api/registrations-api';

@Component({
  selector: 'app-event-details',
  imports: [CommonModule, Navbar],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css'
})
export class EventDetails {
  event: any;
  weather: any;
  loading = true;
  loadingRegs = true;
  loadingWeather = true;
  errorMessage = '';
  showModalFlag = false;
  registrations: Registration[] = [];

  constructor(private route: ActivatedRoute, private eventsApi: EventsApi, private registrationsApi: RegistrationsApi, private router: Router) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.queryParamMap.get('id');
    if (!eventId) {
      this.errorMessage = 'No event ID provided.';
      this.loading = false;
      return;
    }

    this.loadEventDetails(eventId);
    this.loadEventRegistrations(eventId);
  }

  loadEventDetails(id: string): void {
    this.eventsApi.getEventDetails(id).subscribe({
      next: (data: any) => {
        this.event = data;
        this.loading = false;
        this.getLatLon(this.event);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error loading event details. Please try again.';
        this.loading = false;
      },
    });
  }

  loadEventRegistrations(id: string): void {
    this.registrationsApi.getEventRegistrations(id).subscribe({
      next: (data: any) => {
        this.registrations = data;
        this.loadingRegs = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error loading event registrations. Please try again.';
        this.loadingRegs = false;
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
    // this.showModalFlag = true;
    this.router.navigate(['event-register'], { queryParams: { id: this.event.id } })
  }

  closeModal(): void {
    this.showModalFlag = false;
  }

  getLatLon(event: CharityEvent): void {
    const fullAddress = `${event.city}, ${event.state_region}, ${event.postcode}, ${event.country}`;
    this.eventsApi.getLatLon(fullAddress).subscribe({
      next: (data: any) => {
        if (data.length > 0) {
          const lat = data[0].lat;
          const lon = data[0].lon;
          this.getWeather(lat, lon);
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error loading event lat and lon. Please try again.';
        this.loadingWeather = false;
      },
    })
  }

  getWeather(lat: string, lon: string): void {
    this.eventsApi.getWeather(lat, lon).subscribe({
      next: (data: any) => {
        this.weather = data.daily;
        this.loadingWeather = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error loading event weather. Please try again.';
        this.loadingWeather = false;
      },
    })
  }
}
