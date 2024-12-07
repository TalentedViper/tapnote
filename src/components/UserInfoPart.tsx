import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocationDot, faStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { Badge } from 'react-native-paper';
import { getUserNotification } from '../redux/actions/notificationActions';
import { RootState } from '../redux/reducers';
import { BASE_URL } from '../config';
import { colors, typography } from '../styles';

const bell = require('../assets/images/bell.png');

const UserInfoPart: React.FC = () => {
  

  const dispatch = useDispatch();

  const userInfo = useSelector((state : RootState) => state.auth.user);
  const notification = useSelector((state : RootState) => state.notification.allNotification);
  const navigation = useNavigation();
  const [count, setCount] = useState(0);

  useEffect(() => {
      (dispatch as any)(getUserNotification());
  }, []);

  useEffect(() => {
    if(notification){
      setCount(notification.filter((item : any) => item.type === "1").length);
    }
  }, [notification]);

  return (
    <View style={styles.user_info}>
      <View style={styles.left_part}>
        <View style={styles.arvatar_form}>
          {
            userInfo && userInfo?.profile_image && (
              <Image source={{ uri: BASE_URL +  '/uploads/' + userInfo?.profile_image }} style={styles.arvatar} />
            )
          }
          {userInfo && userInfo?.subscription_date && (
            <FontAwesomeIcon icon={faStar}  style={styles.start_icon} color={colors.yellow}/>
          )}
        </View>
        <View>
          <Text style={[typography.h4, { color: colors.bandingblack }]}>{userInfo?.first_name + " " + (userInfo?.last_name === null ? '' : userInfo?.last_name)}</Text>
          <View style={styles.location_form}>
            <FontAwesomeIcon icon={faLocationDot} color="#8C8C8C" />
            {userInfo?.location ? (
              <Text>{userInfo?.location + ' ' + userInfo?.country}</Text>
            ):(
              <Text>Texas, USA</Text>
            )}
          </View>
        </View>
      </View>
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => navigation.navigate('UserNotification' as never)}
        style={styles.right_part}>
        <Image source={bell} />
        {count > 0 && (
          <Badge size={17} style={{marginBottom:15, marginLeft:-17, borderColor:'white', borderWidth:2}} >{count}</Badge>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  user_info: {
    paddingVertical: 11,
    borderWidth: 1,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(102, 102, 102, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  left_part: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right_part: {
    flexDirection: 'row',
  },
  arvatar_form: {
    width: 46,
    height: 46,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: colors.brown,
    marginRight: 10,
    position: 'relative',
  },
  arvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  start_icon: {
    position: 'absolute',
    left: -2,
    bottom: -2,
  },
  location_form: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:5
  },
  location_icon: {
    width: 16,
    height: 16,
  },
});

export default UserInfoPart;
