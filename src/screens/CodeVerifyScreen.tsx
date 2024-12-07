import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, resendCode } from '../redux/actions/authAction';
import { RootState } from '../redux/reducers';
import ScreenButton from '../components/ScreenButton';
import { colors, typography } from '../styles';

const logo = require('../assets/images/logo-3.png');

type NavigationProps = {
  navigation: StackNavigationProp<any, 'CodeVerify'>;
  route: RouteProp<any, 'CodeVerify'>;
};

const CodeVerifyScreen: React.FC<NavigationProps> = ({ navigation }) => {

  const user = useSelector((state: RootState) => state.auth.user);
  const [otp, setOtp] = useState<string[]>(Array(4).fill(''));
  const inputRefs = useRef<(TextInput | null)[]>(Array(4).fill(null));
  const dispatch = useDispatch();

  const handleChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input if current input is filled
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const validateOtp = () => {
    const enteredOtp = otp.join('');
    if (otp.some((digit) => digit === '')) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill in all digits of the OTP.',
      });
      return false;
    }
    if (!/^\d+$/.test(enteredOtp)) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'OTP must contain only digits.',
      });
      return false;
    }
    if (enteredOtp !== (user.otp).toString()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Incorrect OTP. Please try again.',
      });
      return false;
    }
    return true;
  };

  const codeVerify = async () => {
    if (validateOtp()) {
      const result = await (dispatch as any)(verifyOtp(user));
      if (result && result.success) {
        Toast.show({
          type: 'success',
          text1: 'Code Verification Success!',
        });
        navigation.navigate('CodeVerifySuccess');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Code Verification Error!',
        });
      }
    }
  };

  const resendOtp = async () => {
    const result = await (dispatch as any)(resendCode(user.email));
    if (result && result.success) {
      Toast.show({
        type: 'success',
        text1: 'OTP resend successfully!',
      });
      ToastAndroid.show( `OTP : ${(result.data).toString()}`, ToastAndroid.SHORT);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Email does not exist!',
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ height: 520 }}>
        <Image source={logo} style={styles.logo} />
        <Text style={[styles.screen_title, typography.h2]}>Code Verification</Text>
        <Text style={[styles.description, typography.h5]}>
          Enter 4 Digit Code we have sent to you at
          <Text style={styles.mailaddress}> {user.email}</Text>
        </Text>
        <View style={styles.input_form}>
          {otp.map((value, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)} // Assigning ref
              value={value}
              onChangeText={(text) => handleChange(index, text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              maxLength={1}
              style={styles.input}
              placeholderTextColor={colors.place_text}
            />
          ))}
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={resendOtp}>
          <Text style={[typography.h5, styles.center, { color: colors.brown, marginBottom: 30 }]}>
            Resend
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: 'center' }}>
        <ScreenButton onPress={codeVerify} title="Continue" />
      </View>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: colors.background,
    flex: 1,
    paddingHorizontal: 20,
  },
  logo: {
    width: 160,
    marginTop: 31,
    marginHorizontal: 'auto',
    marginBottom: 13,
  },
  screen_title: {
    marginBottom: 15,
    color: '#140E11',
    textAlign: 'center',
    fontWeight: '500',
  },
  description: {
    paddingHorizontal: 60,
    textAlign: 'center',
    marginBottom: 30,
  },
  mailaddress: {
    fontWeight: 'bold',
    color: '#140E11',
  },
  input_form: {
    marginHorizontal: 'auto',
    flexDirection: 'row',
    gap: 20,
    marginBottom: 30,
  },
  input: {
    width: 57,
    borderBottomWidth: 1,
    borderColor: '#ADADAD',
    padding: 10,
    textAlign: 'center',
    color: '#5B5356',
    fontSize: 24,
    lineHeight: 24,
    fontWeight: '500',
    fontFamily: 'Poppins'
  },
  center: {
    textAlign: 'center',
  },
});

export default CodeVerifyScreen;
