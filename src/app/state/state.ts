import { BehaviorSubject, Observable } from 'rxjs';
import { StateSlice } from './state-slice';

export interface IState<TValue> {
  readonly path: string;
  observe(): Observable<TValue | null | undefined>;
  get(): TValue | null | undefined;
  set(value: TValue): void;
  patch<TPath extends keyof TValue, TNewValue = TValue[TPath]>(
    path: keyof TValue,
    value: TNewValue,
  ): void;
  slice<TPath extends keyof TValue = keyof TValue>(
    path: TPath,
  ): IState<TValue[TPath]>;
}

export class State<TValue extends Record<string, any> = Record<string, any>> {
  readonly path = '$';
  private readonly value$: BehaviorSubject<TValue>;

  constructor(initialValue: TValue) {
    this.value$ = new BehaviorSubject<TValue>(initialValue);
  }

  observe(): Observable<TValue | null | undefined> {
    return this.value$;
  }

  get(): TValue | null | undefined {
    console.log('State.get');
    return this.value$.getValue();
  }

  set(value: any): void {
    this.value$.next(value);
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

  slice<TPath extends keyof TValue = keyof TValue>(
    path: TPath & string,
  ): IState<TValue[TPath]> {
    return new StateSlice<TValue, TPath>(this, path);
  }
}
