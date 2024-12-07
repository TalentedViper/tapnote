import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

const checkIcon = require('../assets/images/check-box.png');

interface CustomCheckBoxProps {
  onPress: () => void; // Define onPress prop
}

const CustomCheckBox: React.FC<CustomCheckBoxProps> = ({ onPress }) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handlePress = () => {
    setIsChecked(!isChecked);
    onPress(); // Call the onPress function passed from props
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={styles.checkboxContainer}
    >
      <View style={[styles.checkbox]}>
        {isChecked && <Image source={checkIcon} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  checkbox: {
    width: 21,
    height: 21,
    borderWidth: 1,
    borderColor: '#D5C5C5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 2, // Optional: for rounded corners
  }
});

export default CustomCheckBox;
