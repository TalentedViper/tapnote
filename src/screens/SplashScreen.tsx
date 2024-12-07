import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../styles';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/actions/authAction';

const logo = require('../assets/images/l-logo.png');

type SplashScreenProps = {
    navigation: StackNavigationProp<any, any>;
};

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {

    const dispatch = useDispatch();

    useEffect(() => {
        const checkAndStoreFirstLaunch = async () => {
            try {
                const hasLaunched = await AsyncStorage.getItem('isFirstLaunch');
                if (hasLaunched === null) {

                    await AsyncStorage.setItem('isFirstLaunch', 'true');

                    const timer = setTimeout(() => {
                        navigation.replace('Intro');
                    }, 1000);

                    return () => clearTimeout(timer);

                } else {
                    // App has been launched before
                    const userInfo = await AsyncStorage.getItem('user');
                    if (userInfo === null || !JSON.parse(userInfo).token) {
                        const timer = setTimeout(() => {
                            navigation.replace('Login');
                        }, 1000);
                        return () => clearTimeout(timer);
                    } 
                    else {
                        (dispatch as any)(setUserData(JSON.parse(userInfo)));
                        const timer = setTimeout(() => {
                            navigation.replace('Home');
                        }, 1000);
                        return () => clearTimeout(timer);
                    }
                }
            } catch (error) {
                console.error('Error checking or storing first launch:', error);
            }
        };

        checkAndStoreFirstLaunch();


    }, []);

    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.logo} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        marginTop: -30,
    },
});

export default SplashScreen;
