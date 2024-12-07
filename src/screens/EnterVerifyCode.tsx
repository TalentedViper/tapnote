import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, resendCode } from '../redux/actions/authAction';
import { RootState } from '../redux/reducers';
import ScreenButton from '../components/ScreenButton';
import { colors, typography } from '../styles';

const left_arrow = require('../assets/images/left-arrow.png');

const EnterVerifyCode: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const { email } = route.params;
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
        return true;
    };

    const codeVerify = async () => {
        if (validateOtp()) {
            const user = { email, otp: otp.join('') };
            const result = await (dispatch as any)(verifyOtp(user));
            if (result && result.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Code Verification Success!',
                });
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'SetNewPassword', params: { email } }]
                })
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Code Verification Error!',
                });
            }
        }
    };

    const resendOtp = async () => {
        const result = await (dispatch as any)(resendCode(email));
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
            <View>
                <View style={{ flexDirection: 'row', marginTop: 18, marginBottom: 53, justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={left_arrow} />
                    </TouchableOpacity>
                    <Text style={[typography.h3, { color: colors.black, fontWeight: '500' }]}>Enter Verification Code</Text>
                    <Image source={left_arrow} style={{ opacity: 0 }} />
                </View>
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
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    <Text style={[typography.h6, { color: colors.secondary }]}>If you didn’t receive a code, </Text>
                    <TouchableOpacity activeOpacity={0.7} onPress={resendOtp}>
                        <Text style={[typography.h6, styles.center, { color: colors.brown }]}>
                            Resend
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ paddingHorizontal: 34 }}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={codeVerify}
                        style={{ backgroundColor: colors.brown, paddingVertical: 9, borderRadius: 5 }}
                    >
                        <Text style={[typography.h4, { color: colors.white, alignSelf: 'center' }]}>Send</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        width: 63,
        height: 63,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#666666',
        padding: 10,
        textAlign: 'center',
        color: '#444444',
        fontSize: 30,
        lineHeight: 40,
        fontWeight: '700',
        fontFamily: 'Poppins'
    },
    center: {
        textAlign: 'center',
    },
});

export default EnterVerifyCode;