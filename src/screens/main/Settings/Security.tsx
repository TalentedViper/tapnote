import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  TouchableOpacity,
  Platform
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import UserDeleteModal from './UserDeleteModal';
import SwichToggle from '../../../components/SwichToggle';
import { settingSecurityEdit, userDeleteModalShow } from '../../../redux/actions/authAction';
import { colors, rounded, typography } from '../../../styles';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/reducers';

const left_arrow = require('../../../assets/images/left-arrow.png');


type NavigationProps = {
  navigation: StackNavigationProp<any, 'Security'>;
};

const Security: React.FC<NavigationProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.auth.user);
  const [toggleStates, setToggleStates] = useState({
    faceId: userInfo?.is_face_id === 1 ? true : false,
    rememberMe: userInfo?.is_remember === 1 ? true : false,
    touchId: userInfo?.is_touch_id === 1 ? true : false,
    notificationPreference: userInfo?.is_notify === 1 ? true : false,
    emailNotification: userInfo?.is_email_notify === 1 ? true : false,
  });

  // Define a generic handler to update toggle states based on the key
  const handleToggleChange = async (key: string, newState: boolean) => {
    setToggleStates(prevState => ({
      ...prevState,
      [key]: newState,
    }));
    const result = await (dispatch as any)(settingSecurityEdit(key, newState ? 1 : 0));
    if (result.success) {
      Toast.show({
        type: 'success',
        text1: result.message,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Failed!',
      });
    }
  };

  const goBack = () => {
    navigation.navigate('Setting');
  };
  const changePassword = () => {
    navigation.navigate("ChangePassword");
  };

  return (
    <View style={styles.container}>
      <View style={styles.title_part}>
        <TouchableOpacity
          onPress={goBack}
          style={styles.go_back}>
          <Image source={left_arrow} />
        </TouchableOpacity>
        <Text style={[styles.page_title, typography.h3, { color: colors.bandingblack }]}>Security</Text>
        <Text style={styles.heddin_text}></Text>
      </View>
      <UserDeleteModal />
      <ScrollView>
        <View style={styles.item_group}>
          {/* <SwichToggle
            text="Face ID"
            isVisible={toggleStates.faceId}
            onToggleChange={(newState) => handleToggleChange('face_id', newState)}
          /> */}
          <SwichToggle
            text="Remember Me"
            isVisible={toggleStates.rememberMe}
            onToggleChange={(newState) => handleToggleChange('remember_me', newState)}
          />
          <SwichToggle
            text="Touch ID"
            isVisible={toggleStates.touchId}
            onToggleChange={(newState) => handleToggleChange('touch_id', newState)}
          />
          <SwichToggle
            text="Notification Preference"
            isVisible={toggleStates.notificationPreference}
            onToggleChange={(newState) => handleToggleChange('notification_preference', newState)}
          />
          <SwichToggle
            text="Email Notification"
            isVisible={toggleStates.emailNotification}
            onToggleChange={(newState) => handleToggleChange('email_notification', newState)}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={changePassword}
          style={[styles.button, { backgroundColor: '#1D5C77' }]}
        >
          <Text style={[typography.h4, styles.btn_text]}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ marginBottom: 60 }}
          onPress={() => dispatch(userDeleteModalShow())}
        >
          <Text style={[typography.h4, styles.del_account]}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  title_part: {
    flexDirection: 'row',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 26,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  go_back: {
    width: 22,
    height: 12,
    left: 0,
  },
  page_title: {
    fontWeight: 'bold',
    alignSelf: 'center',
    color: colors.black,
  },
  heddin_text: {
    width: 22,
  },
  item_group: {
    flexDirection: 'column',
    gap: 10,
    marginBottom: 22,
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    marginBottom: 32,
    borderRadius: rounded.xl,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
      },
      android: {
        shadowColor: colors.black,
        shadowOffset: { width: 5, height: 3 },
        shadowRadius: 3,
        elevation: 3,
      },
    }),
  },
  btn_text: {
    alignSelf: 'center',
    color: 'white',
  },
  del_account: {
    color: '#FF3B30',
    alignSelf: 'center',
  }
});

export default Security;
