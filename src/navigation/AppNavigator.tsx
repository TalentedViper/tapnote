import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BackHandler, Alert } from 'react-native'
import SplashScreen from '../screens/SplashScreen';
import IntroScreen from '../screens/IntroScreen';
import LoginScreen from '../screens/LoginScreen';
import ForgotPassword from '../screens/ForgotPassword';
import EnterVerifyCode from '../screens/EnterVerifyCode';
import SetNewPassword from '../screens/SetNewPassword';
import RegisterScreen from '../screens/RegisterScreen';
import CodeVerifyScreen from '../screens/CodeVerifyScreen';
import CodeVerifySuccessScreen from '../screens/CodeVerifySuccessScreen';
import LocationScreen from '../screens/LocationScreen';
import NotificationScreen from '../screens/NotificationScreen';
import EditProfile from '../screens/main/Settings/EditProfile';
import Subscription from '../screens/main/Settings/Subscription';
import Security from '../screens/main/Settings/Security';
import ChangePassword from '../screens/main/Settings/ChangePassword';
import HomeScreen from '../screens/main/home/Home';
import Folder from '../screens/main/folder/Folder';
import FolderDetails from '../screens/main/folder/FolderDetails';
import Note from '../screens/main/note/Note';
import Setting from '../screens/main/Settings/Setting';
import Recording from '../screens/main/home/Recording';
import NoteAdd from '../screens/main/home/NoteAdd';
import ShareRecord from '../screens/main/home/ShareRecord';
import AppCloseModal from '../screens/AppCloseModal';
import UserNotification from '../screens/main/usernotification';

import NavBar from './NavBar';

const Stack = createStackNavigator();

import { closeModalShow, closeModalHide, getToken, getUserData } from '../redux/actions/authAction';
import { useDispatch } from 'react-redux';



// Screens where NavBar should be hidden
const hideNavBarScreens: string[] = [
  'Splash',
  'Intro',
  'Notification',
  'Login',
  'ForgotPassword',
  'EnterVerifyCode',
  'SetNewPassword',
  'Register',
  'CodeVerify',
  'CodeVerifySuccess',
  'Location',
  'Recording',
  'NoteAdd',
  'ShareRecord',
  'UserNotification',
];

const AppNavigator: React.FC = () => {

  const [showNavBar, setShowNavBar] = useState<boolean>(false);
  const [currentScreen, setCurrentScreen] = useState<string>('');
  const [initialRoute, setInitialRoute] = useState('Splash');

  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef<string | undefined>(undefined);

  const dispatch = useDispatch();

  useEffect(() => {
    // console.log("navigationRef", navigationRef);
    const fetchData = async () => {
      try {
        const userInfo = await getUserData();
        if (userInfo) {
          setInitialRoute('Home');
        } else {
          setInitialRoute('Splash');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setInitialRoute('Splash'); // Fallback to Splash on error
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (navigationRef.isReady() && navigationRef.canGoBack()) {
        navigationRef.goBack(); // Navigate to the previous screen
        return true; // Prevent default behavior
      } else {
        if (navigationRef?.getCurrentRoute()?.name === 'Splash') {
          return true;
        } else {
          dispatch(closeModalShow());
        }

        // Alert.alert('Exit App', 'Do you want to close the app?', [
        //   { text: 'Cancel', style: 'cancel' },
        //   { text: 'Exit', onPress: () => BackHandler.exitApp() },
        // ]);
        return true; // Prevent default behavior
      }
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove(); // Clean up listener
  }, [navigationRef]);


  const handleStateChange = useCallback(async () => {

    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef?.getCurrentRoute()?.name;
    // if DEV show navigation screens
    // if (__DEV__) {
    //   console.info(
    //     '[navigation]',
    //     `${previousRouteName} -> ${currentRouteName}`,
    //   );
    // }

    if (previousRouteName !== currentRouteName) {
      routeNameRef.current = currentRouteName;
    }

    setCurrentScreen(currentRouteName as any);
    setShowNavBar(!hideNavBarScreens.includes(currentRouteName as any));

  }, [routeNameRef, navigationRef]);

  const handleReady = useCallback(() => {
    routeNameRef.current = navigationRef?.getCurrentRoute()?.name;
  }, [routeNameRef, navigationRef]);

  return (
    <>
      <AppCloseModal />
      <NavigationContainer
        ref={navigationRef}
        onReady={handleReady}
        onStateChange={handleStateChange}
      >
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Intro" component={IntroScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="EnterVerifyCode" component={EnterVerifyCode} />
          <Stack.Screen name="SetNewPassword" component={SetNewPassword} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="CodeVerify" component={CodeVerifyScreen} />
          <Stack.Screen name="CodeVerifySuccess" component={CodeVerifySuccessScreen} />
          <Stack.Screen name="Location" component={LocationScreen} />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Folder" component={Folder} />
          <Stack.Screen name="FolderDetails" component={FolderDetails} />
          <Stack.Screen name="Note" component={Note} />
          <Stack.Screen name="Setting" component={Setting} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="Subscription" component={Subscription} />
          <Stack.Screen name="Security" component={Security} />
          <Stack.Screen name="Recording" component={Recording} />
          <Stack.Screen name="NoteAdd" component={NoteAdd} />
          <Stack.Screen name="ShareRecord" component={ShareRecord} />
          <Stack.Screen name="UserNotification" component={UserNotification} />
        </Stack.Navigator>
        {showNavBar && <NavBar screen={currentScreen} />}
      </NavigationContainer>
    </>
  );
};

export default AppNavigator;
