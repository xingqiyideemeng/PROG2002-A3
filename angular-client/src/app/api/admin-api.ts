import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {HOST} from '../config';
import {Registration} from './registrations-api';
import {CharityEvent} from './events-api';
import {Category} from './categories-api';

@Injectable({
  providedIn: 'root'
})
export class AdminApi {
  constructor(private http: HttpClient) {}

  // 获取所有事件
  getEvents(): Observable<CharityEvent[]> {
    return this.http.get<CharityEvent[]>(HOST + '/api/admin/events');
  }

  // 创建事件
  createEvent(event: CharityEvent): Observable<any> {
    return this.http.post(HOST + '/api/admin/events', event);
  }

  // 更新事件
  updateEvent(id: number, event: CharityEvent): Observable<any> {
    return this.http.put(HOST + `/api/admin/events/${id}`, event);
  }

  // 删除事件
  deleteEvent(id: number): Observable<any> {
    return this.http.delete(HOST + `/api/admin/events/${id}`);
  }

  // 获取所有注册
  getRegistrations(): Observable<Registration[]> {
    return this.http.get<Registration[]>(HOST + '/api/admin/registrations');
  }

  // 创建注册
  createRegistration(registration: Registration): Observable<any> {
    return this.http.post(HOST + '/api/admin/registrations', registration);
  }

  // 更新注册
  updateRegistration(id: number, registration: Registration): Observable<any> {
    return this.http.put(HOST + `/api/admin/registrations/${id}`, registration);
  }

  // 删除注册
  deleteRegistration(id: number): Observable<any> {
    return this.http.delete(HOST + `/api/admin/registrations/${id}`);
  }

  // 获取所有注册
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(HOST + '/api/admin/categories');
  }

  // 创建注册
  createCategory(category: Category): Observable<any> {
    return this.http.post(HOST + '/api/admin/categories', category);
  }

  // 更新注册
  updateCategory(id: number, category: Category): Observable<any> {
    return this.http.put(HOST + `/api/admin/categories/${id}`, category);
  }

  // 删除注册
  deleteCategory(id: number): Observable<any> {
    return this.http.delete(HOST + `/api/admin/categories/${id}`);
  }
}
