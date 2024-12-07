import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { SpeechRecognitionRootView  } from 'react-native-voicebox-speech-rec'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';

import RecordModal from '../screens/main/home/RecordModal';
import SaveRecordingModal from '../screens/main/home/SaveRecordingModal';
import ChooseFolderModal from '../screens/main/home/ChooseFolderModal';
import { modalShow } from '../redux/actions/home/recordModalActions';
import { colors } from '../styles';
import AppCloseModal from '../screens/AppCloseModal';

const normalIcons = {
  Home: require('../assets/images/normal-home.png'),
  Folder: require('../assets/images/normal-folder.png'),
  Note: require('../assets/images/normal-note.png'),
  Setting: require('../assets/images/normal-setting.png'),
};

const activeIcons = {
  Home: require('../assets/images/active-home.png'),
  Folder: require('../assets/images/active-folder.png'),
  Note: require('../assets/images/active-note.png'),
  Setting: require('../assets/images/active-setting.png'),
};

const menu_data = [
  {
    text: 'Home',
    icon: [normalIcons.Home, activeIcons.Home],
  },
  {
    text: 'Folder',
    icon: [normalIcons.Folder, activeIcons.Folder],
  },
  {
    text: 'Note',
    icon: [normalIcons.Note, activeIcons.Note],
  },
  {
    text: 'Setting',
    icon: [normalIcons.Setting, activeIcons.Setting],
  },
];

const NavBar = (currentScreen : any) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const clickedItem = (screen: any) => () => {
    navigation.navigate(screen as never);
  };
  const handleFabButton = () => {
    dispatch(modalShow());
  };

  return (
    
      <View style={styles.nav_wrapper}>
        <View style={styles.shadow} />
          <RecordModal />
        <AppCloseModal />
        <SaveRecordingModal />
        <ChooseFolderModal />
        <View style={styles.container}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.btn_fab}
            onPress={handleFabButton}>
              <FontAwesomeIcon icon={faMicrophone} size={50} color='white' />
          </TouchableOpacity>
          {menu_data.map((item, index) => {
            return (
              <TouchableOpacity
                key={index} // Use index as a key
                activeOpacity={0.8}
                onPress={clickedItem(item.text)} // Pass a function reference
                style={styles.item}>
                {item.text === currentScreen.screen ? (
                  <>
                    <Image source={item.icon[1]} style={styles.item_icon} />
                    <Text style={styles.active_text}>{item.text}</Text>
                  </>
                ) : (
                  <>
                    <Image source={item.icon[0]} style={styles.item_icon} />
                    <Text style={styles.normal_text}>{item.text}</Text>
                  </>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  nav_wrapper: {
    position: 'relative',
    backgroundColor: 'transparent',
  },
  shadow: {
    position: 'absolute',
    width:'100%',
    top: -18,
    opacity:0.9,
    left: 0,
    right: 0,
    height: 100, // Adjust height as needed
    borderTopColor:colors.brown,
    shadowColor: colors.brown,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  container: {
    position: 'relative',
    paddingHorizontal: 21,
    paddingTop: 26,
    paddingBottom: 22,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    flexDirection: 'column',
    width: 50,
    gap: 12,
    justifyContent: 'space-between',
  },
  item_icon: {
    alignSelf: 'center',
  },
  active_text: {
    alignSelf: 'center',
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 18,
    color: '#030306',
  },
  normal_text: {
    alignSelf: 'center',
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 18,
    color: '#BABABA',
  },
  btn_fab: {
    zIndex: 99,
    right: '50%',
    alignSelf: 'center',
    flexDirection: 'row',
    bottom: 70,
    transform: [
      { translateY: 0 },
      { translateX: 16 },
    ],
    position: 'absolute',
    backgroundColor: '#F44336',
    borderRadius: 50,
    width: 74,
    height: 74,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NavBar;
