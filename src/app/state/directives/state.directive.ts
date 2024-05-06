import {
  Directive,
  Input,
  OnInit,
  Optional,
  SkipSelf,
  TemplateRef,
  ViewContainerRef,
  forwardRef,
} from '@angular/core';
import { Observable } from 'rxjs';
import { IState, State } from '../state';

export type StateDirectiveTemplateValue<TValue> = {
  $implicit: IState<TValue> | undefined;
};

@Directive({
  selector: '[xState]',
  exportAs: 'xState',
  providers: [
    {
      provide: State,
      useExisting: forwardRef(() => StateDirective),
    },
  ],
})
export class StateDirective<TValue extends Record<string, any>>
  implements IState<TValue>, OnInit
{
  state: IState<TValue> | undefined;
  context: StateDirectiveTemplateValue<TValue> = { $implicit: undefined };

  @Input('xState')
  set statePath(path: string) {
    this.state = this.parentState.slice(path);
    this.context.$implicit = this.state;
  }

  constructor(
    private viewContainer: ViewContainerRef,
    @SkipSelf()
    private readonly parentState: State<TValue>,
    @Optional()
    private readonly templateRef?: TemplateRef<
      StateDirectiveTemplateValue<TValue>
    >,
  ) {}

  ngOnInit(): void {
    console.log('StateDirective.ngOnInit', this);
    if (this.templateRef) {
      this.viewContainer.createEmbeddedView(this.templateRef, this.context);
    }
  }

  observe(): Observable<TValue | null | undefined> {
    if (!this.state) throw new Error('StateDirective state not initialized');
    return this.state.observe();
  }

  get(): TValue | null | undefined {
    if (!this.state) throw new Error('StateDirective state not initialized');
    return this.state.get();
  }

  set(value: TValue): void {
    if (!this.state) throw new Error('StateDirective state not initialized');
    return this.state.set(value);
  }

  patch<TPath extends keyof TValue, TNewValue = TValue[TPath]>(
    path: keyof TValue,
    value: TNewValue,
  ): void {
    if (!this.state) throw new Error('StateDirective state not initialized');
    this.state.patch(path, value);
  }

  slice<TPath extends keyof TValue = keyof TValue>(
    path: TPath,
  ): IState<TValue[TPath]> {
    if (!this.state) throw new Error('StateDirective state not initialized');
    return this.state.slice(path);
  }
}
