import { Component } from '@angular/core';
import {Navbar} from '../navbar/navbar';
import {RouterModule, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [Navbar, RouterOutlet, RouterModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {

}
