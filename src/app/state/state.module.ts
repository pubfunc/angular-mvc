import { NgModule } from '@angular/core';
import { StateDirective } from './directives/state.directive';

@NgModule({
  declarations: [StateDirective],
  exports: [StateDirective],
})
export class StateModule {}
