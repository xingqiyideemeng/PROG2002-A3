import {Component, Input} from '@angular/core';
import {CharityEvent} from '../api/events-api';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-event-card',
  imports: [CommonModule, RouterModule],
  templateUrl: './event-card.html',
  styleUrl: './event-card.css'
})
export class EventCard {
  @Input() event!: CharityEvent; // 接收父组件传入的 event 对象
}
