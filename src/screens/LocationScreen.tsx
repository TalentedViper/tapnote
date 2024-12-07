import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import ScreenButton from '../components/ScreenButton';


import { colors, commonStyles, typography} from '../styles';


const img = require('../assets/images/location.png');

type NavigationProps = {
  navigation: StackNavigationProp<any, 'Location'>;
  route: RouteProp<any, 'Location'>;
};
const LocationScreen: React.FC<NavigationProps> = ({ navigation }) => {

  const codeVerifySuccess = () => {
    navigation.navigate('Notification');
  };

  const notNow = () => {
    navigation.navigate('Notification');
  };

  return (
    <View style={styles.container}>
      <View style={{height:520}}>
      <Image  source={img} style={styles.img} />
      <Text style={[typography.h2, styles.center, {color:"#140E11"}]}>Find Nearby Users</Text>
      <Text style={[typography.h5, styles.center, styles.description, {color:"#5B5356"}]}>
        Enable location to find nearby Naiza Connect users. 
        Select ‘Always’ to automatically log your sessions. 
        Your location stays private
      </Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        <ScreenButton onPress={codeVerifySuccess} title="Continue" />
        <TouchableOpacity
          activeOpacity={0.7}
          style={[{marginTop:15}]}
          onPress={notNow}
        >
          <Text
            style={[typography.h5, styles.center, {color:'#5B5356'}]}>
            Not Now
          </Text>
        </TouchableOpacity>
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
    width:70,
    marginTop:140,
    marginHorizontal:'auto',
    marginBottom:40,
  },
  description: {
    marginHorizontal:45,
    marginTop:16,
  },
  center: {
    textAlign:'center',
  },
});

export default LocationScreen;
