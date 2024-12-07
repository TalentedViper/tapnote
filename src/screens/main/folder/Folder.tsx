import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  StatusBar,
  TouchableOpacity,
  Platform,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPen, faTrashCan, faSave, faTrash, faEdit, faFolder } from '@fortawesome/free-solid-svg-icons';
import {getAllFolder, createFolder, editingFolder, FolderID} from '../../../redux/actions/folderAction';
import { RootState } from '../../../redux/reducers';
import { deleteModalShow } from '../../../redux/actions/folderAction';
import ScreenButton from '../../../components/ScreenButton';
import SearchForm from '../../../components/SearchForm';
import UserInfoPart from '../../../components/UserInfoPart';
import DeleteModal from './DeleteModal';

import { filterByKey, formatDateAndTime } from '../../../utils';
import { colors, typography } from '../../../styles';

const record_player = require('../../../assets/images/record-player.png');
const filter_icon = require('../../../assets/images/filter.png');
const folder_icon = require('../../../assets/images/new-folder.png');
const calendar = require('../../../assets/images/s-calendar.png');


type filtedataType = {
  id : any;
  folder_name : string;
  user_detail : any;
  creator : string;
  created_date : string;
  created_time : string;
}

const Folder: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [modalFlag, setModalFlag] = useState<string>('add');
  const [folderName, setFolderName] = useState('');
  const [folderID, setFolderID] = useState(null);
  const [filterData, setFilterData] = useState<filtedataType[]>();
  const allFolder = useSelector((state : RootState) => state.folder.allFolder);
  const dispatch = useDispatch();

  useEffect(() => {
    (dispatch as any)(getAllFolder());
  }, [])

  useEffect(() =>{
    if(allFolder){
      const data = allFolder.map((item : any) => {
        return {
          ...item,
          created_date : formatDateAndTime(item.created_at).formattedDate,
          created_time : formatDateAndTime(item.created_at).formattedTime
        }
      });
      setFilterData(filterByKey(data, 'folder_name', searchTerm));
    }else{
      setFilterData([]);
    }
  }, [allFolder, searchTerm]);

  const searchRecord = (term: string) => {
    setSearchTerm(term);
  };

  const validationSchema = Yup.object().shape({
    folderName: Yup.string().required('folder name is required')
  });

  const handleFolder = async (values: { folderName: string, description : string }) => {
    if(modalFlag === 'add'){
      const response = await (dispatch as any)(createFolder(values.folderName));
      if(response.success){
        (dispatch as any)(getAllFolder());
        setIsVisible(false);
      }
    }else{
      const response = await (dispatch as any)(editingFolder(folderID, values.folderName));
      if(response.success){
        (dispatch as any)(getAllFolder());
        setIsVisible(false);
      }
    }
  }

  const createFolderModalShow = () => {
    setIsVisible(true);
    setModalFlag('add');
  }

  const editFolder = (item : any) => {
    setIsVisible(true);
    setModalFlag('edit');
    setFolderID(item.id);
    setFolderName(item.folder_name);
  };

  const goDetails = async (item : any) => {
    dispatch(FolderID(item.id));
    navigation.navigate('FolderDetails', {item});
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image source={record_player} style={styles.record_player} />
      <UserInfoPart />
      <DeleteModal />
      <SearchForm  placeholder = 'Search folder here' onSearch={searchRecord} />
      <View style={{ marginTop: 12, marginBottom: 14 }}>
        <ScreenButton onPress={createFolderModalShow} title="Create Folder" color="#1D5C77" />
      </View>
      <View style={styles.title_part}>
        <Text style={[styles.title, typography.h3]}>All Saved Folder</Text>
        {/* <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => dispatch(modalShow())}
        >
          <Image source={filter_icon} style={styles.filter_icon} />
        </TouchableOpacity> */}
      </View>
      <ScrollView style={styles.item_group}>
        {filterData && filterData.map((item, index) => {
          return (
            <TouchableOpacity 
              onPress={() => goDetails(item)}
              style={styles.item} key={index} >
              <View style={styles.item_left_part}>
                <Image source={folder_icon} style={styles.item_icon} />
                <View style={styles.item_info_part}>
                  <View style={styles.info_left}>
                    <Text style={[styles.item_title, typography.h5]}>{item.folder_name}</Text>
                    <Text style={styles.created_by}>Created By {item.user_detail.first_name}</Text>
                    <View style={styles.created_part}>
                      <Image source={calendar} width={10} height={10} />
                      <Text style={styles.created_date}>{item.created_date}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.item_right_part}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.action_btn, {backgroundColor:colors.blue}]}
                  onPress={() => editFolder(item)}
                >
                  <FontAwesomeIcon icon={faPen} color={colors.white} size={13} style={{alignSelf:'center'}} />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.action_btn, {backgroundColor:colors.lightred}]}
                  onPress={() => dispatch(deleteModalShow(item.id, "folder"))}
                >
                  <FontAwesomeIcon icon={faTrashCan} color={colors.white} size={13} style={{alignSelf:'center'}} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
      <Modal
        animationType="none" // Options: 'none', 'slide', 'fade'
        transparent={true}
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
          style={styles.modalOverlay}>
          <StatusBar barStyle="light-content" backgroundColor="rgba(120, 126, 128, 1)" />
          <TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <View style={styles.modal_title_part}>
              <FontAwesomeIcon icon={faFolder} size={22} color={colors.secondary} />
              <Text style={[styles.modal_title, typography.h1]}>{modalFlag === 'add' ? 'Create New Folder' : 'Edit Folder'}</Text>
            </View>
            <Formik
              initialValues={modalFlag === 'add' ? { folderName: '', description: '' } : { folderName: folderName, description: '' }}
              validationSchema={validationSchema}
              onSubmit={handleFolder}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                  <View style={styles.input_form}>
                    <Text style={[styles.input_label, typography.h4]}>Folder Name</Text>
                    <TextInput
                      placeholder="ex: Recording Mania"
                      keyboardAppearance="light"
                      placeholderTextColor={colors.place_text}
                      style={styles.input}
                      onChangeText={handleChange('folderName')}
                      onBlur={handleBlur('folderName')}
                      value={values.folderName}
                    />
                    {touched.folderName && errors.folderName && <Text style={styles.errorText}>{errors.folderName}</Text>}
                  </View>
                  {/* <View style={styles.input_form}>
                    <Text style={[styles.input_label, typography.h4]}>Description</Text>
                    <TextInput
                      placeholder='Write Description here'
                      keyboardAppearance="light"
                      multiline
                      numberOfLines={5}
                      maxLength={100}
                      placeholderTextColor={colors.place_text}
                      style={styles.input}
                      onChangeText={handleChange('description')}
                      onBlur={handleBlur('description')}
                      value={values.description}
                    />
                   </View> */}
                  <View style={{ marginTop:24 }}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      style={styles.folderSaveBtn}
                      onPress={() => handleSubmit()}
                    >
                      <FontAwesomeIcon icon={faSave} size={22} color={colors.white} />
                      <Text style={[styles.btn_text, typography.h4]}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </Formik>
          </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    position: 'relative',
  },
  record_player: {
    position: 'absolute',
    bottom: 70,
    width: 245,
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
    width: 36,
    height: 36,
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
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '100%',
    padding: 10,
    paddingHorizontal: 14,
    paddingVertical: 17,
    backgroundColor: colors.white,
    borderRadius: 20,
    alignItems: 'center',
  },
  modal_title_part: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal_title: {
    fontWeight: 'bold',
    color: colors.bandingblack,
  },
  input_form: {
    marginTop: 12,
    width:'100%'
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
  btn_text: {
    color: colors.white,
    fontWeight: 'bold',
  },
  folderSaveBtn:{
    backgroundColor: colors.green, 
    paddingHorizontal:50, 
    paddingVertical:15, 
    flexDirection:'row',
    gap:10,
    alignItems:'center',
    borderRadius:30,
  },
  errorText: {
    color: colors.red,
    marginVertical:5,
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '400',
  },


});

export default Folder;
