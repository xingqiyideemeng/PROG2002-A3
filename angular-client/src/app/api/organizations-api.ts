import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {HOST} from '../config';

export interface Organization {
  id?: number;
  name: string;
  description: string;
  about: string;
  contact_email: string;
  contact_phone: string;
  website: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrganizationsApi {
  constructor(private http: HttpClient) {
  }

  getOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>(HOST + '/api/organizations')
  }

}
