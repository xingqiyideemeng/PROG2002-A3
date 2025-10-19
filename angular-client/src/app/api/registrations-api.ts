import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {HOST} from '../config';

export interface Registration {
  id?: number;
  event_id: number;
  event_name?: string;
  full_name: string;
  email: string;
  contact_phone: string;
  tickets_count: number;
  registered_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegistrationsApi {
  constructor(private http: HttpClient) {
  }

  getEventRegistrations(eventId: string): Observable<Registration[]> {
    return this.http.get<Registration[]>(HOST + '/api/registrations/event/' + eventId)
  }

  createEventRegistration(registration: Registration): Observable<Registration[]> {
    return this.http.post<Registration[]>(HOST + '/api/registrations', registration)
  }
}
