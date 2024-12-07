import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
import { ActivityIndicator } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { RootState } from '../../../redux/reducers';

import { modalShow } from '../../../redux/actions/filterModalActions';
import { getAllRecording, getRecordingDetails } from '../../../redux/actions/home/homeAction';
import UserInfoPart from '../../../components/UserInfoPart';
import SearchForm from '../../../components/SearchForm';
import { colors, typography } from '../../../styles';
import { filterByKey, formatDateAndTime, textSlice } from '../../../utils';
import DeleteModal from './DeleteModal';
import { delModalShow } from '../../../redux/actions/note/noteActions';

const cd_icon = require('../../../assets/images/cd_icon.png');
const filter_icon = require('../../../assets/images/filter.png');
const note = require('../../../assets/images/note.png');
const calendar = require('../../../assets/images/s-calendar.png');

type filtedataType = {
  id: number;
  title: string;
  creator: string;
  recording_name: string;
  created_date: string;
  created_time: string;
}
const Note: React.FC<{ navigation: any }> = ({ navigation }) => {

  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterData, setFilterData] = useState<filtedataType[]>();
  const allRecording = useSelector((state: RootState) => state.home.allRecordings);
  const shareRecording = useSelector((State: RootState) => State.home.shareRecordings);
  const userName = useSelector((state: RootState) => state.auth.user?.first_name);
  const isShare = useSelector((state: RootState) => state.filterModal.isShare);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (dispatch as any)(getAllRecording());
  }, []);

  useEffect(() => {
    if (!isShare) {
      if (allRecording) {
        const data = allRecording.map((item: any) => {
          return {
            ...item,
            creator: userName,
            created_date: formatDateAndTime(item.created_at).formattedDate,
            created_time: formatDateAndTime(item.created_at).formattedTime
          }
        });
        setFilterData(filterByKey(data, 'recording_name', searchTerm));
      }
      else {
        setFilterData([]);
      }
    } else {
      if (shareRecording) {
        const data = shareRecording.map((item: any) => {
          return {
            id: item.recording_detail.id,
            recording_name: item.recording_detail.recording_name,
            creator: item.sender_detail.first_name,
            created_date: formatDateAndTime(item.recording_detail.created_at).formattedDate,
            created_time: formatDateAndTime(item.recording_detail.created_at).formattedTime
          }
        });
        setFilterData(filterByKey(data, 'recording_name', searchTerm));
      }
      else {
        setFilterData([]);
      }
    }
  }, [allRecording, searchTerm, isShare]);

  const searchRecord = (term: string) => {
    setSearchTerm(term);
  };

  const clickItem = async (item: any) => {
    setLoading(true);
    const res = await (dispatch as any)(getRecordingDetails(item.id));
    if (res.success) {
      setLoading(false);
      navigation.navigate('NoteAdd');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <ActivityIndicator style={{ height: '100%', position: 'absolute', zIndex: 99, alignSelf: 'center', justifyContent: 'center' }} size="large" color={colors.brown} />
      )}
      <Image source={cd_icon} style={styles.cd_icon} />
      <UserInfoPart />
      <SearchForm placeholder='Search recording note here' onSearch={searchRecord} />
      <DeleteModal />
      <View style={styles.title_part}>
        <Text style={[styles.title, typography.h3]}>All Notes</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => dispatch(modalShow())}
        >
          <Image source={filter_icon} style={styles.filter_icon} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.item_group}>
        {filterData && filterData.map((item, index) => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => clickItem(item)}
              style={styles.item} key={index} >
              <View style={styles.item_left_part}>
                <Image source={note} style={styles.item_icon} />
                <View style={styles.item_info_part}>
                  <View style={styles.info_left}>
                    <Text style={[styles.item_title, typography.h5]}>{textSlice(item.recording_name, 20)}</Text>
                    <Text style={styles.created_by}>Created By {item.creator}</Text>
                    <View style={styles.created_part}>
                      <Image source={calendar} width={10} height={10} />
                      <Text style={styles.created_date}>{item.created_date}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.item_right_part}>
                <TouchableOpacity
                  onPress={() => dispatch(delModalShow(item.id))}
                  activeOpacity={0.8}
                  style={[styles.action_btn, { backgroundColor: colors.lightred }]}
                >
                  <FontAwesomeIcon icon={faTrashCan} color={colors.white} size={13} style={{ alignSelf: 'center' }} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  cd_icon: {
    position: 'absolute',
    bottom: 70,
    width: 150,
    alignSelf: 'center',
  },
  title_part: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },
  title: {
    fontWeight: 'bold',
    color: colors.black,
  },
  filter_icon: {
    width: 20,
    height: 20,
  },
  item_group: {
    gap: 12,
    flexDirection: 'column',
    marginHorizontal: -10,
    paddingHorizontal: 10,
    flexGrow: 1,
  },
  item: {
    marginBottom: 12,
    paddingHorizontal: 15,
    paddingVertical: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
        shadowOffset: { width: 5, height: 5 },
        shadowRadius: 3,
        elevation: 5,
      },
    }),
  },
  item_left_part: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  item_right_part: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  item_info_part: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    gap: 18,
  },
  item_icon: {
    // width: 32,
    // height: 36,
  },
  info_left: {
    flexDirection: 'column',

  },
  item_title: {
    color: colors.bandingblack,
  },
  created_by: {
    fontSize: 8,
    color: '#666666',
    lineHeight: 12,
    fontFamily: 'Poppins-Regular',
    marginBottom: 5,
  },
  created_part: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  created_date: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    lineHeight: 15,
    color: '#666666',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  info_right: {
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 0,
  },
  clock_icon: {
    width: 10,
    height: 10,
  },
  created_time: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    lineHeight: 15,
    color: '#666666',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  action_btn: {
    height: 23,
    width: 23,
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 30,
  },

  // modal css
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '100%',
    padding: 20,
    paddingHorizontal: 15,
    paddingVertical: 17,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    // borderWidth:1,
    // borderColor:colors.lightgray,

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
  modal_title_part: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modal_title: {
    fontWeight: 'bold',//styleName: H1 Bold;
    fontFamily: 'Poppins',
    fontSize: 24,
    lineHeight: 36,
  },

});

export default Note;
