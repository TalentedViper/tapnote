import React, { useState, useEffect } from 'react';
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
import { Checkbox } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../../../config';
import { RootState } from '../../../redux/reducers';
import { colors, typography } from '../../../styles';
import { getAllUsers, shareRecording } from '../../../redux/actions/home/homeAction';
import SearchForm from '../../../components/SearchForm';
import { filterByKey } from '../../../utils';
import Toast from 'react-native-toast-message';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShareNodes } from '@fortawesome/free-solid-svg-icons';

const { height } = Dimensions.get('window');

const left_arrow = require('../../../assets/images/left-arrow.png');
const morevert = require('../../../assets/images/morevert.png');
const note = require('../../../assets/images/note.png');


type UserType = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    profile_image: string;
    created_time: string;
  };
const ShareRecord: React.FC<{route:any, navigation : any}> = ({route, navigation }) => {

    const { item } = route.params;
    const dispatch = useDispatch();
    const recordDetail = useSelector((state: RootState) => state.home.recordingDetail);
    const allUsers = useSelector((state: RootState) => state.home.allUsers);
    const userInfo = useSelector((state: RootState) => state.auth.user);
  
    const [filterData, setFilterData] = useState<UserType[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [checkboxState, setCheckboxState] = useState<{ [key: number]: boolean }>({});
    const [shareUserList, setShareUserList] = useState<{ receiver_id: string; type: number }[]>([]);
  
    useEffect(() => {
      (dispatch as any)(getAllUsers());
    }, [dispatch]);
  
    // useEffect(() => {
    //   if (allUsers) {
    //     const filtered = filterByKey(allUsers, 'email', searchTerm);
    //     setFilterData(filtered);
    //     // Initialize checkboxState for the filtered users
    //     const initialState = filtered.reduce((acc : any, user : any) => {
    //       acc[user.id] = checkboxState[user.id] || false;
    //       return acc;
    //     }, {} as { [key: number]: boolean });
    //     setCheckboxState(initialState);
    //   } else {
    //     setFilterData([]);
    //   }
    // }, [allUsers, searchTerm]);
  
    const goBack = () => {
      navigation.goBack();
    };
  
    const handleCheckboxToggle = (id: number) => {
      setCheckboxState(prevState => ({
        ...prevState,
        [id]: !prevState[id],
      }));

      setShareUserList((prevList) => {
        const isChecked = checkboxState[id];
        if (isChecked) {
          // If already checked, remove the user from the list
          return prevList.filter((user) => user.receiver_id !== id.toString());
        } else {
          // If not checked, add the user to the list
          return [
            ...prevList,
            {
              receiver_id: id.toString(),
              type: 1, // or any other type you'd like to set
            },
          ];
        }
      });

    };
  
    const recordShare = async () => {
        if(shareUserList.length > 0){
            const response = await (dispatch as any)(shareRecording(item.id, 1, shareUserList));
            if(response.success){
                Toast.show({
                    type: 'success',
                    text1 : response.message || 'Sharing Success!'
                });
            }else{
                Toast.show({
                    type: 'error',
                    text1 : response.message || 'Sharing Failed!'
                });
            }
        }
    };
  
    const searchRecord = (term: string) => {
      // setSearchTerm(term);
        if(term === ''){
          setFilterData([]);
        }else{
          const filtered = filterByKey(allUsers, 'email', term);
          setFilterData(filtered);
        }
    };
  
    return (
      <View style={styles.container}>
        <View style={styles.top_part}>
          <View style={styles.page_title_part}>
            <TouchableOpacity onPress={goBack} style={styles.go_back}>
              <Image source={left_arrow} />
            </TouchableOpacity>
            <View style={styles.middle_part}>
              <Image source={note} style={styles.small_icon} />
              <Text style={[styles.page_title, typography.h3, { color: colors.bandingblack }]}>
                Share Recording
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0} style={[styles.three_dot, {opacity:0}]}>
              <Image source={morevert} style={styles.small_icon} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.page_title, typography.h5, { color: colors.bandingblack, marginBottom: 10 }]}>
            {item?.recording_name}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <SearchForm placeholder = 'Search email address' onSearch={searchRecord} />
          </View>
          <ScrollView style={{ marginTop: 10 }}>
            {filterData.map((user, index) => (
              <View key={user.id} style={styles.item}>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                  <Image
                    source={{ uri: `${BASE_URL}/uploads/${user.profile_image}` }}
                    style={{ width: 40, height: 40, borderRadius: 30 }}
                  />
                  <View>
                    <Text style={[typography.h5, { color: colors.green }]}>
                      {user.first_name} {user.last_name}
                    </Text>
                    <Text style={[typography.h6, { color: colors.bandingblack }]}>{user.email}</Text>
                  </View>
                </View>
                <Checkbox
                 uncheckedColor={colors.brown}
                 color={colors.brown}
                  status={checkboxState[user.id] ? 'checked' : 'unchecked'}
                  onPress={() => handleCheckboxToggle(user.id)}
                />
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={styles.btnForm}>
          <TouchableOpacity onPress={recordShare} style={styles.btnShare}>
            <FontAwesomeIcon icon={faShareNodes} size={20} color={colors.white} />
            <Text style={[typography.h4, { color: colors.white }]}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  

const styles = StyleSheet.create({

    item: {
        marginHorizontal: 5,
        marginBottom: 12,
        paddingHorizontal: 10,
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
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
        marginBottom: 15,
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
    btnForm: {
        paddingHorizontal: 30,
        paddingVertical: 30
    },
    shareIcon: {
        width: 19,
    },
    btnShare: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.green,
        paddingHorizontal: 20,
        gap: 10,
        paddingVertical: 10,
        borderRadius: 50
    },
    search_input: {
        flex: 1,
        fontFamily: 'Poppins-Regular',
        fontWeight: '400',
        fontSize: 18,
        lineHeight: 27,
    },
});

export default ShareRecord;
