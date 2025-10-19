import { Routes } from '@angular/router';
import { Index } from './index';
import { Search } from './search/search';
import { EventDetails } from './event-details/event-details';
import { Register } from './register/register';
import { AdminLayout } from './admin-layout/admin-layout';
import {AdminEvents} from './admin-events/admin-events';

export const routes: Routes = [
  { path: '', component: Index },
  { path: 'search', component: Search },
  { path: 'event-details', component: EventDetails },
  { path: 'event-register', component: Register },
  {
    path: 'admin',
    component: AdminLayout,
    children: [
      { path: '', redirectTo: 'events', pathMatch: 'full' },
      { path: 'events', component: AdminEvents }
    ]
  },
];
