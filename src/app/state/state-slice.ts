import { Observable, map } from 'rxjs';
import { IState } from './state';

export function path() {}

export class StateSlice<
  TParentValue extends Record<string, any>,
  TPath extends keyof TParentValue,
  TSliceValue extends Record<string, any> = TParentValue[TPath],
> implements IState<TSliceValue>
{
  constructor(
    private readonly path: TPath,
    private readonly parentState: IState<TParentValue>,
  ) {}

  observe(): Observable<TSliceValue> {
    return this.parentState.observe().pipe(map((s) => (s ?? {})[this.path]));
  }

  set(value: TSliceValue) {
    this.parentState.patch(this.path, value);
  }

  get(): TSliceValue {
    throw new Error('Method not implemented.');
  }

  patch<TPath extends keyof TSliceValue, TNewValue = TSliceValue[TPath]>(
    path: keyof TSliceValue,
    value: TNewValue,
  ) {
    throw new Error('Method not implemented.');
  }
}
