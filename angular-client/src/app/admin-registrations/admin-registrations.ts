import {Component, OnInit} from '@angular/core';
import {Registration} from '../api/registrations-api';
import {AdminApi} from '../api/admin-api';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CharityEvent} from '../api/events-api';

@Component({
  selector: 'app-admin-registrations',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-registrations.html',
  styleUrl: './admin-registrations.css'
})
export class AdminRegistrations implements OnInit {
  events: CharityEvent[] = [];
  registrations: Registration[] = [];
  loading = true;
  errorMessage = '';
  formErrorMessage = '';

  // 模态框控制：用于新增/编辑
  showModal = false;
  isEditMode = false;
  currentReg: Registration = {
    event_id: 0,
    full_name: '',
    email: '',
    contact_phone: '',
    tickets_count: 1
  };

  constructor(private adminApi: AdminApi) {}

  ngOnInit() {
    this.loadRegistrations();
    this.loadEvents();
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

  loadRegistrations() {
    this.loading = true;
    this.adminApi.getRegistrations().subscribe({
      next: (data) => {
        this.registrations = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error loading registrations. Please try again.';
        this.loading = false;
      }
    });
  }

  // 新增
  openCreateModal() {
    this.isEditMode = false;
    this.currentReg = {
      event_id: 0,
      full_name: '',
      email: '',
      contact_phone: '',
      tickets_count: 1
    };
    this.formErrorMessage = '';
    this.showModal = true;
  }

  // 编辑
  editRegistration(reg: Registration) {
    this.isEditMode = true;
    this.currentReg = { ...reg }; // shallow copy
    // 保证数字字段正确
    this.currentReg.tickets_count = Number(this.currentReg.tickets_count || 1);
    this.showModal = true;
    this.formErrorMessage = '';
  }

  closeModal() {
    this.showModal = false;
  }

  // 保存或更新
  saveRegistration() {
    this.formErrorMessage = '';

    // 前端校验
    if (!this.currentReg.event_id || this.currentReg.event_id === 0) {
      this.formErrorMessage = 'Event ID is required.';
      return;
    }
    if (!this.currentReg.full_name || !this.currentReg.full_name.trim()) {
      this.formErrorMessage = 'Full name is required.';
      return;
    }
    if (!this.currentReg.email || !this.currentReg.email.trim()) {
      this.formErrorMessage = 'Email is required.';
      return;
    }
    if (!this.currentReg.tickets_count || this.currentReg.tickets_count <= 0) {
      this.formErrorMessage = 'Tickets count must be at least 1.';
      return;
    }

    if (this.isEditMode && this.currentReg.id) {
      this.adminApi.updateRegistration(this.currentReg.id, {
        event_id: 1,
        full_name: this.currentReg.full_name,
        email: this.currentReg.email,
        contact_phone: this.currentReg.contact_phone,
        tickets_count: this.currentReg.tickets_count
      }).subscribe({
        next: () => {
          this.loadRegistrations();
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
          this.formErrorMessage = err?.error?.error || 'Error updating registration.';
        }
      });
    } else {
      // create uses public endpoint /api/registrations (server-side checks for duplicates)
      this.adminApi.createRegistration({
        event_id: this.currentReg.event_id,
        full_name: this.currentReg.full_name,
        email: this.currentReg.email,
        contact_phone: this.currentReg.contact_phone,
        tickets_count: this.currentReg.tickets_count
      }).subscribe({
        next: () => {
          this.loadRegistrations();
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
          this.formErrorMessage = err?.error?.error || 'Error creating registration.';
        }
      });
    }
  }

  // 删除
  deleteRegistration(id?: number) {
    if (!id) {
      return;
    }
    if (!confirm('Are you sure you want to delete this registration?')) {
      return;
    }

    this.adminApi.deleteRegistration(id).subscribe({
      next: () => this.loadRegistrations(),
      error: (err) => {
        console.error(err);
        this.errorMessage = err?.error?.error || 'Error deleting registration.';
      }
    });
  }
}
