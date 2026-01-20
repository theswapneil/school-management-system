import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { StudentListComponent } from './components/student-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, StudentListComponent],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>School Management System</h1>
      </header>
      <main class="app-main">
        <app-student-list></app-student-list>
      </main>
    </div>
  `,
  styles: `
    .app-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .app-header {
      background-color: #1976d2;
      color: white;
      padding: 20px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .app-header h1 {
      margin: 0;
      font-size: 28px;
    }

    .app-main {
      padding: 20px;
    }
  `,
})
export class AppComponent {
  title = 'School Management';
}
