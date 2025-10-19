import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AdminApi} from '../api/admin-api';
import {CharityEvent} from '../api/events-api';

@Component({
  selector: 'app-admin-events',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-events.html',
  styleUrl: './admin-events.css'
})
export class AdminEvents implements OnInit {
  events: CharityEvent[] = [];
  loading = true;
  errorMessage = '';
  formErrorMessage = '';
  categories: any[] = [];
  showModal = false;
  isEditMode = false;
  currentEvent: CharityEvent = {
    org_id: 0,
    category_id: 0,
    name: "",
    short_description: "",
    full_description: "",
    image_url: "",
    venue_name: "",
    venue_address: "",
    city: "",
    state_region: "",
    postcode: "",
    country: "",
    start_at: "",
    end_at: "",
    is_suspended: 0,
    ticket_price_cents: 0,
    currency: "",
    tickets_total: 0,
    tickets_sold: 0,
    goal_amount_cents: 0,
    amount_raised_cents: 0,
  };

  constructor(private adminApi: AdminApi) {}

  ngOnInit() {
    this.loadEvents();
    this.loadCategories();
  }

  loadEvents() {
    this.adminApi.getEvents().subscribe({
      next: (data: any) => {
        this.events = data
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error loading events. Please try again.';
        this.loading = false;
      },
    });

  }

  loadCategories() {
    this.adminApi.getCategories?.()?.subscribe(res => {
      this.categories = res
    });
  }

  openModal() {
    this.isEditMode = false;
    this.currentEvent = {
      org_id: 0,
      category_id: 0,
      name: "",
      short_description: "",
      full_description: "",
      image_url: "",
      venue_name: "",
      venue_address: "",
      city: "",
      state_region: "",
      postcode: "",
      country: "",
      start_at: "",
      end_at: "",
      is_suspended: 0,
      ticket_price_cents: 0,
      currency: "",
      tickets_total: 0,
      tickets_sold: 0,
      goal_amount_cents: 0,
      amount_raised_cents: 0,
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  editEvent(event: CharityEvent) {
    this.isEditMode = true;
    this.currentEvent = { ...event };
    this.currentEvent.start_at = event.start_at.replace('T', ' ').replace('Z', '')
    this.currentEvent.end_at = event.end_at.replace('T', ' ').replace('Z', '')
    this.showModal = true;
  }

  saveEvent() {
    this.formErrorMessage = "";

    if (!this.currentEvent.org_id) {
      this.formErrorMessage = "Organization required.";
      return;
    }
    if (!this.currentEvent.category_id) {
      this.formErrorMessage = "Category required.";
      return;
    }
    if (!this.currentEvent.name) {
      this.formErrorMessage = "Name required.";
      return;
    }
    if (!this.currentEvent.start_at) {
      this.formErrorMessage = "Start Datetime required.";
      return;
    }
    if (!this.currentEvent.end_at) {
      this.formErrorMessage = "End Datetime required.";
      return;
    }

    if (this.isEditMode && this.currentEvent.id) {
      this.adminApi.updateEvent(this.currentEvent.id, this.currentEvent).subscribe({
        next: (data: any) => {
          this.loadEvents();
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error update event. Please try again.';
        },
      });
    } else {
      this.adminApi.createEvent(this.currentEvent).subscribe({
        next: (data: any) => {
          this.loadEvents();
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error create event. Please try again.';
        },
      });
    }
  }

  deleteEvent(id: number) {
    if (!confirm('Are you sure you want to delete this event?')) return;
    this.adminApi.deleteEvent(id).subscribe({
      next: (data: any) => {
        this.loadEvents();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err?.error?.error || 'Error delete event. Please try again.';
      },
    });
  }
}
