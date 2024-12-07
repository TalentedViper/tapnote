import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import ScreenButton from '../components/ScreenButton';
import { colors, commonStyles, typography} from '../styles';

const img = require('../assets/images/success.png');

type NavigationProps = {
  navigation: StackNavigationProp<any, 'CodeVerifySuccess'>;
  route: RouteProp<any, 'CodeVerifySuccess'>;
};

const CodeVerifySuccessScreen: React.FC<NavigationProps> = ({ navigation }) => {

  const codeVerifySuccess = () => {
    navigation.navigate('Location');
  };

  return (
    <View style={styles.container}>
      <View style={{height:520}}>
      <Image  source={img} style={styles.img} width={50} height={50} />
      <Text style={[typography.h2, styles.center, {color:"#140E11"}]}>Verification
        <Text style={{color:colors.lightgreen}}> Successful</Text>
      </Text>
      <Text style={[typography.h5, styles.center,{color:"#5B5356"}]}>Press Continue</Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        <ScreenButton onPress={codeVerifySuccess} title="Continue" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position:'relative',
    backgroundColor:colors.background,
    flex: 1,
    paddingHorizontal: 20,
  },
  img : {
    width:170,
    marginTop:120,
    marginHorizontal:'auto',
    marginBottom:70,
  },
  center: {
    textAlign:'center',
  },
});

export default CodeVerifySuccessScreen;
