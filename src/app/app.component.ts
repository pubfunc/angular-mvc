import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ComponentState } from './state/component-state';
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
      useValue: new State({
        list: {
          title: 'Some list',
          items: [],
        },
      }),
    },
    {
      provide: ComponentState,
      useFactory: (state: State) => new ComponentState(state),
      deps: [State],
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'angular-mvc';
  constructor(public state: State) {}

  addItem() {
    setTimeout(() => {
      const list = this.state.slice('list');

      list.patch('items', [
        ...list.get()?.['items'],
        { id: '123', name: 'Some item' },
      ]);
    }, 300);
  }

  clearItems() {
    setTimeout(() => {
      const list = this.state.slice('list');

      list.patch('items', []);
    }, 300);
  }
}
