import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../styles';

interface SwichToggleProps {
  text: string;
  isVisible: boolean;
  onToggleChange: (newState: boolean) => void;  // Add prop for function from parent
}

const SwichToggle: React.FC<SwichToggleProps> = ({ text, isVisible, onToggleChange }) => {
  const [isEnabled, setIsEnabled] = React.useState(isVisible);

  const toggleSwitch = () => {
    const newState = !isEnabled; // Toggle the state
    setIsEnabled(newState); // Update local state
    onToggleChange(newState); // Call the function passed from the parent to update its state
  };

  return (
    <View style={styles.item}>
      <Text style={styles.text}>{text}</Text>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={toggleSwitch}
        style={styles.switchContainer}>
        <View style={[styles.track, isEnabled && styles.trackEnabled, isEnabled ? styles.flexend : styles.flexstart]}>
          <View style={[styles.thumb, isEnabled && styles.thumbEnabled]} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: colors.white,
    borderRadius: 10,
  },
  text: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 24,
    color: '#140E11',
  },
  switchContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  track: {
    width: 56,
    borderRadius: 30,
    backgroundColor: '#D0D0D0',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  flexend: {
    alignItems: 'flex-end',
  },
  flexstart: {
    alignItems: 'flex-start',
  },
  trackEnabled: {
    backgroundColor: colors.brown,
  },
  thumb: {
    width: 27,
    height: 27,
    borderRadius: 12.5,
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 1,
  },
  thumbEnabled: {
    backgroundColor: 'white',
  },
});

export default SwichToggle;
