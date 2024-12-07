import React from 'react';
import { SafeAreaView, ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight, faRightFromBracket, faStar } from '@fortawesome/free-solid-svg-icons';
import ProfileInfo from './ProfileInfo';
import LogOutModal from '../LogOutModal';
import { BASE_URL } from '../../../config';
import {colors, rounded, commonStyles, typography } from '../../../styles';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/reducers';
import { logOutModalShow } from '../../../redux/actions/authAction';

type NavigationProps = {
  navigation: StackNavigationProp<any, 'Setting'>;
  route: RouteProp<any, 'Setting'>;
};

const Setting: React.FC<NavigationProps> = ({ navigation }) => {

  const dispatch = useDispatch();

  const userInfo = useSelector((state : RootState) => state.auth.user);
  const navigator = (page: string) => {
    navigation.navigate(page);
  };
  const logOut = () => {
    dispatch(logOutModalShow());
    console.log("lot out!");
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.title, typography.h3]}>Settings</Text>
      <View style={[styles.profile_part, commonStyles.box_show]}>
        <View style={styles.left_part}>
          <View style={styles.arvatar_form}>
            {userInfo && (
              <Image source={{ uri: BASE_URL + '/uploads/' + userInfo?.profile_image }} style={styles.arvatar} />
            )}
            {userInfo && userInfo?.subscription_date && (
              <FontAwesomeIcon icon={faStar} color={colors.yellow} size={15} style={styles.start_icon} />
            )}
          </View>
          <View>
            <Text style={[typography.h4, {color:colors.bandingblack}]}>{userInfo?.first_name + ' ' + (userInfo?.last_name === null ? '' : userInfo?.last_name)}</Text>
            <Text style={[typography.subtext, {color:'#666666', marginTop:-5}]}>{userInfo?.email}</Text>
            {
              userInfo && userInfo?.subscription_date ? (
                <Text style={[typography.subtext, {color:colors.lightgreen}]}>Premium User</Text>
              ) : (
                <Text style={[typography.subtext, {color:colors.bandingblack}]}>Free User</Text>
              )
            }
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {navigator("EditProfile")}}
          style={[styles.profile_btn, commonStyles.box_show]}
        >
          <Text style={[typography.h7, {color:colors.white}]}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
      <ProfileInfo userdata = {userInfo} />
      <LogOutModal />
      <View style={styles.btn_group}>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.touch_btn, commonStyles.box_show, {backgroundColor:colors.white}]}
        >
          <View>
            <Text style={[typography.h3, {color:colors.bandingblack, fontWeight:'bold'}]}>Recording Quality</Text>
            <Text style={[typography.h6, {color:colors.lightgreen, fontWeight:'500'}]}>Medium 128kbps. 44.1 kHz</Text>
          </View>
          {/* <FontAwesomeIcon icon={faChevronRight} size={20} color={colors.bandingblack} /> */}
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {navigator("Subscription")}}
          style={[styles.touch_btn, commonStyles.box_show, {backgroundColor:colors.green}]}
        >
          <Text style={[typography.h3, {color:colors.white, fontWeight:'bold'}]}>Subscription</Text>
          <FontAwesomeIcon icon={faChevronRight} size={20} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {navigator("Security")}}
          style={[styles.touch_btn, commonStyles.box_show, {backgroundColor:colors.secondary}]}
        >
          <Text style={[typography.h3, {color:colors.white, fontWeight:'bold'}]}>Security</Text>
            <FontAwesomeIcon icon={faChevronRight} size={20} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={logOut}
          style={[styles.log_out_btn, {backgroundColor:colors.brown}]}
        >
          <FontAwesomeIcon icon={faRightFromBracket} size={22} color={colors.white} />
          <Text style={[typography.h3, {color:colors.white, fontWeight:'bold'}]}>Log Out</Text>
        </TouchableOpacity>
      </View>
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
  profile_part: {
    paddingVertical:10,
    paddingHorizontal:15,
    backgroundColor:colors.white,
    borderRadius:10,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    marginBottom:10,
  },
  left_part: {
    flexDirection:'row',
    alignItems:'center',
  },
  arvatar_form:{
    width:46,
    height:46,
    borderWidth:1,
    borderRadius:50,
    borderColor:colors.brown,
    marginRight:10,
    position:'relative',
  },
  arvatar: {
    width:'100%',
    height:'100%',
    borderRadius:50,
  },
  start_icon: {
    position:'absolute',
    left:-2,
    bottom:-2,
  },
  location_form:{
    flexDirection: 'row',
    alignItems:'center',
  },
  location_icon:{
    width:16,
    height:16,
  },
  profile_btn: {
    backgroundColor:'#1D5C77',
    paddingVertical:5,
    paddingHorizontal:13.5,
    borderRadius:rounded.md,
  },
  title: {
    fontWeight:'bold',
    color:colors.black,
    marginBottom:10,
  },

  // modal css
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal:30,
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

  // ---------------------
  btn_group: {
    flexDirection:'column',
    gap:10,
    marginTop:10,
    marginBottom:60,
  },
  touch_btn: {
    paddingHorizontal:20,
    paddingVertical:11,
    height:77,
    flexDirection:'row',
    borderRadius:10,
    justifyContent:'space-between',
    alignItems:'center',
  },
  btn_title:{
    fontWeight:'bold',
  },
  log_out_btn:{
    borderRadius:rounded.xl,
    paddingVertical:15,
    justifyContent:'center',
    alignItems:'center',
    gap:10,
    flexDirection:'row',
  },
});

export default Setting;
