import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity, Platform, StatusBar, TouchableWithoutFeedback } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Toast from 'react-native-toast-message';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleXmark, faSave } from '@fortawesome/free-solid-svg-icons';
import { RootState } from '../../../redux/reducers';
import { modalHide } from '../../../redux/actions/home/chooseFolderModalActions';
import { getAllFolder } from '../../../redux/actions/folderAction';
import { folderChoose } from '../../../redux/actions/home/homeAction';

import { colors, typography } from '../../../styles';

const folder = require('../../../assets/images/folder.png');

const ChooseFolderModal: React.FC = () => {
  const dispatch = useDispatch();
  const isVisible = useSelector((state: RootState) => state.chooseFolder.modalVisible);
  const folderData = useSelector((state: RootState) => state.folder.allFolder);
  const recordingId = useSelector((State: RootState) => State.chooseFolder.recording_id);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'folder', value: 'none' },
  ]);
  useEffect(() => {
    (dispatch as any)(getAllFolder());
  }, [isVisible]);

  useEffect(() => {
    if (folderData) {
      setItems(folderData.map((item: any) => {
        return {
          label: item.folder_name,
          value: item.id
        }
      }))
    } else {
      setItems([]);
    }
  }, [folderData]);

  const chooseFolder = async () => {
    if (value !== null) {
      const result = await (dispatch as any)(folderChoose(value, recordingId));
      if (result.success) {
        dispatch(modalHide());
      }
    } else {
      Toast.show({
        type: 'info',
        text1: 'Select the folder'
      })
    }
  };

  return (
    <Modal
      animationType="none" // Options: 'none', 'slide', 'fade'
      transparent={true}
      visible={isVisible}
      onRequestClose={() => dispatch(modalHide())}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => dispatch(modalHide())}
        style={styles.modalOverlay}>
        <StatusBar barStyle="light-content" backgroundColor="rgba(120, 126, 128, 1)" />
        <TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <View style={styles.modal_title_part}>
              <Image source={folder} />
              <Text style={[styles.modal_title, typography.h1]}>Choose Folder</Text>
            </View>
            <Text style={[styles.record_title, typography.h3]}>Choose Folder</Text>
            <View style={styles.slect_part}>
              <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                textStyle={styles.dropdownText}
                placeholderStyle={styles.placeholderText}
                labelStyle={styles.labelText}
                placeholder="Choose Folder"
              />
            </View>
            <View style={{ flexDirection: 'row', gap: 14 }}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.action_btn, { flex: 1, backgroundColor: colors.red }]}
                onPress={() => dispatch(modalHide())}
              >
                <FontAwesomeIcon icon={faCircleXmark} size={22} color={colors.white} />
                <Text style={[styles.btn_text, typography.h4]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.action_btn, { flex: 1, backgroundColor: colors.green }]}
                onPress={chooseFolder}
              >
                <FontAwesomeIcon icon={faSave} size={22} color={colors.white} />
                <Text style={[styles.btn_text, typography.h4]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>

  );
};

const styles = StyleSheet.create({

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
    padding: 20,
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
    marginBottom: 22,
  },
  modal_title: {
    fontWeight: 'bold',
    color: colors.bandingblack,
  },
  record_title: {
    color: colors.secondary,
    fontWeight: 'bold',
  },
  slect_part: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 0,
    marginTop: 5,
    marginBottom: 15,
  },
  action_btn: {
    paddingVertical: 15,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    zIndex: -99
  },
  btn_text: {
    color: colors.white,
    fontWeight: 'bold',
  },
  dropdown: {
    borderColor: colors.gray,
    borderRadius: 30,
    width: '100%',
  },
  dropdownContainer: {
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    // borderRadius: 5,
    // marginTop: 1,
  },
  dropdownText: {
    paddingHorizontal: 10,
    color: '#666666',
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 27,
  },
  placeholderText: {
    color: '#666666',
  },
  labelText: {
    paddingHorizontal: 10,
    color: '#666666',
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 27,

  },
});

export default ChooseFolderModal;
