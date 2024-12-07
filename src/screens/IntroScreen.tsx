// src/screens/IntroScreen.tsx
import React from 'react';
import { View, StyleSheet, Image, ImageBackground, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { colors, rounded } from '../styles';

const logo = require('../assets/images/l-logo.png');
const arrowRight = require('../assets/images/arrow-right.png');
const bg_intro = require('../assets/images/bg-intro.png');

const IntroScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  
  const handleGetStarted = async() => {
    navigation.navigate('Login');
  };

  return (
    <ImageBackground
      source={bg_intro}
      style={styles.container}
    >
      <Image source={logo} style={styles.logo} />
      <View style={styles.btn_form}>
        <Button
          style={{ borderRadius: rounded.lg }}
          mode="contained"
          contentStyle={[styles.buttonContent]}
          onPress={handleGetStarted}
          buttonColor={colors.brown}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <Image source={arrowRight} />
        </Button>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bgimage: {
    height: '100%',
    width: '100%',
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    marginTop: 110,
  },
  btn_form: {
    position: 'absolute',
    marginVertical: 10,
    width: '100%',
    bottom: 50,
  },
  buttonContent: {
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins',
    fontWeight: '500',
    color: '#fff',
    lineHeight: 24,
    fontSize: 16,
    marginRight: 10,
  }
});

export default IntroScreen;
