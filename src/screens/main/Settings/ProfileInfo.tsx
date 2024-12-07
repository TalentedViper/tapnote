import React from 'react';
import {View, Text, StyleSheet } from 'react-native';
import Divider from '../../../components/Divider';

import { colors, typography } from '../../../styles';

const pro_info = {
  email: 'mono@gmail.com',
  password : '********',
  phone_number : '+88065454654',
  location: 'My Current Location',
}

const ProfileInfo = (props : any) => {
    const userInfo = props.userdata;
    return (
        <View style={styles.regular_info} >
          <View style={styles.account_info}>
            <Text style={[styles.mb_20,typography.h3, {color:colors.bandingblack}]}>Account</Text>
            <View style={styles.info_group}>
              <View style={styles.info_item}>
                <Text style={[typography.h5, {color:colors.bandingblack}]}>Email</Text>
                <Text style={[typography.h5, {color:'#666666'}]}>{userInfo?.email}</Text>
              </View>
              <View style={styles.info_item}>
                <Text style={[ typography.h5, {color:colors.bandingblack}]}>Password</Text>
                <Text style={[typography.h5, {color:'#666666'}]}>{pro_info.password}</Text>
              </View>
              <View style={styles.info_item}>
                <Text style={[ typography.h5, {color:colors.bandingblack}]}>Phone Number</Text>
                <Text style={[typography.h5, {color:'#666666'}]}>{userInfo?.phone}</Text>
              </View>
            </View>
          </View>
          <Divider />
          <View style={styles.discovery_info}>
          <Text style={[styles.mb_20,typography.h3, {color:colors.bandingblack}]}>Discovery</Text>
            <View style={styles.info_group}>
              <View style={styles.info_item}>
                <Text style={[typography.h5, {color:colors.bandingblack}]}>Location</Text>
                <Text style={[typography.h5, {color:'#666666'}]}>{userInfo?.location}</Text>
              </View>
              <Text style={[typography.h6, {color:colors.bandingblack}]}>Change your Location to see ALBANIAN Members in other cities</Text>
            </View>
          </View>
        </View>
    );
};

const styles = StyleSheet.create({
    regular_info: {
        flexDirection:'column',
        backgroundColor:colors.white,
        gap:8,
    },
    account_info:{
      paddingVertical:20,
      paddingHorizontal:20,
    },
    discovery_info: {
      paddingVertical:20,
      paddingHorizontal:20,
    },
    mb_20:{
      marginBottom:20,
    },
    info_group: {
      flexDirection:'column',
      gap:12,
    },
    info_item: {
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between',
    },
});

export default ProfileInfo;