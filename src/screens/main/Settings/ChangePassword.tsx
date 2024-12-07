import React, { useState } from 'react';
import {
  TextInput,
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { colors, rounded, typography } from '../../../styles';
import { useDispatch } from 'react-redux';
import { passwordChange } from '../../../redux/actions/authAction';

const left_arrow = require('../../../assets/images/left-arrow.png');

interface FormValues {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword: React.FC<{navigation : any}> = ({ navigation }) => {

  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Current Password is required'),
    newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('newPassword')], 'Passwords must match').required('Confirm Password is required')
  });

  const goBack = () => {
    navigation.navigate('Setting');
  };

  const formSubmit = async (values: FormValues) => {
    const result = await (dispatch as any)(passwordChange(values.password, values.newPassword));
    if(result.success){
      Toast.show({
        type: 'success',
        text1: 'Password changed successfully!'
      });
    }else{
      Toast.show({
        type: 'error',
        text1: 'Incorrect old password!',
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.title_part}>
        <TouchableOpacity
          onPress={goBack}
          style={styles.go_back}>
          <Image source={left_arrow} />
        </TouchableOpacity>
        <Text style={[styles.page_title, typography.h3, { color: colors.bandingblack }]}>Change Password</Text>
        <Text style={styles.heddin_text}></Text>
      </View>
      <ScrollView>
        <Formik
          initialValues={{ password: '', newPassword: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={formSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <View style={styles.input_form}>
                <Text style={[styles.input_label, typography.h4]}>Current Password</Text>
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
                <Text style={[styles.forgotText, {marginTop:8}]}>Forgot Password?</Text>
              </View>
              <View style={styles.input_form}>
                <Text style={[styles.input_label, typography.h4]}>New Password</Text>
                <TextInput
                  placeholder="*********"
                  keyboardAppearance="light"
                  secureTextEntry
                  placeholderTextColor={colors.place_text}
                  style={styles.input}
                  onChangeText={handleChange('newPassword')}
                  onBlur={handleBlur('newPassword')}
                  value={values.newPassword}
                />
                {touched.newPassword && errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
              </View>
              <View style={styles.input_form}>
                <Text style={[styles.input_label, typography.h4]}>Confirm New Password</Text>
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
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleSubmit()}
                style={[styles.buttonForm, {marginTop:50, backgroundColor: '#1D5C77' }]}
              >
                <FontAwesomeIcon icon={faSave} size={22} color={colors.white} />
                <Text style={[typography.h4, styles.btn_text]}>Save</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
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
    marginBottom: 21,
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
  buttonForm: {
    flexDirection:'row',
    justifyContent:'center',
    gap:10,
    alignItems:'center',
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
  input_form: {
    marginBottom: 21,
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
  errorText: {
    color: colors.red,
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '400',
  },
  forgotText:{
    fontFamily:'Poppins',
    fontWeight:'bold',
    fontSize:10,
    lineHeight:15,
  }
});

export default ChangePassword;
