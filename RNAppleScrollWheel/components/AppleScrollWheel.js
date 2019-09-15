import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Animated,
  PanResponder,
} from 'react-native';

class AppleScrollWheel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      panResponder: PanResponder
        .create(
          {
            onStartShouldSetPanResponder: () => true,
            onMoveSouldSetPanResponder: () => false,
            onPanResponderGrant: this.onPanResponderGrant,
            onPanResponderMove: this.onPanResponderMove,
            onPanResponderRelease: this.onPanResponderRelease,
            onPanResponderTerminate: this.onPanResponderRelease,
          },
        ),
      t: null,
    };
  }
  onPanResponderRelease = () => (
    this.state.t = null
  );
  onPanResponderGrant = ({ nativeEvent }, gestureState) => {
    const { locationX, locationY } = nativeEvent;
    const {
      radius,
      increment,
      minValue,
      maxValue,
    } = this.props;
    this.state.t = null;
  };
  onPanResponderMove = ({ nativeEvent }, gestureState) => {
    const { locationX, locationY } = nativeEvent;
    const {
      radius,
      innerRadius,
      maxValue,
      minValue,
      value,
      increment,
      onChangeValue,
    } = this.props;
    if (AppleScrollWheel.isWithinOuterCircle(
      locationX,
      locationY,
      radius,
      innerRadius,
    )) {
      const t = AppleScrollWheel.getTouchAngle(
        locationX,
        locationY,
        radius,
      );
      if (this.state.t !== null) {
        const d = (t - this.state.t) % 360;
        if (Math.abs(d) >= increment) {
          const nextValue = Math.round((value + d) / increment) * increment;
          const valueInRange = (
            Math.min(maxValue, Math.max(minValue, nextValue))
          );
          if (Math.abs(d) > (2 * increment)) {
            return this.state.t = t;
          }
          if (valueInRange !== value) {
            this.state.t = t;
            onChangeValue(
              valueInRange,
            );
          }
        }
      } else {
        this.state.t = t;
      }
    } else {
      this.state.t = null;
    };
  };
  static getTouchAngle = (x, y, r) => Math.atan2((y - r), (x - r)) * (180 / Math.PI) + 180
  static isWithinCircle = (x, y, cx, cy, r) => (((x - cx) * (x - cx)) + ((y - cy) * (y - cy))) <= (r * r);
  static isWithinOuterCircle = (x, y, radius, innerRadius) => !AppleScrollWheel.isWithinCircle(x, y, radius, radius, innerRadius) && AppleScrollWheel.isWithinCircle(x, y, radius, radius, radius);
  render() {
    const {
      radius,
      innerRadius,
      value,
      outerCircleStyle,
      innerCircleStyle,
      InnerComponent,
    } = this.props;
    const {
      panResponder,
      // TODO: remove
    } = this.state;
    return (
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          outerCircleStyle,
          {
            width: radius * 2,
            height: radius * 2,
            borderRadius: radius,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <Animated.View
          pointerEvents="box-none"
          style={[
            innerCircleStyle,
            {
              width: innerRadius * 2,
              height: innerRadius * 2,
              borderRadius: innerRadius,
            },
          ]}
        >
          <InnerComponent
          />
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet
  .create(
    {
      outerCircleStyle: {
        overflow: 'hidden',
        backgroundColor: 'firebrick',
      },
      innerCircleStyle: {
        overflow: 'hidden',
        backgroundColor: 'green',
      },
    },
  );

AppleScrollWheel.propTypes = {
  radius: PropTypes.number,
  innerRadius: PropTypes.number,
  increment: PropTypes.number,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  value: PropTypes.number,
  onChangeValue: PropTypes.func,
  outerCircleStyle: PropTypes.shape({}),
  innerCircleStyle: PropTypes.shape({}),
  InnerComponent: PropTypes.func,
};

AppleScrollWheel.defaultProps = {
  radius: 120,
  innerRadius: 60,
  increment: 10,
  minValue: 360 * -2,
  maxValue: 360 * 2,
  value: 0,
  onChangeValue: v => null,
  outerCircleStyle: styles.outerCircleStyle,
  innerCircleStyle: styles.innerCircleStyle,
  InnerComponent: React.Fragment,
};

export default AppleScrollWheel;
