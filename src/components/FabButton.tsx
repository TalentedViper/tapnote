import React from 'react';
import { TouchableOpacity, View, StyleSheet, Image } from 'react-native';


const microPhone = require('../assets/images/microphone.png');
const FAB_WIDTH = 74;

const FabButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <View >
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.fab}
        onPress={onPress}>
        <Image
          source={microPhone}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    left: '50%',
    bottom:70,
    transform: [
      { translateY: 0 }, 
      { translateX: -FAB_WIDTH / 2 },
    ],
    position: 'absolute',
    backgroundColor: '#F44336',
    borderRadius: 50,
    width: 74,
    height: 74,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FabButton;
