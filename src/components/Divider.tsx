import React from 'react';
import { View, StyleSheet } from 'react-native';

const Divider = () => {
  return <View style={styles.divider} />;
};

const styles = StyleSheet.create({
  divider: {
    height: 0.5,
    backgroundColor: 'rgba(102, 102, 102, 0.3)',
  },
});

export default Divider;