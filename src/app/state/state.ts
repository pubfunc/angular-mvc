import { BehaviorSubject, Observable, map } from "rxjs";

export interface IState<TValue extends Record<string, any>> {
    observe(): Observable<TValue>;
    set(value: TValue): void;
    get(): TValue;
    patch<TPath extends keyof TValue, TNewValue = TValue[TPath]>(path: keyof TValue, value: TNewValue);
}

export class State<TValue = unknown> {

    public readonly value$: BehaviorSubject<TValue>;
    
    constructor(
        initialValue: TValue
    ){
        this.value$ = new BehaviorSubject<TValue>(initialValue)
    }

    observe(path?: string){

        if(path){
            return this.value$.pipe(
                map(state => (
                    typeof state === 'object' 
                    && state !== null 
                    && path in state
                ) ? state[path] : undefined)
            );
        }

        return this.value$.asObservable();
    }

    get(){
        return this.value$.getValue();
    }

    patch<TPath extends keyof TValue, TNewValue = TValue[TPath]>(path: keyof TValue, value: TNewValue) {
        this.set({
            ...(this.value$.getValue() ?? {}),
            [path]: value
        });
    }

    set(value: any){
        this.value$.next(value);
    }

}