import React, { useState } from 'react';
import { Alert, TouchableOpacity, Image, Platform, View, StyleSheet, Text, ScrollView } from 'react-native';
import AppleScrollWheel from './components/AppleScrollWheel';

const data = [
  'Welcome to React Native!',
  '🤔 ---  About ---',
  'This is the AppleScrollWheel! 🍎 ',
  'Just rotate your finger around the wheel to scroll.',
  'Works both clockwise and anticlockwise.',
];
const numberOfItems = data.length;

const styles = StyleSheet
  .create(
    {
      outerCircle: {
        borderWidth: 1,
        borderColor: 'lightgrey',
      },
      innerCircle: {
        borderWidth: 1,
        borderColor: 'lightgrey',
        alignItems: 'center',
        justifyContent: 'center',
      },
      container: {
        flex: 1,
      },
      item: {
        padding: 5,
        textAlignVertical: 'center',
        height: 50,
        fontFamily: (Platform.OS === 'ios') ? 'courier' : 'monospace',
        fontWeight: 'bold',
      },
      window: {
        flex: 1,
        padding: 15,
      },
      screen: {
        flex: 1,
        backgroundColor: '#70a7ff',
        paddingTop: 30,
      },
      wheel: {
        flex: 0,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
      },
      selected: {
        backgroundColor: 'blue',
        color: 'white',
      },
    },
  );

export default ({ ...extraProps }) => {
  const [ value, onChangeValue ] = useState(0);
  const [ scrollView, setScrollView ] = useState(null);
  return (
    <View
      style={styles.container}
    >
      <View
        style={styles.window}
      >
        <View
          style={{
            flex: 1,
            overflow: 'hidden',
            borderRadius: 15,
          }}
        >
          <ScrollView
            ref={setScrollView}
            pointerEvents="none"
            style={styles.screen}
          >
            {data.map(
              (item, index) => (
                <Text
                  key={index}
                  style={[
                    styles.item,
                    (index === value) && styles.selected,
                  ].filter(e => !!e)}
                  children={item}
                />
              ),
            )}
          </ScrollView>
          <Image
            style={{
              position: 'absolute',
              top: 5,
              right: 10,
              width: 20,
              height: 20,
            }}
            source={{ uri: 'https://static.thenounproject.com/png/4623-200.png' }}
          />
        </View>
      </View>
      <View
        style={styles.wheel}
      >
        <AppleScrollWheel
          value={value}
          minValue={0}
          increment={1}
          outerCircleStyle={styles.outerCircle}
          innerCircleStyle={styles.innerCircle}
          maxValue={numberOfItems - 1}
          onChangeValue={(value) => {

            scrollView.scrollTo({
              x: 0,
              y: value * 50,
              animated: false,
            });
            onChangeValue(
              value,
            );
          }}
          InnerComponent={() => (
            <TouchableOpacity
              onPress={() => Alert.alert(data[value])}
            >
              <Image
                style={{
                  width: 60,
                  height: 60,
                }}
                source={{
                  uri: 'https://png.pngtree.com/svg/20170719/react_1353128.png',
                }}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};
