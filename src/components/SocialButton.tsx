import React from 'react';
import {Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';

import {colors} from '../styles';

interface SocialButtonProps {
  onPress: () => void;
  img: any;
}

const SocialButton: React.FC<SocialButtonProps> = ({ onPress, img }) => {
  return (
    <TouchableOpacity
        activeOpacity={0.8}
        style={styles.show_box}
        onPress={onPress}
    >
        <Image source={img} style={styles.social_icon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  show_box: {
    width:74,
    height:35,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 1)',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: 5,
          width: 5,
        },
      },
      android: {
        padding: 6,
        marginVertical: 4,
        borderRadius: 5,
        shadowColor: colors.black,
        shadowOffset: {width: 0, height: 5},
        backgroundColor: 'white',
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
      },
    }),
  },
  social_icon: {
    margin:'auto',
  },
});

export default SocialButton;
