import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
  Alert
} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
// import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
// import { TwitterAuthProvider } from '@react-native-twitter-signin/twitter-signin';
import { Formik } from 'formik';
import * as Yup from 'yup'; // Import Yup for validation
import TouchID from 'react-native-touch-id';
import Toast from 'react-native-toast-message';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityIndicator } from 'react-native-paper';
import ReactNativeBiometrics from 'react-native-biometrics';
import DeviceInfo from 'react-native-device-info';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEnvelope, faEye, faEyeSlash, faLock } from '@fortawesome/free-solid-svg-icons';
import { Checkbox } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';



import { RootState } from '../redux/reducers';
import { userLogin, socialLogin } from '../redux/actions/authAction';

import AuthButton from '../components/AuthButton';
import SocialButton from '../components/SocialButton';
import { colors, typography } from '../styles';
import { fetchLocation } from '../utils';

const logo = require('../assets/images/m-logo.png');
const mail = require('../assets/images/mail.png');
const lock = require('../assets/images/lock.png');
const google = require('../assets/images/google.png');
const facebook = require('../assets/images/facebook.png');
const twitter = require('../assets/images/twitter.png');
const fg_bg = require('../assets/images/fg-bg.png');
const disc = require('../assets/images/disc.png');
const finger = require('../assets/images/finger.png');

type NavigationProps = {
  navigation: StackNavigationProp<any, 'Login'>;
  route: RouteProp<any, 'Login'>;
};

const LoginScreen: React.FC<NavigationProps> = ({ navigation }) => {

  const GOOGLE_CLIENT_ID = process.env['GOOGLE_CLIENT_ID'];

  const [loading, setLoading] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [textColor, setTextColor] = useState(colors.grey);
  const [isSecurity, setIsSecurity] = useState(false);
  const [isVisible, setIsVisible] = useState('flex');
  const user = useSelector((state: RootState) => state.auth.user);
  const [state, setState] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [touchIdVisible, setTouchIdVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);

  const deviceModel = DeviceInfo.getModel();

  const dispatch = useDispatch();

  const handlePressIn = () => {
    setTextColor(colors.brown);
  };

  const handlePressOut = () => {
    setTextColor(colors.grey);
  };

  const handleTouchID = () => {
    const rnBiometrics = new ReactNativeBiometrics();

    // Check if the biometric sensor is available
    rnBiometrics.isSensorAvailable()
      .then((result) => {
        const { available, biometryType } = result;

        if (available) {
          const reason = 'To access your account';
          rnBiometrics.simplePrompt({ promptMessage: reason })
            .then((result) => {
              const { success } = result;

              if (success) {
                Alert.alert('Authenticated successfully');
                // Proceed with your app logic (e.g., navigate to a secure screen)
              } else {
                Alert.alert('Authentication failed');
              }
            })
            .catch(() => {
              Alert.alert('Authentication error');
            });
        } else {
          Alert.alert('Biometric authentication not available');
        }
      })
      .catch(() => {
        Alert.alert('Error checking biometric availability');
      });
  };

  // Yup validation schema
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const login = async (values: { email: string; password: string }) => {
    setLoading(true);
    const data = {
      email: values.email,
      password: values.password,
      device_type: Platform.OS === 'ios' ? 1 : 0,
      device_token: 'token_secret',
      device_model: deviceModel,
      country : country,
      location : state,
    }
    const result = await (dispatch as any)(userLogin(data));
    setLoading(false);
    if (result && result.success) {
      await AsyncStorage.setItem('password', values.password);
      Toast.show({
        type: 'success',
        text1: 'Login Success!',
        text2: 'Welcome to TapNote.'
      });
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } else if (result && !result.success) {
      Toast.show({
        type: 'info',
        text1: 'Code Verification',
        text2: 'Please verify your account before login!'
      });
      navigation.navigate('CodeVerify');
    } else {
      Toast.show({
        type: 'error',
        text1: 'Login Failed!',
        text2: 'Invalid Credentials.'
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
          country : country,
          location : state,
        }
        const result = await (dispatch as any)(socialLogin(userInfo, 1));
        setLoading(false);
        if (result && result.success) {
          Toast.show({
            type: 'success',
            text1: 'Login Success!',
            text2: 'Welcome to TapNote.'
          });
          if(!result.data.password){
            navigation.reset({
              index: 0,
              routes: [{ name: 'SetNewPassword', params: { email: result.data.email } }],
            });
          }else{
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

  // Facebook Login
  const handleFacebookLogin = async () => {
    // try {
    //   setLoading(true);
    //   const result = await LoginManager.logInWithPermissions([
    //     'public_profile',
    //     'email',
    //   ]);

    //   if (result.isCancelled) {
    //     throw new Error('User cancelled the login process');
    //   }

    //   const data = await AccessToken.getCurrentAccessToken();

    //   if (!data) {
    //     throw new Error('Something went wrong obtaining access token');
    //   }

    //   // Handle successful login
    //   console.log('Facebook Sign-In Success:', data);
    //   // navigation.navigate('Home');

    // } catch (error: any) {
    //   Alert.alert('Facebook Sign-In Error', error.message);
    // } finally {
    //   setLoading(false);
    // }
  };

  // Twitter Login
  const handleTwitterLogin = async () => {
    console.log("twitter login");
    // try {
    //   setLoading(true);
    //   await TwitterAuthProvider.init({
    //     consumerKey: 'YOUR_TWITTER_CONSUMER_KEY',
    //     consumerSecret: 'YOUR_TWITTER_CONSUMER_SECRET',
    //   });

    //   const { authToken, authTokenSecret } = await TwitterAuthProvider.login();

    //   // Handle successful login
    //   console.log('Twitter Sign-In Success:', { authToken, authTokenSecret });
    //   navigation.navigate('Home');

    // } catch (error) {
    //   Alert.alert('Twitter Sign-In Error', error.message);
    // } finally {
    //   setLoading(false);
    // }
  };

  const configureGoogleSign = () => {
    GoogleSignin.configure({
      webClientId: GOOGLE_CLIENT_ID,
      offlineAccess: true,
    });
  };

  const rememberPassword = async (setFieldValue:any) => {
    setChecked(!isChecked);
    const userInfo = await AsyncStorage.getItem('user');
    const password = await AsyncStorage.getItem('password');
    if(userInfo && JSON.parse(userInfo).is_remember === 1 && password){
      if (!isChecked) {
        setFieldValue('email', JSON.parse(userInfo).email);
        setFieldValue('password', password);
      } else {
        setFieldValue('email', '');
        setFieldValue('password', '');
      }
    }
    
  }

  useEffect(() => {
    const getlocation = async() => {
      const fetchedLocation = await fetchLocation();
      if (fetchedLocation && typeof fetchedLocation !== 'boolean') {
        setCountry(fetchedLocation.country);
        setState(fetchedLocation.state)
      } else {
        console.error('Invalid location or permission denied');
      }
    }
    getlocation();
  }, [])

  useEffect(() => {
    configureGoogleSign();
    const getlocation = async() => {
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

  useEffect(() => {
    const userCheck = async () => {
        try {
          const userInfo = await AsyncStorage.getItem('user');
          if (userInfo === null || JSON.parse(userInfo).is_touch_id === 0) {
            setTouchIdVisible(false);
          } else {
            setTouchIdVisible(true);
          }
        } catch (error) {
            console.error('Error checking or storing first launch:', error);
        }
    };
    userCheck();
}, []);

useEffect(() => {
  const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardHeight(-event.endCoordinates.height);
  });
  
  const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
  });

  return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
  };
}, []);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {loading && (
        <ActivityIndicator style={{ height: '100%', position: 'absolute', zIndex: 99, alignSelf: 'center', justifyContent: 'center' }} size="large" color={colors.brown} />
      )}
      <ScrollView style={{ paddingHorizontal: 53 }}>
        <Image source={logo} style={{ alignSelf: 'center' }} />
        <View style={[styles.btn_form, { alignSelf: 'center' }]}>
          <TouchableOpacity
            style={styles.btnLink}
            onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.btn_login, typography.h4]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnLink, { borderBottomColor: 'transparent' }]}
            activeOpacity={1}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.btn_register, typography.h4, { color: textColor }]}>Register</Text>
          </TouchableOpacity>
        </View>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={login}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <View>
              <View style={{ marginBottom: 40 }}>
                <View style={[styles.input_group, { marginBottom: 10 }]}>
                  {/* <Image source={mail} /> */}
                  <FontAwesomeIcon icon={faEnvelope} size={20} color='#A6A6A6' />
                  <TextInput
                    placeholder="Email Address"
                    placeholderTextColor={colors.grey}
                    style={[styles.input, typography.h4]}
                    keyboardType="email-address"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                  />
                </View>
                {errors.email && touched.email && (
                  <Text style={styles.error}>{errors.email}</Text>
                )}
              </View>
              <View style={{ marginBottom: 35 }}>
                <View style={[styles.input_group, { marginBottom: 10 }]}>
                  {/* <Image source={lock} /> */}
                  <FontAwesomeIcon icon={faLock} size={20} color='#A6A6A6' />
                  <TextInput
                    style={[styles.input, typography.h4]}
                    placeholderTextColor={colors.grey}
                    placeholder="Password"
                    secureTextEntry={isSecurity ? false : true}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                  />
                  <TouchableOpacity
                    onPress={() => setIsSecurity(!isSecurity)}
                    activeOpacity={0.8}>
                    {isSecurity ? (
                      <FontAwesomeIcon icon={faEye} color={colors.grey} size={20} />
                    ) : (
                      <FontAwesomeIcon icon={faEyeSlash} color={colors.grey} size={20} />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.password && touched.password && (
                  <Text style={styles.error}>{errors.password}</Text>
                )}
              </View>
              <View style={[styles.flex, styles.space_between, { marginBottom: 45 }]}>
                <View style={[styles.flex, {marginLeft:-10}]}>
                  <Checkbox
                    uncheckedColor={colors.brown}
                    color={colors.brown}
                    status={isChecked? 'checked' : 'unchecked'}
                    onPress={() => rememberPassword(setFieldValue)}
                  />
                  <Text style={[typography.baseline, { fontWeight: '400', color: '#6B5E5E' }]}>Remember Password</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text style={[typography.baseline, { fontWeight: '400', color: colors.brown }]}>Forget password</Text>
                </TouchableOpacity>
              </View>
              <AuthButton
                title="Login"
                onPress={handleSubmit}
              />
            </View>
          )}
        </Formik>
        <Text style={[typography.h5, { color: '#747070', marginTop: 12, marginBottom: 12, alignSelf: 'center' }]}>or connect with</Text>
        <View style={styles.social_btn_form}>
          <SocialButton onPress={handleGoogleLogin} img={google} />
          <SocialButton onPress={handleFacebookLogin} img={facebook} />
          {/* <SocialButton onPress={handleTwitterLogin} img={twitter} /> */}
        </View>
        <Image source={disc} style={{ marginTop: 10, alignSelf: 'center' }} />
      </ScrollView>
      <View
        style={[styles.fixedElement, { marginBottom: keyboardHeight }]}
      >
        <ImageBackground source={fg_bg}
          resizeMode='cover'
          style={{ height: 180, bottom: 0 }}
        >
          {touchIdVisible && (
            <View>
              <TouchableOpacity
                style={styles.touch_btn}
                activeOpacity={0.9}
                onPress={handleTouchID}
              >
                <Image
                  source={finger}
                />
              </TouchableOpacity>
              <Text style={styles.touch_id_text}>Login with touch ID</Text>
            </View>
          )}
        </ImageBackground>
      </View>
    </KeyboardAvoidingView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  btn_form: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingHorizontal: 5,
    marginBottom: 25,
  },
  input_group: {
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    gap: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  space_between: {
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    marginBottom: 0,
    color: colors.grey,
    padding: 0,
    borderRadius: 0,
    fontWeight: '500',
  },
  fixedElement: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  error: {
    fontSize: 12,
    color: colors.red,
    marginBottom: 10,
  },
  link: {
    color: colors.brown,
    fontSize: 14,
  },
  btn_login: {
    color: colors.brown,
    fontWeight: '500',
  },
  btn_register: {
    fontWeight: '500',
  },
  social_btn_form: {
    marginHorizontal: 'auto',
    flexDirection: 'row',
    gap: 10,
  },
  touch_btn: {
    marginTop: 15,
    marginBottom: 15,
    flexDirection: 'row',
    margin: 'auto',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.white,
    borderWidth: 1,
    width: 68,
    height: 70,
    borderRadius: 12,
    backgroundColor: colors.brown,
  },
  touch_id_text: {
    color: colors.white,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Roboto',
    lineHeight: 24,
  },
  btnLink: {
    paddingBottom: 5,
    marginHorizontal: 11,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.brown,
    borderWidth: 2,
  },
});

export default LoginScreen;
