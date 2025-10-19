import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registration = {
    event_id: 1, // 默认或从路由获取
    full_name: '',
    email: '',
    contact_phone: '',
    tickets_count: 1
  };

  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient) {}

  submitRegistration() {
    this.http.post('http://localhost:3001/registrations', this.registration).subscribe({
      next: () => {
        this.successMessage = '✅ Registration successful!';
        this.errorMessage = '';
        this.resetForm();
      },
      error: () => {
        this.errorMessage = '❌ Failed to submit registration. Please try again.';
        this.successMessage = '';
      }
    });
  }

  resetForm() {
    this.registration = {
      event_id: 1,
      full_name: '',
      email: '',
      contact_phone: '',
      tickets_count: 1
    };
  }
}
