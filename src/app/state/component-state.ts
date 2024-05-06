import { Injectable, OnDestroy } from "@angular/core";
import { Observable, Subscriber, Subscription } from "rxjs";
import { State } from "./state";


@Injectable()
export class ComponentState implements OnDestroy {

    subscribers = new Set<Subscriber<unknown>>();
    subscription: Subscription | null = null;

    constructor(
        private parentState: State
    ) { }

    observe() {
        return new Observable(subscriber => {
            this.subscribers.add(subscriber);
            this.updateSubscription();
            subscriber.next(this.parentState.get());
            return () => {
                this.subscribers.delete(subscriber);
                this.updateSubscription();
            };
        });
    }

    private updateSubscription() {
        if (this.subscribers.size && (!this.subscription || this.subscription.closed)) {
            this.subscription = this.parentState.observe().subscribe(value => {
                this.subscribers.forEach(sub => sub.next(value));
            });
        } else if (this.subscribers.size === 0 && this.subscription && !this.subscription.closed) {
            this.subscription.unsubscribe();
        }
    }

    ngOnDestroy(): void {
        this.subscribers.forEach(sub => {
            console.error('State slice holds an active subscriber', sub);
            sub.unsubscribe();
        });
    }

    

}