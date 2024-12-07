import React from 'react';
import {Platform, StyleSheet, Text} from 'react-native';
import { Button } from 'react-native-paper';

import { colors, rounded, typography } from '../styles';
interface ScreenButtonProps {
  onPress: () => void;
  title: string;
  color?:string,
}

const ScreenButton: React.FC<ScreenButtonProps> = ({ onPress, title, color}) => {
  return (
    <Button
      style={styles.button}
      mode="contained"
      contentStyle={[styles.buttonContent]}
      onPress={onPress}
      buttonColor={!color ? colors.brown : color}
    >
      <Text style={typography.h4}>{title}</Text>
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    width:'100%',
    borderRadius:rounded.md,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
      },
      android: {
        shadowColor: colors.black,
        shadowOffset: {width: 5, height: 5},
        shadowRadius: 3,
        elevation: 5,
      },
    }),
  },
  buttonContent: {
    padding:2,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
      },
      android: {
        shadowColor: colors.black,
        shadowOffset: {width: 5, height: 5},
        shadowRadius: 3,
        elevation: 5,
      },
    }),
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    marginRight: 10,
  },
});

export default ScreenButton;
