import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/reducers';
import { isNotify } from '../redux/actions/authAction';
import ScreenButton from '../components/ScreenButton';
import { colors, commonStyles, typography } from '../styles';

const img = require('../assets/images/notifi.png');

type NavigationProps = {
  navigation: StackNavigationProp<any, 'Notification'>;
  route: RouteProp<any, 'Notification'>;
};

const NotificationScreen: React.FC<NavigationProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state : RootState) => state.auth.user);
  const navigateToNotification = async () => {
    const result = await dispatch(isNotify(user.email));
    if (result && result.success) {
      navigation.navigate('Home');
    } else {
      Toast.show({
        type: 'error',
        text1: 'Server error.',
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={{height:520}}>
      <Image source={img} style={styles.img} />
      <Text style={[typography.h2, styles.title]}>
        Push Notifications
      </Text>
      <Text style={[typography.h5, styles.description]}>
        Get push notifications while recording.
      </Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        <ScreenButton onPress={navigateToNotification} title="Notify Me" />
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.notNowButton}
          onPress={navigateToNotification}
        >
          <Text style={[typography.h5, styles.notNowText]}>
            Don’t notify me
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  img: {
    width: 90,
    marginTop: 140,
    alignSelf: 'center', // Improved alignment
    marginBottom: 40,
  },
  title: {
    color: '#140E11',
    textAlign: 'center',
  },
  description: {
    marginHorizontal: 45,
    marginTop: 16,
    textAlign: 'center',
    color: '#5B5356',
  },
  notNowButton: {
    marginTop: 15,
  },
  notNowText: {
    color: '#5B5356',
    textAlign: 'center',
  },
});

export default NotificationScreen;
