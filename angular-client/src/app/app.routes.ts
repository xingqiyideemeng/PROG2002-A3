import { Routes } from '@angular/router';
import { Index } from './index';
import {Search} from './search/search';

export const routes: Routes = [
  {
    path: '', component: Index
  },
  {
    path: 'search', component: Search
  }
];
