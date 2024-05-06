import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { State } from './state';

@Injectable()
export class ComponentState<TValue extends Record<string, any>>
  implements OnDestroy
{
  subscribers = new Set<Subscriber<TValue | null | undefined>>();
  subscription: Subscription | null = null;

  constructor(private readonly state: State<TValue>) {}

  observe(): Observable<TValue | null | undefined> {
    return new Observable((subscriber) => {
      this.subscribers.add(subscriber);
      this.updateSubscription();
      subscriber.next(this.state.get());
      return () => {
        this.subscribers.delete(subscriber);
        this.updateSubscription();
      };
    });
  }

  private updateSubscription() {
    if (
      this.subscribers.size &&
      (!this.subscription || this.subscription.closed)
    ) {
      this.subscription = this.state.observe().subscribe((value) => {
        this.subscribers.forEach((sub) => sub.next(value));
      });
    } else if (
      this.subscribers.size === 0 &&
      this.subscription &&
      !this.subscription.closed
    ) {
      this.subscription.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.subscribers.forEach((sub) => {
      console.error('State slice holds an active subscriber', sub);
      sub.unsubscribe();
    });
  }
}
