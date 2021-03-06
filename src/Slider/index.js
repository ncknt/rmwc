// @flow
import * as React from 'react';
import classNames from 'classnames';
import { MDCSlider } from '@material/slider/dist/mdc.slider';
import { simpleTag } from '../Base';

import {
  withFoundation,
  addClass,
  removeClass,
  syncFoundationProp
} from '../Base/MDCFoundation';

export const SliderRoot = simpleTag({
  displayName: 'SliderRoot',
  classNames: props => [
    'mdc-slider',
    {
      'mdc-slider--discrete': props.discrete,
      'mdc-slider--display-markers': props.displayMarkers && props.discrete
    }
  ],
  consumeProps: ['discrete', 'displayMarkers']
});

export const SliderTrackContainer = simpleTag({
  displayName: 'SliderTrackContainer',
  classNames: 'mdc-slider__track-container'
});

export const SliderTrack = simpleTag({
  displayName: 'SliderTrack',
  classNames: 'mdc-slider__track'
});

export const SliderTrackMarkerContainer = simpleTag({
  displayName: 'SliderTrackMarkerContainer',
  classNames: 'mdc-slider__track-marker-container'
});

export const SliderThumbContainer = simpleTag({
  displayName: 'SliderThumbContainer',
  classNames: 'mdc-slider__thumb-container'
});

export const SliderPin = simpleTag({
  displayName: 'SliderPin',
  classNames: 'mdc-slider__pin'
});

export const SliderPinValueMarker = simpleTag({
  displayName: 'SliderPinValueMarker',
  tag: 'span',
  classNames: 'mdc-slider__pin-value-marker'
});

export const SliderThumb = props => (
  <svg className="mdc-slider__thumb" width="21" height="21">
    <circle cx="10.5" cy="10.5" r="7.875" />
  </svg>
);

export const SliderFocusRing = simpleTag({
  displayName: 'SliderFocusRing',
  classNames: 'mdc-slider__focus-ring'
});

type SliderPropsT = {
  /** A callback that fires when the Slider stops sliding which takes an event with event.detail.value set to the Slider's value. */
  onChange?: (evt: { detail: { value: number } }) => mixed,
  /** A callback that fires continuously while the Slider is slidng that takes an event with event.detail.value set to the Slider's value. */
  onInput?: (evt: { detail: { value: number } }) => mixed,
  /** The value of the Slider. */
  value?: number | string,
  /** The minimum value of the Slider. */
  min?: number | string,
  /** The maximum value of the Slider. */
  max?: number | string,
  /** A step to quantize values by. */
  step?: number | string,
  /** Displays the exact value of the Slider on the knob. */
  discrete?: boolean,
  /** Displays the individual step markers on the Slider track. */
  displayMarkers?: boolean,
  /** Disables the control. */
  disabled?: boolean
};

export class Slider extends withFoundation({
  constructor: MDCSlider,
  refs: [
    'root_',
    'thumbContainer_',
    'track_',
    'pinValueMarker_',
    'trackMarkerContainer_'
  ],
  adapter: {
    addClass: addClass(),
    removeClass: removeClass()
  }
})<SliderPropsT, {}> {
  static displayName = 'Slider';

  get discrete(): boolean {
    return this.foundation_.isDiscrete_;
  }

  set discrete(isDiscrete: boolean) {
    this.foundation_.isDiscrete_ = isDiscrete;
  }

  get displayMarkers(): boolean {
    return this.foundation_.hasTrackMarker_;
  }

  set displayMarkers(isDisplayMarkers: boolean) {
    this.foundation_.hasTrackMarker_ = isDisplayMarkers;
  }

  syncWithProps(nextProps: SliderPropsT) {
    // value
    syncFoundationProp(
      nextProps.value,
      this.value,
      () => (this.value = nextProps.value)
    );

    // max
    syncFoundationProp(
      nextProps.max,
      this.max,
      () => (this.max = nextProps.max)
    );

    // min
    syncFoundationProp(
      nextProps.min,
      this.min,
      () => (this.min = nextProps.min)
    );

    // step
    syncFoundationProp(
      nextProps.step,
      this.step,
      () => (this.step = nextProps.step)
    );

    // disabled
    syncFoundationProp(
      nextProps.disabled,
      this.disabled,
      () => (this.disabled = nextProps.disabled)
    );

    // discrete
    syncFoundationProp(
      nextProps.discrete,
      this.discrete,
      () => (this.discrete = !!nextProps.discrete)
    );

    //eslint-disable-next-line eqeqeq
    if (this.discrete && this.foundation_.getStep() == 0) {
      this.step = 1;
    }

    // displayMarkers
    syncFoundationProp(nextProps.displayMarkers, this.displayMarkers, () => {
      this.displayMarkers = !!nextProps.displayMarkers;
      window.requestAnimationFrame(() => this.foundation_.setupTrackMarker());
    });
  }

  render() {
    const {
      value,
      min,
      max,
      discrete,
      displayMarkers,
      step,
      disabled,
      onChange,
      onInput,
      className,
      children,
      apiRef,
      ...rest
    } = this.props;

    const {
      root_,
      thumbContainer_,
      track_,
      pinValueMarker_,
      trackMarkerContainer_
    } = this.foundationRefs;

    if (displayMarkers && !discrete) {
      console.warn(
        `The 'displayMarkers' prop on rmwc Slider will 
        only work in conjunction with the 'discrete' prop`
      );
    }

    const dataStep = step ? { 'data-step': step } : {};

    return (
      <SliderRoot
        className={classNames(className, [...this.state.classes])}
        tabIndex="0"
        role="slider"
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label="Select Value"
        elementRef={root_}
        discrete={discrete}
        displayMarkers={displayMarkers}
        {...(disabled ? { 'aria-disabled': disabled } : {})}
        {...dataStep}
        {...rest}
      >
        <SliderTrackContainer>
          <SliderTrack elementRef={track_} />
          {displayMarkers && (
            <SliderTrackMarkerContainer elementRef={trackMarkerContainer_} />
          )}
        </SliderTrackContainer>
        <SliderThumbContainer elementRef={thumbContainer_}>
          {discrete && (
            <SliderPin>
              <SliderPinValueMarker elementRef={pinValueMarker_} />
            </SliderPin>
          )}
          <SliderThumb />
          <SliderFocusRing />
        </SliderThumbContainer>
        {children}
      </SliderRoot>
    );
  }
}

export default Slider;
