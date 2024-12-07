import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar, faPencil, faCameraRetro } from '@fortawesome/free-solid-svg-icons';
import { profileUpdate } from '../../../redux/actions/authAction';
import { colors, commonStyles, rounded, typography } from '../../../styles';
import { BASE_URL } from '../../../config';
import { RootState } from '../../../redux/reducers';


const left_arrow = require('../../../assets/images/left-arrow.png');


type NavigationProps = {
  navigation: StackNavigationProp<any, 'EditProfile'>;
};

const EditProfile: React.FC<NavigationProps> = ({ navigation }) => {
  const userInfo = useSelector((state: RootState) => state.auth.user);
  const [imageUri, setImageUri] = useState('');
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const goBack = () => {
    navigation.navigate('Setting');
  };

  const updateProfile = async (values: any) => {
    const data = {
      first_name: values.first_name,
      last_name: values.last_name,
      phone: values.phone,
      date_of_birth: values.date_of_birth,
      short_bio: values.short_bio,
      profile_image: imageUri
    }
    const result = await (dispatch as any)(profileUpdate(data));
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

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    phone: Yup.string().required('Phone number is required'),
    date_of_birth: Yup.string().required('Date of Birth is required'),
    // email_address: Yup.string().email('Invalid email').required('Email is required'),
    // short_bio: Yup.string().max(150, 'Short bio cannot exceed 150 characters'),
  });

  const handleImageChange = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const newImageUri = response.assets[0].uri;
        setImageUri(newImageUri ?? ''); // Update the image URI to display the selected image
      }
    });
  };

  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      saveToPhotos: true,
    };

    launchCamera(options as any, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorMessage) {
        console.error('Camera error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        // Safe to access response.assets[0].uri
        const newImageUri = response.assets[0].uri;
        console.log('Image URI: ', newImageUri);
        setImageUri(newImageUri ?? '');
        // Do something with the captured image URI (e.g., update profile image)
      } else {
        console.error('No image selected');
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.title_part}>
        <TouchableOpacity
          onPress={goBack}
          style={styles.go_back}>
          <Image source={left_arrow} />
        </TouchableOpacity>
        <Text style={[styles.title, typography.h3, { fontWeight: 'bold', color: colors.bandingblack }]}>Edit Profile</Text>
        <Text style={styles.heddin_text}>text</Text>
      </View>
      <ScrollView>
        <View style={styles.avatar_part}>
          {userInfo && (
            <TouchableOpacity onPress={handleImageChange}>
              {imageUri !== '' ? (
                <Image source={{ uri: imageUri }} style={[styles.avatar, { borderRadius: 100, borderWidth: 1, borderColor: colors.brown }]} />
              ) : (
                <Image source={{ uri: BASE_URL + '/uploads/' + userInfo.profile_image }} style={[styles.avatar, { borderRadius: 100, borderWidth: 1, borderColor: colors.brown }]} />
              )}
            </TouchableOpacity>
          )}
          {userInfo && userInfo?.subscription_date && (
          <FontAwesomeIcon icon={faStar} color={colors.yellow} size={35} style={styles.star} />
          )}
          <View style={styles.avatar_change}>
            <TouchableOpacity
              onPress={openCamera}
              style={styles.camera_view}>
              <FontAwesomeIcon icon={faCameraRetro} size={25} color={colors.brown} style={{ alignSelf: 'center' }} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={[typography.h7, { color: colors.bandingblack }]}>Change Profile Image</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Formik
          initialValues={{
            first_name: userInfo?.first_name || '',
            last_name: userInfo?.last_name || '',
            phone: userInfo?.phone || '',
            date_of_birth: userInfo?.date_of_birth || '',
            // email_address: userInfo?.email_address || '',
            short_bio: userInfo?.short_bio || '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            updateProfile(values);
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <View style={styles.form_group}>
              <View style={styles.input_part}>
                <View style={styles.label_part}>
                  <FontAwesomeIcon icon={faPencil} color={colors.secondary} size={15} />
                  <Text>First Name</Text>
                </View>
                <TextInput
                  value={values.first_name}
                  onChangeText={handleChange('first_name')}
                  onBlur={handleBlur('first_name')}
                  placeholderTextColor={colors.grey}
                  style={styles.input}
                />
                {errors.first_name && touched.first_name && typeof errors.first_name === 'string' ? (
                  <Text style={styles.errorText}>{errors.first_name}</Text>
                ) : null}
              </View>

              {/* Repeat similarly for other fields */}

              <View style={styles.input_part}>
                <View style={styles.label_part}>
                  <FontAwesomeIcon icon={faPencil} color={colors.secondary} size={15} />
                  <Text>Last Name</Text>
                </View>
                <TextInput
                  value={values.last_name}
                  onChangeText={handleChange('last_name')}
                  onBlur={handleBlur('last_name')}
                  placeholderTextColor={colors.grey}
                  style={styles.input}
                />
                {errors.last_name && touched.last_name && typeof errors.last_name === 'string' ? (
                  <Text style={styles.errorText}>{errors.last_name}</Text>
                ) : null}
              </View>

              <View style={styles.input_part}>
                <View style={styles.label_part}>
                  <FontAwesomeIcon icon={faPencil} color={colors.secondary} size={15} />
                  <Text>Phone Number</Text>
                </View>
                <TextInput
                  value={values.phone}
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  placeholderTextColor={colors.grey}
                  style={styles.input}
                />
                {errors.phone && touched.phone && typeof errors.phone === 'string' ? (
                  <Text style={styles.errorText}>{errors.phone}</Text>
                ) : null}
              </View>

              <View style={styles.input_part}>
                <View style={styles.label_part}>
                  <FontAwesomeIcon icon={faPencil} color={colors.secondary} size={15} />
                  <Text>Date of Birth</Text>
                </View>

                <TouchableOpacity onPressOut={() => setOpen(true)}>
                  <TextInput
                    value={values.date_of_birth ? new Date(values.date_of_birth).toLocaleDateString() : ''}
                    onChangeText={handleChange('date_of_birth')}
                    onBlur={handleBlur('date_of_birth')}
                    placeholderTextColor={colors.grey}
                    style={styles.input}
                    editable={false}
                  />
                </TouchableOpacity>
                {errors.date_of_birth && touched.date_of_birth && typeof errors.date_of_birth === 'string' ? (
                  <Text style={styles.errorText}>{errors.date_of_birth}</Text>
                ) : null}
              </View>

              {open && (
                <DateTimePicker
                  mode="date"
                  display="default"
                  value={date}
                  maximumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    setOpen(false); // Close the picker after selection
                    if (event.type === 'set' && selectedDate) {
                      setDate(selectedDate);
                      const date = new Date(selectedDate);
                      setFieldValue('date_of_birth', `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${(date.getDate() + 1).toString().padStart(2, '0')}`);
                    }
                  }}
                />
              )}

              {/* <View style={styles.input_part}>
                <View style={styles.label_part}>
                  <FontAwesomeIcon icon={faPencil} color={colors.secondary} size={15} />
                  <Text>Email Address</Text>
                </View>
                <TextInput
                  value={values.email_address}
                  onChangeText={handleChange('email_address')}
                  onBlur={handleBlur('email_address')}
                  placeholderTextColor={colors.grey}
                  style={styles.input}
                />
                {errors.email_address && touched.email_address ? <Text style={styles.errorText}>{errors.email_address}</Text> : null}
              </View> */}

              <View style={styles.input_part}>
                <View style={styles.label_part}>
                  <FontAwesomeIcon icon={faPencil} color={colors.secondary} size={15} />
                  <Text>Short Bio</Text>
                </View>
                <TextInput
                  editable
                  multiline
                  numberOfLines={4}
                  value={values.short_bio}
                  onChangeText={handleChange('short_bio')}
                  onBlur={handleBlur('short_bio')}
                  placeholderTextColor={colors.grey}
                  style={styles.input}
                />
                {errors.short_bio && touched.short_bio && typeof errors.short_bio === 'string' ? (
                  <Text style={styles.errorText}>{errors.short_bio}</Text>
                ) : null}
              </View>

              <View style={[styles.update_btn_wraper]}>
                <Button
                  style={[styles.update_button, commonStyles.box_show]}
                  mode="contained"
                  contentStyle={[commonStyles.box_show]}
                  onPress={() => handleSubmit()}
                  buttonColor="#1D5C77"
                >
                  <Text style={typography.h4}>Edit Profile</Text>
                </Button>
              </View>
            </View>
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
    marginBottom: 25,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  go_back: {
    width: 22,
    height: 12,
    left: 0,
  },
  title: {
    fontWeight: 'bold',
    alignSelf: 'center',
    color: colors.black,
  },
  heddin_text: {
    width: 22,
    opacity: 0,
  },
  avatar_part: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: 22,
  },
  avatar: {
    width: 156,
    height: 156,
  },
  star: {
    position: 'absolute',
    bottom: -1,
    left: 8,
    width: 39,
    height: 39,
  },
  avatar_change: {
    position: 'absolute',
    width: 132,
    right: -38,
    bottom: -31,
    flexDirection: 'column',
    gap: 8,
    textAlign: 'center',
  },
  camera_view: {
    borderColor: colors.brown,
    borderWidth: 0.5,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    width: 60,
    height: 60,
    padding: 14,
    borderRadius: rounded.xl,
  },
  carera: {
    width: 32,
    height: 32,
  },
  form_group: {
    flexDirection: 'column',
  },
  input_part: {
    marginBottom: 16,
  },
  label_part: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  input: {
    padding: 20,
    backgroundColor: colors.white,
    borderColor: '#E6E6E6',
    color: '#5B5356',
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 16,
    fontWeight: '500',
  },
  update_btn_wraper: {
    marginBottom: 50,
    paddingHorizontal: 40,
  },
  update_button: {
    width: '100%',
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
        shadowOffset: { width: 5, height: 5 },
        shadowRadius: 3,
        elevation: 5,
      },
    }),
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 10
  },
});

export default EditProfile;
