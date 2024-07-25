import { ChangeDetectionStrategy, Component } from "@angular/core";
import { StateModule } from "./state/state.module";
import { State } from "./state/state";
import { ComponentState } from "./state/component-state";
import { CommonModule } from "@angular/common";


@Component({
  selector: 'x-table-demo',
  templateUrl: 'state-demo.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StateModule, CommonModule],
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
})
export class StateDemoComponent {
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