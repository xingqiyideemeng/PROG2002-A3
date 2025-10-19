import { Routes } from '@angular/router';
import { Index } from './index';
import { Search } from './search/search';
import { EventDetails } from './event-details/event-details';

export const routes: Routes = [
  { path: '', component: Index },
  { path: 'search', component: Search },
  { path: 'event-details', component: EventDetails }
];
