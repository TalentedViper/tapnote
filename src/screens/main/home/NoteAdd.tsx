import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../../../config';
import { RootState } from '../../../redux/reducers';
import { colors, rounded, typography } from '../../../styles';
import { TextInput } from 'react-native-gesture-handler';
import { addNote } from '../../../redux/actions/home/homeAction';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { bool } from 'yup';

const { height } = Dimensions.get('window');

const left_arrow = require('../../../assets/images/left-arrow.png');
const morevert = require('../../../assets/images/morevert.png');
const note = require('../../../assets/images/note.png');


type NavigationProps = {
  navigation: StackNavigationProp<any, 'NoteAdd'>;
  route: any;
};

const NoteAdd: React.FC<NavigationProps> = ({ navigation }) => {

  const dispatch = useDispatch();
  const recordDetail = useSelector((state: RootState) => state.home.recordingDetail);
  const userInfo = useSelector((state: RootState) => state.auth.user);
  const [inputValue, setInputValue] = useState('');

  const goBack = () => {
    navigation.goBack();
  };

  const handleChange = (text: string) => {
    setInputValue(text);
  };

  const sendNote = async () => {
    if (inputValue !== '') {
      await (dispatch as any)(addNote(recordDetail?.id, inputValue));
      setInputValue('');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.top_part}>
        <View style={styles.page_title_part}>
          <TouchableOpacity
            onPress={goBack}
            style={styles.go_back}>
            <Image source={left_arrow} />
          </TouchableOpacity>
          <View style={styles.middle_part}>
            <Image source={note} style={styles.small_icon} />
            <Text style={[styles.page_title, typography.h3, { color: colors.bandingblack }]}>Notes</Text>
          </View>
          <TouchableOpacity activeOpacity={0}
            style={[styles.three_dot, { opacity: 0 }]}>
            <Image source={morevert} style={styles.small_icon} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.page_title, typography.h5, { color: colors.bandingblack, marginBottom: 10 }]}>{recordDetail?.recording_name}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 15 }}>
          <Image
            source={{ uri: BASE_URL + '/uploads/' + recordDetail.user_detail?.profile_image }}
            style={{ width: 40, height: 40, borderRadius: 30, borderWidth: 1, borderColor: colors.brown }}
          />
          <Text style={typography.h4}>Created by 
            <Text style={{color:colors.lightgreen, fontWeight:'bold'}}>&nbsp;
              {recordDetail.user_detail?.first_name}
            </Text>
          </Text>
        </View>
        <ScrollView>
          {recordDetail?.notes &&
            recordDetail?.notes.map((item: any, index: number) => {
              return (
                <View key={index} style={{
                  flexDirection: userInfo?.id !== item.user.id ? 'row' : 'row-reverse',
                  marginBottom: 20,
                  gap: 10,
                }}>
                  {userInfo?.id === item.user.id ? (
                    <>
                      <Image
                        source={{ uri: BASE_URL + '/uploads/' + item.user.profile_image }}
                        style={{ width: 30, height: 30, borderRadius: 30 }}
                      />
                      <View
                        style={{
                          backgroundColor: colors.lightgray,
                          borderTopEndRadius: 10,
                          borderBottomLeftRadius: 10,
                          paddingHorizontal: 10,
                        }}
                      >
                        <Text style={[typography.h5]}>{item.note}</Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <Image
                        source={{ uri: BASE_URL + '/uploads/' + item.user.profile_image }}
                        style={{ width: 30, height: 30, borderRadius: 30 }}
                      />
                      <View
                        style={{
                          backgroundColor: colors.lightgray,
                          borderTopEndRadius: 10,
                          borderBottomLeftRadius: 10,
                          paddingHorizontal: 10,
                        }}
                      >
                        <Text style={[typography.h5]}>{item.note}</Text>
                      </View>

                    </>
                  )}
                </View>
              );
            })}
        </ScrollView>
      </View>
      <View style={styles.inputForm}>
        <TextInput
          style={[styles.search_input, { height: 50 }]}
          value={inputValue}
          onChangeText={handleChange}
          placeholderTextColor={colors.gray}
          placeholder="Type Note..."
          multiline={true}
        />
        <TouchableOpacity
          onPress={sendNote}
          style={{ flexDirection: 'row', gap: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.green, paddingHorizontal: 20, paddingVertical: 7, borderRadius: 50 }}>
          <FontAwesomeIcon icon={faSave} size={20} color={colors.white} />
          <Text style={[typography.h5, { color: colors.white }]}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  play_part: {
    position: 'absolute',
    bottom: 0,
    height: 250,
    width: '100%',
    backgroundColor: colors.brown,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  artist: {
    fontSize: 18,
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    width: '100%',
  },

  container: {
    position: 'relative',
    flex: 1,
    height: height,
    backgroundColor: colors.background,
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 20,
  },
  top_part: {
    paddingHorizontal: 20,
    flex: 1,
  },
  page_title_part: {
    flexDirection: 'row',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 19,
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  go_back: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  three_dot: {
    width: 22,
    height: 22,
  },
  small_icon: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middle_part: {
    flexDirection: 'row',
    gap: 9,
    alignItems: 'center',
  },
  page_title: {
    fontWeight: 'bold',
    alignSelf: 'center',
    color: colors.black,
  },
  record_title: {
    alignSelf: 'center',
    color: '#1D5C77',
    fontWeight: '500',
    marginBottom: 15,
  },
  btn_group: {
    marginBottom: 18,
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  unselect_btn: {
    flexDirection: 'row',
    paddingHorizontal: 35,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    flex: 1,
    gap: 10,
    marginHorizontal: 7,
    borderWidth: 1,
    borderColor: colors.brown,
  },
  select_btn: {
    backgroundColor: colors.brown,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 35,
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 7,
    borderWidth: 1,
    borderColor: colors.brown,
  },
  select_btn_text: {
    color: colors.white,
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 27,
  },
  unselect_btn_text: {
    color: colors.bandingblack,
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 27,
  },
  record__info: {
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: colors.white,
    flexDirection: 'column',
    gap: 7,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
      },
      android: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 0.5,
        elevation: 4,
      },
    }),
  },
  record_info_top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sub_info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  record_info_bottom: {
    justifyContent: 'center',
  },
  by_creator: {
    alignSelf: 'center',
    color: colors.bandingblack,
    fontWeight: '500',
  },
  transcription_part: {
    // height: 330,
    flex: 1,
    overflow: 'hidden',
    borderRadius: 10,
    backgroundColor: colors.white,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
      },
      android: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 0.5,
        elevation: 4,
      },
    }),
  },
  trans_title_part: {
    paddingVertical: 6,
    backgroundColor: colors.brown,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  trans_title: {
    fontWeight: 'bold',
    color: colors.white,
  },
  trans_main: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    marginBottom: 10,
  },
  transcription: {
    fontWeight: '500',
    color: '#333333',
    marginBottom: 15,
  },
  h_light_item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: colors.white,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
      },
      android: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 0.5,
        elevation: 4,
      },
    }),
  },
  item_left_part: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  h_title: {
    color: '#1D5C77',
    fontWeight: '500',
    marginBottom: 5,
  },
  h_start_time: {
    color: '#666666',
    fontWeight: '500',
  },
  h_created_time: {
    color: '#666666',
    fontWeight: '500',
  },
  timeText: {
    fontFamily: 'Poppins',
    color: colors.white,
  },
  inputForm: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 10,
    paddingVertical: 0,
    backgroundColor: colors.white,
    borderRadius: rounded.xl,
    borderColor: '#666666',
    borderWidth: 0.5,
    marginBottom: 20,
  },
  search_input: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 18,
    lineHeight: 27,
  },
});

export default NoteAdd;
