import {
  Directive,
  EmbeddedViewRef,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  SkipSelf,
  TemplateRef,
  ViewContainerRef,
  forwardRef,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IState, State } from '../state';

export type StateDirectiveTemplateValue<TValue> = {
  $implicit: TValue | null | undefined;
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
  implements IState<TValue>, OnInit, OnDestroy
{
  state: IState<TValue> | undefined;
  context: StateDirectiveTemplateValue<TValue> = { $implicit: undefined };
  subscription: Subscription | undefined;
  embeddedView:
    | EmbeddedViewRef<StateDirectiveTemplateValue<TValue>>
    | undefined;

  @Input('xState')
  set statePath(path: string) {
    this.state = this.parentState.slice(path);
    this.subscription?.unsubscribe();
    this.subscription = this.state.observe().subscribe((state) => {
      this.context.$implicit = state;
      this.embeddedView?.markForCheck();
    });
  }

  get path() {
    return this.state?.path ?? '?';
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
      this.embeddedView = this.viewContainer.createEmbeddedView(
        this.templateRef,
        this.context,
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
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

  static ngTemplateContextGuard<T extends Record<string, any>>(
    directive: StateDirective<T>,
    context: unknown,
  ): context is StateDirectiveTemplateValue<T> {
    return true;
  }
}
