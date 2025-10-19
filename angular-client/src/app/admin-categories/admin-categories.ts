import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Category} from '../api/categories-api';
import {AdminApi} from '../api/admin-api';

@Component({
  selector: 'app-admin-categories',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-categories.html',
  styleUrl: './admin-categories.css'
})
export class AdminCategories {
  categories: Category[] = [];
  loading = true;
  errorMessage = '';
  formErrorMessage = '';
  showModal = false;
  isEditMode = false;
  currentCategory: Category = { name: '', description: '' };

  constructor(private adminApi: AdminApi) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.adminApi.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error loading categories. Please try again.';
        this.loading = false;
      }
    });
  }

  openModal() {
    this.isEditMode = false;
    this.currentCategory = { name: '', description: '' };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  editCategory(category: Category) {
    this.isEditMode = true;
    this.currentCategory = { ...category };
    this.showModal = true;
  }

  saveCategory() {
    this.formErrorMessage = '';

    if (!this.currentCategory.name.trim()) {
      this.formErrorMessage = 'Category name is required.';
      return;
    }

    if (this.isEditMode && this.currentCategory.id) {
      this.adminApi.updateCategory(this.currentCategory.id, this.currentCategory).subscribe({
        next: () => {
          this.loadCategories();
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error updating category. Please try again.';
        }
      });
    } else {
      this.adminApi.createCategory(this.currentCategory).subscribe({
        next: () => {
          this.loadCategories();
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error creating category. Please try again.';
        }
      });
    }
  }

  deleteCategory(id: number) {
    if (!confirm('Are you sure you want to delete this category?')) return;

    this.adminApi.deleteCategory(id).subscribe({
      next: () => this.loadCategories(),
      error: (err) => {
        console.error(err);
        this.errorMessage = err?.error?.error || 'Error deleting category.';
      }
    });
  }
}
