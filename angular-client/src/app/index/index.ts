import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {CharityEvent, EventsApi} from '../api/events-api';
import {OrganizationsApi, Organization} from '../api/organizations-api';

@Component({
  selector: 'app-index',
  imports: [CommonModule],
  templateUrl: './index.html',
  styleUrl: './index.css'
})
export class Index {
  events: CharityEvent[] = [];
  organizations: Organization[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private eventsApi: EventsApi, private organizationsApi: OrganizationsApi) {}

  ngOnInit(): void {
    this.loadHomeEvents();
    // this.loadOrganizations();
  }

  loadHomeEvents(): void {
    this.eventsApi.getHomeEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading events:', err);
        this.errorMessage = 'Error loading events. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  // loadOrganizations(): void {
  //   this.organizationsApi.getOrganizations().subscribe({
  //     next: (data) => {
  //       this.organizations = data;
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       console.error('Error loading organizations:', err);
  //       this.errorMessage = 'Error loading organizations. Please try again later.';
  //       this.isLoading = false;
  //     }
  //   });
  // }

  viewEventDetails(eventId: number): void {
    window.location.href = `/event-details?id=${eventId}`;
  }
}
