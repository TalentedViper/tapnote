import React, { useState } from 'react';
import {View, Image, StyleSheet, Text, TextInput, ToastAndroid} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import {colors, typography} from '../styles';

import { passwordForgot } from '../redux/actions/authAction';

const left_arrow = require('../assets/images/left-arrow.png');

const ForgotPassword: React.FC<{navigation : any}> = ({ navigation }) => {

  const dispatch = useDispatch()

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required')
  });

  const forgotPassword = async ( values : any) => {
    const email = values.email;
    const response = await (dispatch as any)(passwordForgot(email));
    if(response.success){
      Toast.show({
        type : 'success',
        text1 : response.message,
      })
      ToastAndroid.show( `OTP : ${(response.data.otp).toString()}`, ToastAndroid.SHORT);
      navigation.navigate('EnterVerifyCode', {email});
    }
    else{
      Toast.show({
        type : 'error',
        text1 : response.message,
      })
    }
    // navigation.navigate('SetNewPassword');
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection:'row', marginTop:18, marginBottom:53, justifyContent:'space-between', alignItems:'center'}}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Image source={left_arrow}/>
        </TouchableOpacity>
        <Text style={[typography.h3, {color:colors.black, fontWeight:'500'}]}>Forget Password</Text>
        <Image source={left_arrow} style={{opacity:0}} />
      </View>
      <Formik
          initialValues={{ email: ''}}
          validationSchema={validationSchema}
          onSubmit={forgotPassword}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <View style={styles.input_form}>
                <Text style={[styles.input_label, typography.h4]}>Enter Email Address</Text>
                <TextInput
                  placeholder="ex: johnsmith@gmail.com"
                  keyboardAppearance="light"
                  placeholderTextColor={colors.place_text}
                  style={styles.input}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                />
                {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>
              <View style={{paddingHorizontal:34}}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Login')}
                  style={{paddingVertical:10}}
                >
                  <Text style={styles.backText}>Back to sign in</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleSubmit()}
                  style={{backgroundColor:colors.brown, paddingVertical:9, borderRadius:5}}
                >
                  <Text style={[typography.h4, {color:colors.white, alignSelf:'center'}]}>Send</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    paddingHorizontal:20,
    backgroundColor:colors.background,
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
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    zIndex: -33,
  },
  errorText: {
    color: colors.red,
    // marginLeft:10,
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '400',
  },
  backText:{
    fontFamily: 'Poppins',
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
    marginVertical:13, 
    alignSelf:'center', 
    color:colors.secondary
  }
});

export default ForgotPassword;
