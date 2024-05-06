import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ComponentState } from './state/component-state';
import { RootState } from './state/root-state';
import { State } from './state/state';
import { StateModule } from './state/state.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, StateModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    {
      provide: State,
      useValue: RootState,
    },
    {
      provide: ComponentState,
      useValue: new ComponentState(RootState),
    },
  ],
})
export class AppComponent {
  title = 'angular-mvc';
  constructor(public state: State) {}

  addItem() {
    this.state.patch('list', [
      ...(this.state.get()?.['list'] ?? []),
      { id: '123', name: 'Some item' },
    ]);
  }
}
