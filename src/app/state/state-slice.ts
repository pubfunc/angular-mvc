import { Observable, map } from 'rxjs';
import type { IState } from './state';

export class StateSlice<
  TParentValue extends Record<string, any>,
  TSlicePath extends keyof TParentValue,
  TSliceValue extends Record<string, any> = TParentValue[TSlicePath],
> implements IState<TSliceValue>
{
  constructor(
    private readonly parentState: IState<TParentValue>,
    public readonly path: TSlicePath & string,
  ) {}

  observe(): Observable<TSliceValue | null | undefined> {
    return this.parentState.observe().pipe(map((s) => this.get()));
  }

  get(): TSliceValue | null | undefined {
    const state = this.parentState.get();
    return typeof state === 'object' && state !== null
      ? state[this.path]
      : undefined;
  }

  set(value: TSliceValue) {
    this.parentState.patch(this.path, value);
  }

  patch<TPath extends keyof TSliceValue, TNewValue = TSliceValue[TPath]>(
    path: TPath,
    value: TNewValue,
  ) {
    const patch = {
      ...(this.get() ?? {}),
      [path]: value,
    } as TSliceValue;

    this.set(patch);
  }

  slice<TPath extends keyof TSliceValue = keyof TSliceValue>(
    path: TPath & string,
  ): IState<TSliceValue[TPath]> {
    return new StateSlice<TSliceValue, TPath>(this, path);
  }
}
