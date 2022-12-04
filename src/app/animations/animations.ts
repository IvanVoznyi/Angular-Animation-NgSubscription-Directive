import {
  style,
  animate,
  trigger,
  transition,
  state
} from '@angular/animations';

export const SlideDown = trigger('slideDown', [
  state(
    "void",
    style({
      transform: 'translateY(-10%)',
      opacity: 0,
    }),
  ),
  state(
    "slideDown",
    style({
      opacity: 1,
      transform: 'translateY(0%)'
    })
  ),
  transition("slideDown => void, void => slideDown", [animate('.5s ease-in-out')]),

]);

export const SlideUp = trigger('slideUp', [
  state(
    "void",
    style({
      transform: 'translateY(10%)',
      opacity: 0,
    }),
  ),
  state(
    "slideUp",
    style({
      opacity: 1,
      transform: 'translateY(0%)'
    })
  ),
  transition("slideUp => void, void => slideUp", [animate('.5s ease-in-out')]),
]);