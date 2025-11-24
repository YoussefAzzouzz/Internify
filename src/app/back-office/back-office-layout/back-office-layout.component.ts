import { Component } from '@angular/core';

@Component({
  selector: 'app-back-office-layout',
  templateUrl: './back-office-layout.component.html',
  styleUrls: ['./back-office-layout.component.css']
})
export class BackOfficeLayoutComponent {
  isSidebarCollapsed = false;
  menuItems = [
    { path: '/back-office', title: 'Dashboard', icon: 'dashboard', class: '' },
    { path: '/back-office/demand', title: 'Internship Demands', icon: 'people', class: '' },
    { path: '/back-office/settings', title: 'Settings', icon: 'settings', class: '' }
  ];

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  sidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  isMobileMenu() {
    return window.innerWidth <= 991;
  }

  getTitle() {
    // Logic to return the title based on the current route or condition
    return 'Internify';
  }
}
