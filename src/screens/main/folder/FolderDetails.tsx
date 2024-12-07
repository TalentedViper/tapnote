import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { ActivityIndicator } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCircleLeft, faPen, faShare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import SearchForm from '../../../components/SearchForm';
import DeleteModal from './DeleteModal';
import FilterModal from '../FiterModal';
import { deleteModalShow } from '../../../redux/actions/folderAction';
import {getFolderRecording, getRecordingDetails, editModalShow } from '../../../redux/actions/home/homeAction';
import { RootState } from '../../../redux/reducers';

import { filterByKey, formatDateAndTime, textSlice } from '../../../utils';
import {colors, typography } from '../../../styles';

const record_play = require('../../../assets/images/l-record.png');
const calendar = require('../../../assets/images/s-calendar.png');
const clock = require('../../../assets/images/s-clock.png');

type filtedataType = {
    title : string;
    creator : string;
    created_date : string;
    created_time : string;
}

const FolderDetails: React.FC<{route:any, navigation : any}> = ({route, navigation }) => {
  const {item} = route.params;
  
  const dispatch = useDispatch();
  
  const [filterData, setFilterData] = useState<filtedataType[]>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const folderRecording = useSelector((state : RootState) => state.home.folderRecordings);
  const userName = useSelector((state : RootState) => state.auth.user?.first_name);
  const [loading, setLoading] = useState(false);
  
  const searchRecord = (term : string) => {
    setSearchTerm(term);
  };

  const playRecord = async (data: any) => {
    setLoading(true);
    const response = await (dispatch as any)(getRecordingDetails(data.id));
    if(response.success){
      setLoading(false);
      navigation.navigate('Recording', { data: data });
    }
    // navigation.navigate('Recording', { data: data });
  };

  useEffect(() => {
    (dispatch as any)(getFolderRecording(item.id));
  }, []);

  useEffect(() =>{
    if(folderRecording){
      const data = folderRecording.map((item : any) => {
        return {
          ...item,
          created_date : formatDateAndTime(item.created_at).formattedDate,
          created_time : formatDateAndTime(item.created_at).formattedTime
        }
      });
      setFilterData(filterByKey(data, 'recording_name', searchTerm));
    }else{
        setFilterData([]);
    }
  }, [folderRecording, searchTerm]);

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <ActivityIndicator style={{ height: '100%', position: 'absolute', zIndex: 99, alignSelf: 'center', justifyContent: 'center' }} size="large" color={colors.brown} />
      )}
      <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:15}}>
        <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{backgroundColor:colors.lightgray, borderRadius:30, flexDirection:'row', justifyContent:'center', height:40, width:40}}>
            <FontAwesomeIcon icon={faArrowLeft} size={20} color='#333333' style={{alignSelf:'center'}} />
        </TouchableOpacity>
        <Text style={[typography.h3,{color:colors.bandingblack}]}>{item.folder_name}</Text>
        <TouchableOpacity style={{opacity:0}} activeOpacity={0}>
          <FontAwesomeIcon icon={faArrowLeft} size={20} color='#333333' style={{alignSelf:'center'}} />
        </TouchableOpacity>
      </View>
      <DeleteModal />
      <SearchForm placeholder='Search recording here' onSearch={searchRecord} />
      <View style={styles.title_part}>
        <Text style={[styles.title, typography.h3]}>All Recordings</Text>
      </View>
      <FilterModal />
      <ScrollView style={styles.item_group}>
        {filterData ? ( filterData.map((item: any, index:number) => {
          return (
            <TouchableOpacity 
              onPress={() => playRecord(item)}
              style={styles.item} key={index} >
              <View style={styles.item_left_part}>
                <Image source={record_play} style={styles.item_icon} />
                <View style={styles.item_info_part}>
                  <View>
                    <Text style={[styles.item_title, typography.h5]}>{textSlice(item.recording_name, 20)}</Text>
                    <Text style={styles.created_by}>Created By {userName}</Text>
                  </View>
                  <View style={{flexDirection:'row', gap:30}}>
                    <View style={styles.info_left}>
                      <View style={styles.created_part}>
                        <Image source={calendar} width={10} height={10} />
                        <Text style={styles.created_date}>{item.created_date}</Text>
                      </View>
                    </View>
                    <View style={styles.info_right}>
                      <Image source={clock} />
                      <Text style={styles.created_time}>{item.created_time}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.item_right_part}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.action_btn, {backgroundColor:colors.blue}]}
                  onPress={() => dispatch(editModalShow(item.id, item.recording_name, 'folder'))}
                >
                  <FontAwesomeIcon icon={faPen} color={colors.white} size={13} style={{alignSelf:'center'}} />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.action_btn, {backgroundColor:colors.lightgreen}]}
                  onPress={() => navigation.navigate('ShareRecord', {item})}
                >
                  <FontAwesomeIcon icon={faShare} color={colors.white} size={13} style={{alignSelf:'center'}} />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.action_btn, {backgroundColor:colors.lightred}]}
                  onPress={() => dispatch(deleteModalShow(item.id, "record"))}
                >
                  <FontAwesomeIcon icon={faTrashCan} color={colors.white} size={13} style={{alignSelf:'center'}} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )
        })) : (
          <View style={{flex:1, height:300, justifyContent:'center', alignItems:'center'}}>
            <Text style={typography.h3}>No data found.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.background,
    paddingHorizontal:20,
  },
  title_part: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },
  title: {
    fontWeight:'bold',
    color:colors.black,
  },
  filter_icon: {
    width:20,
    height:20,
  },
  item_group: {
    gap:12,
    flexDirection:'column',
    paddingHorizontal:10,
    marginHorizontal:-10,
  },
  item: {
    marginBottom:12,
    paddingHorizontal:15,
    paddingVertical:7,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:colors.white,
    borderRadius:10,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
      },
      android: {
        shadowColor: colors.black,
        shadowOffset: {width: 5, height: 5},
        shadowRadius: 3,
        elevation: 5,
      },
    }),
  },
  item_left_part: {
    flexDirection:'row',
    alignItems:'center',
    gap:15,
  },
  item_right_part: {
    flexDirection:'row',
    alignItems:'center',
    gap:16,
  },
  item_info_part : {
    flexDirection: 'column',
  },
  item_icon: {
    width:36,
    height:36,
  },
  info_left:{
    flexDirection:'column',

  },
  item_title: {
    color:colors.bandingblack,
  },
  created_by: {
    fontSize:8,
    color:'#666666',
    lineHeight:12,
    fontFamily:'Poppins-Regular',
    marginBottom:5,
  },
  created_part: {
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems: 'center',
  },
  created_date : {
    fontFamily:'Poppins-Regular',
    fontSize:10,
    lineHeight:15,
    color:'#666666',
    fontWeight:'bold',
    marginLeft:4,
  },
  info_right:{
    flexDirection:'row',
    alignItems:'center',
    bottom:0,
  },
  clock_icon: {
    width:10,
    height:10,
  },
  created_time: {
    fontFamily:'Poppins-Regular',
    fontSize:10,
    lineHeight:15,
    color:'#666666',
    fontWeight:'bold',
    marginLeft:4,
  },
  action_btn: {
    height:23,
    width:23,
    justifyContent:'center',
    alignContent:'center',
    borderRadius:30,
  },

  // modal css
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal:20,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '100%',
    padding: 20,
    paddingHorizontal:15,
    paddingVertical:17,
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
        shadowOffset: {width: 5, height: 5},
        shadowRadius: 3,
        elevation: 5,
      },
    }),
  },
  modal_title_part:{
    gap:8,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  modal_title: {
    fontWeight:'bold',//styleName: H1 Bold;
    fontFamily: 'Poppins',
    fontSize: 24,
    lineHeight: 36,
  },

});

export default FolderDetails;
