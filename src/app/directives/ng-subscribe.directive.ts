import {
  Directive,
  Input,
  ViewContainerRef,
  TemplateRef,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';

export class NgSubscribeContext<T> {
  public $implicit: T = undefined as T;
  public ngSubscribe: T = undefined as T;
}

@Directive({
  selector: '[ngSubscribe]',
})
export class NgSubscribeDirective<T> implements OnInit, OnDestroy {
  private context = new NgSubscribeContext<T>();
  private subscription: Subscription | undefined;

  @Input()
  set ngSubscribe(observable: Observable<T>) {
    this.subscription = observable.subscribe((value: T) => {
      this.context.$implicit = value;
      this.context.ngSubscribe = value;
      this.ChangeDetectorRef.detectChanges()
    });
  }

  constructor(
    private viewContainer: ViewContainerRef,
    private ChangeDetectorRef: ChangeDetectorRef,
    private templateRef: TemplateRef<NgSubscribeContext<T>>
  ) {}

  ngOnInit() {
    this.viewContainer.createEmbeddedView(this.templateRef, this.context);
  }

  static ngTemplateContextGuard<T>(
    directive: NgSubscribeDirective<T>,
    context: NgSubscribeContext<T>
  ): context is NgSubscribeContext<T> {
    return true;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
