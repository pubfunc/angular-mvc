import { BehaviorSubject, Observable } from 'rxjs';

export interface IState<TValue extends Record<string, any>> {
  observe(): Observable<TValue>;
  set(value: TValue): void;
  get(): TValue;
  patch<TPath extends keyof TValue, TNewValue = TValue[TPath]>(
    path: keyof TValue,
    value: TNewValue,
  ): void;
}

export class State<TValue = unknown> {
  public readonly value$: BehaviorSubject<TValue>;

  constructor(initialValue: TValue) {
    this.value$ = new BehaviorSubject<TValue>(initialValue);
  }

  observe(): Observable<TValue> {
    return this.value$;
  }

  get(): TValue {
    return this.value$.getValue();
  }

  patch<TPath extends keyof TValue, TNewValue = TValue[TPath]>(
    path: keyof TValue,
    value: TNewValue,
  ): void {
    this.set({
      ...(this.value$.getValue() ?? {}),
      [path]: value,
    });
  }

  set(value: any): void {
    this.value$.next(value);
  }
}
