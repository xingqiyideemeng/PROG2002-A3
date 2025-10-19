import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {HOST} from '../config';

export interface CharityEvent {
  id?: number;
  org_id: number;
  category_id: number;
  category_name?: number;
  org_name?: number;
  name: string;
  short_description: string;
  full_description: string;
  image_url: string;
  venue_name: string;
  venue_address: string;
  city: string;
  state_region: string;
  postcode: string;
  country: string;
  start_at: string;
  end_at: string;
  is_suspended: number;
  ticket_price_cents: number;
  currency: string;
  tickets_total: number;
  tickets_sold: number;
  goal_amount_cents: number;
  amount_raised_cents: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventsApi {
  constructor(private http: HttpClient) {
  }

  getHomeEvents(): Observable<CharityEvent[]> {
    return this.http.get<CharityEvent[]>(HOST + '/api/events/home')
  }

  searchEvents(): Observable<CharityEvent[]> {
    return this.http.get<CharityEvent[]>(HOST + '/api/events/search')
  }

  getEventDetails(id: number): Observable<CharityEvent> {
    return this.http.get<CharityEvent>(HOST +'/api/events/' + id)
  }
}
