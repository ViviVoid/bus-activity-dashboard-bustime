import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RoutesListComponent } from './components/routes-list.component';
import { PredictionsComponent } from './components/predictions.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RoutesListComponent, PredictionsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Bus Activity Dashboard');
}
