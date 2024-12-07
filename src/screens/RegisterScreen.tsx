import React, { useEffect, useState } from 'react';
import { useDispatch, UseDispatch } from 'react-redux';
import { View, Text, Linking, TextInput, Image, StyleSheet, TouchableOpacity, Platform, Alert, ScrollView, ToastAndroid } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import { ActivityIndicator, Checkbox } from 'react-native-paper';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
// import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
// import { TwitterAuthProvider } from '@react-native-twitter-signin/twitter-signin';
import DeviceInfo from 'react-native-device-info';
import { signUp as userSignUp, socialLogin } from '../redux/actions/authAction';
import AuthButton from '../components/AuthButton';
import SocialButton from '../components/SocialButton';
import { fetchLocation } from '../utils';
import { BASE_URL } from '../config';

import { colors, rounded, typography } from '../styles';

const left_arrow = require('../assets/images/left-arrow.png');
const logo = require('../assets/images/s-logo.png');
const google = require('../assets/images/google.png');
const facebook = require('../assets/images/facebook.png');
const twitter = require('../assets/images/twitter.png');

type NavigationProps = {
  navigation: StackNavigationProp<any, 'Register'>;
  route: RouteProp<any, 'Register'>;
};

interface SignUpFormValues {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
}

const validationSchema = Yup.object().shape({
  first_name: Yup.string().required('First Name is required'),
  last_name: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Confirm Password is required'),
  agree: Yup.boolean().oneOf([true], 'You must agree to the terms and policy.'),
});

const RegisterScreen: React.FC<NavigationProps> = ({ navigation }) => {


  const GOOGLE_CLIENT_ID = process.env['GOOGLE_CLIENT_ID'];

  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(false);

  const [state, setState] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const deviceModel = DeviceInfo.getModel();

  const socialChange = (type: string) => {
    console.log("social_btn clicked!", type);
  };

  const signUp = async (values: SignUpFormValues) => {
    setLoading(true);
    const user_data = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      password: values.password,
      device_type: Platform.OS === 'ios' ? 1 : 0,
      device_token: 'token_secret',
    }
    const result = await (dispatch as any)(userSignUp(user_data));
    setLoading(false);
    if (result && result.success) {
      Toast.show({
        type: 'success',
        text1: 'Sign Up Successful!',
      });
      const opt = (result.data.otp).toString();
      ToastAndroid.show( `OTP : ${opt}`, ToastAndroid.SHORT);
      navigation.navigate('CodeVerify');
    } else if (result && !result.success) {
      Toast.show({
        type: 'error',
        text1: 'The email already exist.'
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Sign Up Failed!',
      });
    }
  };

  // Google Sign-In
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const { data } = await GoogleSignin.signIn();

      if (data) {
        const userInfo = {
          first_name: data?.user.givenName,
          last_name: data?.user.familyName || ' ',
          email: data?.user.email,
          device_type: Platform.OS === 'ios' ? 1 : 0,
          device_token: 'token_secret',
          device_model: deviceModel,
          country: country,
          location: state,
        }
        const result = await (dispatch as any)(socialLogin(userInfo, 1));
        setLoading(false);
        if (result && result.success) {
          Toast.show({
            type: 'success',
            text1: 'Login Success!',
            text2: 'Welcome to TapNote.'
          });
          if (!result.data.password) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'SetNewPassword', params: { email: result.data.email } }],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
          }
        } else {
          Toast.show({
            type: 'error',
            text1: 'Login Failed!',
            text2: result?.message || 'Login failed!'
          });
        }
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Sign in is in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play services not available');
      } else {
        Alert.alert('Something went wrong', error.toString());
      }
    } finally {
      console.log('final');
      setLoading(false);
      signOut();
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error(error);
    }
  };


  const openBrowser = () => {
    const url = `${BASE_URL}/terms_conditions`;
    Linking.openURL(url).catch((err) => {
      console.error("Failed to open URL:", err);
    });
  }

  useEffect(() => {
    configureGoogleSign();
    const getlocation = async () => {
      const fetchedLocation = await fetchLocation();
      if (fetchedLocation && typeof fetchedLocation !== 'boolean') {
        setCountry(fetchedLocation.country);
        setState(fetchedLocation.state)
      } else {
        console.error('Invalid location or permission denied');
      }
    }
    getlocation();
  }, []);

  const configureGoogleSign = () => {
    GoogleSignin.configure({
      webClientId: GOOGLE_CLIENT_ID,
      offlineAccess: true,
    });
  };

  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator style={{ height: '100%', position: 'absolute', zIndex: 99, alignSelf: 'center', justifyContent: 'center' }} size="large" color={colors.brown} />
      )}
      <View style={styles.top_part}>
        <View>
          <TouchableOpacity
            style={styles.go_back}
            onPress={() => navigation.navigate('Login')}>
            <Image source={left_arrow} />
          </TouchableOpacity>
          <Text style={[styles.screen_title, typography.h3]}>Create your account</Text>
        </View>
        <Image source={logo} width={110} style={{ marginRight: -20 }} />
      </View>
      <ScrollView>
        <Formik
          initialValues={{ first_name: '', last_name: '', email: '', password: '', confirmPassword: '', agree: false }}
          validationSchema={validationSchema}
          onSubmit={signUp}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <>
              <View style={styles.input_form}>
                <Text style={[styles.input_label, typography.h4]}>First Name</Text>
                <TextInput
                  placeholder="ex: john"
                  keyboardAppearance="light"
                  placeholderTextColor={colors.place_text}
                  style={styles.input}
                  onChangeText={handleChange('first_name')}
                  onBlur={handleBlur('first_name')}
                  value={values.first_name}
                />
                {touched.first_name && errors.first_name && <Text style={styles.errorText}>{errors.first_name}</Text>}
              </View>
              <View style={styles.input_form}>
                <Text style={[styles.input_label, typography.h4]}>Last Name</Text>
                <TextInput
                  placeholder="ex: smith"
                  keyboardAppearance="light"
                  placeholderTextColor={colors.place_text}
                  style={styles.input}
                  onChangeText={handleChange('last_name')}
                  onBlur={handleBlur('last_name')}
                  value={values.last_name}
                />
                {touched.last_name && errors.last_name && <Text style={styles.errorText}>{errors.last_name}</Text>}
              </View>
              <View style={styles.input_form}>
                <Text style={[styles.input_label, typography.h4]}>Email</Text>
                <TextInput
                  placeholder="ex: john.smith@email.com"
                  keyboardAppearance="light"
                  placeholderTextColor={colors.place_text}
                  style={styles.input}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                />
                {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>
              <View style={styles.input_form}>
                <Text style={[styles.input_label, typography.h4]}>Password</Text>
                <TextInput
                  placeholder="*********"
                  keyboardAppearance="light"
                  secureTextEntry
                  placeholderTextColor={colors.place_text}
                  style={styles.input}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                />
                {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>
              <View style={styles.input_form}>
                <Text style={[styles.input_label, typography.h4]}>Confirm password</Text>
                <TextInput
                  placeholder="*********"
                  secureTextEntry
                  placeholderTextColor={colors.place_text}
                  style={styles.input}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                />
                {touched.confirmPassword && errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
              </View>
              <View style={[styles.agree]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {/* <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      const newValue = !isChecked;
                      setIsChecked(newValue);
                      setFieldValue('agree', newValue); // Update Formik state
                    }}
                    style={styles.checkboxContainer}
                  >
                    <View style={[styles.checkbox]}>
                      {isChecked && <Image source={checkIcon} />}
                    </View>
                  </TouchableOpacity> */}
                  <Checkbox
                    uncheckedColor={colors.brown}
                    color={colors.brown}
                    status={isChecked ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setIsChecked(!isChecked);
                      setFieldValue('agree', !isChecked); // Update Formik state
                    }}
                  />
                  <Text style={[styles.understood, typography.baseline]}>I understood the </Text>
                  <TouchableOpacity activeOpacity={0.7} onPress={openBrowser}>
                    <Text style={[styles.policy_text, typography.baseline]}>terms & policy.</Text>
                  </TouchableOpacity>
                </View>
                {touched.agree && errors.agree && <Text style={styles.errorText}>{errors.agree}</Text>}
              </View>
              <View style={{ paddingHorizontal: 36 }}>
                <AuthButton title="Sign Up" onPress={handleSubmit} />
              </View>
              <Text style={styles.with_text}>or sign up with</Text>
              <View style={styles.social_btn_form}>
                <SocialButton onPress={() => handleGoogleLogin()} img={google} />
                <SocialButton onPress={() => socialChange("facebook")} img={facebook} />
                {/* <SocialButton onPress={() => socialChange("twitter")} img={twitter} /> */}
              </View>
              <View style={styles.bottom_part}>
                <Text style={styles.question_text}>Have an account?</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.go_login}>Login</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
  },
  top_part: {
    marginTop: 6,
    marginBottom: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  go_back: {
    width: 20,
    height: 16,
    marginTop: 23,
  },
  screen_title: {
    marginTop: 50,
    color: colors.black,
  },
  input_form: {
    marginTop: 16,
  },
  input_label: {
    color: '#2C2B35',
    marginBottom: 12,
  },
  input: {
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: rounded.sm,
    paddingVertical: 10,
    paddingHorizontal: 15,
    zIndex: -33,
  },
  agree: {
    paddingHorizontal: 0,
    marginTop: 9,
    marginBottom: 19,
  },
  understood: {
    color: colors.lightgrey,
  },
  policy_text: {
    color: colors.brown,
  },
  social_btn_form: {
    marginHorizontal: 'auto',
    flexDirection: 'row',
    gap: 10,
  },
  with_text: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: colors.lightgrey,
    textAlign: 'center',
    marginVertical: 15,
  },
  bottom_part: {
    marginTop: 30,
    marginBottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
    alignItems: 'center',
  },
  question_text: {
    fontFamily: 'Poppins',
    lineHeight: 22,
    color: colors.lightgrey,
    fontSize: 14,
  },
  go_login: {
    fontFamily: 'Poppins',
    lineHeight: 22,
    fontSize: 14,
    color: colors.brown,
  },
  errorText: {
    color: colors.red,
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '400',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 21,
    height: 21,
    borderWidth: 1,
    borderColor: colors.brown,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 2, // Optional: for rounded corners
  }
});

export default RegisterScreen;
