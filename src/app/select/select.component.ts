import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  fromEvent,
  map,
  merge,
  skip,
  startWith,
  Subscription,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { SlideDown, SlideUp } from '../animations/animations';
import { NgSubscribeContext, NgSubscribeDirective } from '../directives/ng-subscribe.directive';

export interface Item {
  text: number;
}

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  animations: [SlideDown, SlideUp],
})
export class SelectComponent implements OnInit, OnDestroy {
  protected showMenu = new EventEmitter<boolean>(false);
  protected animation$ = new BehaviorSubject<'slideDown' | 'slideUp' | 'void'>('void');
  protected combine$ = combineLatest([this.showMenu, this.animation$]).pipe(
    startWith([false, 'void'] as [boolean, 'slideDown' | 'slideUp' | 'void']),
    map(([showMenu, animation]) => ({
      menu: showMenu,
      animation,
    })),
  );
  private subscription: Subscription | undefined;
  protected isShowMenu = false;

  @Input()
  items: Array<Item> | undefined;

  @ViewChild('select', { static: true })
  selectRef: ElementRef<HTMLElement> | undefined;

  @ViewChild('selectMenu')
  private set selectMenuRef(elemRef: ElementRef<HTMLElement>) {
    if (elemRef) {
      const { bottom } = elemRef.nativeElement.getBoundingClientRect();
      const IsShowTop = bottom > window.innerHeight
      this.animation$.next(IsShowTop ? 'slideUp' : 'slideDown');

      if (IsShowTop) {
        this.renderer.addClass(elemRef.nativeElement, 'showTop');
      }
    }
  }

  @Output()
  selectItem = new EventEmitter<Item>();

  @Input()
  selectedItem: Item | undefined;
  
  constructor(private renderer: Renderer2) {}

  onSelectItem(item: Item) {
    this.selectItem.emit(item);
    this.showToggle();
  }

  showToggle() {
    this.isShowMenu = !this.isShowMenu;
    this.showMenu.emit(this.isShowMenu);
  }

  ngOnInit(): void {
    if (this.selectRef) {
      this.subscription = fromEvent(this.selectRef.nativeElement, 'click')
        .pipe(
          tap(() => {
            this.showToggle();
          }),
          filter(() => this.isShowMenu),
          switchMap(() =>
            merge(
              fromEvent(document, 'click'),
              fromEvent(document, 'scroll')
            ).pipe(skip(1), takeUntil(this.showMenu))
          )
        )
        .subscribe((event) => {
          if (
            !(event.target as HTMLElement).contains(document) ||
            event.type == 'scroll'
          ) {
            this.showToggle();
          }
        });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
