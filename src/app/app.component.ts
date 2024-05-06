import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IState, State } from './state/state';
import { Observable, Subscriber } from 'rxjs';
import { RootState } from './state/root-state';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    {
      provide: State,
      useValue: RootState
    }
  ]
})
export class AppComponent {
  title = 'angular-mvc';
  constructor(private state: State){}


}
