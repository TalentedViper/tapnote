import React from 'react';
import { StyleSheet, Text} from 'react-native';
import { Button } from 'react-native-paper';

import { colors, rounded } from '../styles';

interface AuthButtonProps {
  onPress: () => void;
  title: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({ onPress, title }) => {
  return (
    <Button
      style={{ borderRadius:5 }}
      mode="contained"
      contentStyle={[styles.buttonContent]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Button>
  );
};

const styles = StyleSheet.create({
  buttonContent: {
    padding:3,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:colors.brown
  },
  buttonText: {
    fontFamily:'Poppins',
    fontWeight:'500',
    color: '#ffffff',
    fontSize: 18,
    marginRight: 10,
  }
});

export default AuthButton;
