import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CharityEvent, EventsApi} from '../api/events-api';
import {CategoriesApi, Category} from '../api/categories-api';
import {Navbar} from '../navbar/navbar';
import {EventCard} from '../event-card/event-card';

@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule, Navbar, EventCard],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class Search implements OnInit {
  categories: Category[] = [];
  events: CharityEvent[] = [];
  isLoading = false;
  errorMessage = '';
  filters = {
    category: 'all',
    city: '',
    date: ''
  };

  constructor(
    private eventsApi: EventsApi,
    private categoriesApi: CategoriesApi
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoriesApi.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  performSearch(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // 手动构造查询参数
    const params: any = {};
    if (this.filters.category && this.filters.category !== 'all') {
      params.category = this.filters.category;
    }
    if (this.filters.city.trim()) {
      params.city = this.filters.city.trim();
    }
    if (this.filters.date) {
      params.date = this.filters.date;
    }

    // GET 请求
    this.eventsApi.searchEvents(params).subscribe({
      next: (data) => {
        // 设置data到events
        this.events = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error performing search:', err);
        this.errorMessage = 'Error performing search. Please try again.';
        this.isLoading = false;
      }
    });
  }

  clearFilters(): void {
    this.filters = {
      category: 'all',
      city: '',
      date: ''
    };
    this.events = [];
    this.errorMessage = '';
  }

  viewEventDetails(eventId: number): void {
    window.location.href = `/event-details?id=${eventId}`;
  }
}
