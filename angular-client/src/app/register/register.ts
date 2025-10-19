import { Component } from '@angular/core';
import {RegistrationsApi} from '../api/registrations-api';
import {CommonModule} from '@angular/common';
import {Navbar} from '../navbar/navbar';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, Navbar, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registration = {
    event_id: -1, // 默认或从路由获取
    full_name: '',
    email: '',
    contact_phone: '',
    tickets_count: 1
  };

  successMessage = '';
  errorMessage = '';

  constructor(private registrationsApi: RegistrationsApi, private route: ActivatedRoute) {
    const id = this.route.snapshot.queryParamMap.get('id');
    this.registration.event_id = Number(id);
  }

  validationForm() {
    if (!this.registration.event_id || this.registration.event_id <= 0) {
      this.errorMessage = "Event id is invalid.";
      return false
    }
    if (!this.registration.full_name) {
      this.errorMessage = "You should fill the name.";
      return false
    }
    if (!this.registration.email) {
      this.errorMessage = "You should fill the email.";
      return false
    }
    if (!this.registration.tickets_count || this.registration.tickets_count <= 0) {
      this.errorMessage = "Tickets count should more than 1.";
      return false
    }
    return true;
  }

  submitRegistration() {
    this.errorMessage = "";
    this.successMessage = "";
    if (this.validationForm()) {
      this.registrationsApi.createEventRegistration(this.registration).subscribe({
        next: () => {
          this.successMessage = 'Registration successful!';
          this.errorMessage = '';
          this.resetForm();
        },
        error: () => {
          this.errorMessage = 'Failed to submit registration. Please try again.';
          this.successMessage = '';
        }
      });
    }
  }

  resetForm() {
    this.registration = {
      event_id: -1,
      full_name: '',
      email: '',
      contact_phone: '',
      tickets_count: 1
    };
  }
}
