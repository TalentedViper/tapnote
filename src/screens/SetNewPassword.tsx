import React from 'react';
import { View, Image, StyleSheet, Text, TextInput, Linking } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { passwordReset } from '../redux/actions/authAction';
import { colors, typography } from '../styles';
import { Checkbox } from 'react-native-paper';
import { BASE_URL } from '../config';

const left_arrow = require('../assets/images/left-arrow.png');

const SetNewPassword: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = React.useState<boolean>(false);
  const { email } = route.params;
  const validationSchema = Yup.object().shape({
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Confirm Password is required'),
    agree: Yup.boolean().oneOf([true], 'You must agree to the terms and policy.'),
  });

  const openBrowser = () => {
    const url = `${BASE_URL}/terms_conditions`;
    Linking.openURL(url).catch((err) => {
      console.error("Failed to open URL:", err);
    });
  }

  const resetPassword = async (values: any) => {
    const response = await (dispatch as any)(passwordReset(email, values.password, values.confirmPassword));
    if (response && response.success) {
      Toast.show({
        type: 'success',
        text1: response.message
      });
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } else {
      Toast.show({
        type: 'error',
        text1: response.message
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', marginTop: 18, justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Image source={left_arrow} />
        </TouchableOpacity>
        <Text style={[typography.h3, { color: colors.black, fontWeight: '500' }]}>Set New Password</Text>
        <Image source={left_arrow} style={{ opacity: 0 }} />
      </View>
      <Formik
        initialValues={{ password: '', confirmPassword: '', agree: false }}
        validationSchema={validationSchema}
        onSubmit={resetPassword}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          <>
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
            <View style={[styles.agree, { paddingVertical: 5 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                <Checkbox
                  color={colors.brown}
                  uncheckedColor={colors.brown}
                  status={isChecked ? 'checked' : 'unchecked'} onPress={() => {
                    const newValue = !isChecked;
                    setIsChecked(newValue);
                    setFieldValue('agree', newValue); // Update Formik state
                  }} />
                <Text style={[styles.understood, typography.baseline]}>I understood the </Text>
                <TouchableOpacity activeOpacity={0.7} onPress={openBrowser}>
                  <Text style={[styles.policy_text, typography.baseline]}>terms & policy.</Text>
                </TouchableOpacity>
              </View>
              {touched.agree && errors.agree && <Text style={styles.errorText}>{errors.agree}</Text>}
            </View>
            <View style={{ paddingHorizontal: 36 }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleSubmit()}
                style={{ backgroundColor: colors.brown, paddingVertical: 9, borderRadius: 5 }}
              >
                <Text style={[typography.h4, { color: colors.white, alignSelf: 'center' }]}>Send</Text>
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
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
  },
  input_form: {
    marginTop: 21,
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
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '400',
  },
  backText: {
    fontFamily: 'Poppins',
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
    marginVertical: 13,
    alignSelf: 'center',
    color: colors.secondary
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
});

export default SetNewPassword;
