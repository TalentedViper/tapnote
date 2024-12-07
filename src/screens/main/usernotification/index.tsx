import React, {useState, useEffect} from 'react';
import { View, Image, StyleSheet, Text, ScrollView, Animated } from 'react-native';
import Toast from 'react-native-toast-message';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleDown, faTrashCan, faTrash } from '@fortawesome/free-solid-svg-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import DeleteModal from './DeleteModal';
import { getUserNotification, notificationUpdate, deleteModalShow } from '../../../redux/actions/notificationActions';
import { colors, typography } from '../../../styles';
import { RootState } from 'src/redux/reducers';
import { formatDateAndTime, textSlice } from '../../../utils';

const left_arrow = require('../../../assets/images/left-arrow.png');

type notificationType = {
  id: number;
  title: string;
  description : string;
  type : string;
  date: string;
}


const AccordionItem: React.FC<{item:any, title: string, children: React.ReactNode}> = ({item, title, children }) => {
  
  const dispatch = useDispatch();
  
  const [expanded, setExpanded] = useState(false);
  const [height] = useState(new Animated.Value(0)); // Animated value for expanding/collapsing
  const [rotate] = useState(new Animated.Value(0)); // Rotate for the arrow animation

  // Toggle accordion state
  const toggleAccordion = (item : any) => {
    if(item.type === '1'){
     (dispatch as any)(notificationUpdate(item.id));
    }
    const toValue = expanded ? 0 : 1; // Toggle between 0 and 1
    Animated.timing(height, {
      toValue: toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Rotate the arrow icon
    Animated.timing(rotate, {
      toValue: toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setExpanded(!expanded); // Toggle the expanded state
  };

  // Interpolate the rotation value for the arrow
  const arrowRotation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'], // Start at 0 degrees and rotate 180 degrees when expanded
  });

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => toggleAccordion(item)} style={styles.header}>
        {item.type === '1' ? (
          <Text style={[styles.title, {color:colors.bandingblack , width:"80%"}]}>{textSlice(title, 30)}</Text>
        ) : (
          <Text style={[styles.title, {width:"80%"}]}>{textSlice(title, 30)}</Text>
        )}
        <View style={{flexDirection:'row', justifyContent:'space-between', gap:20}}>
          <TouchableOpacity 
              onPress={() => dispatch(deleteModalShow(item.id))}
              style={[styles.action_btn, { backgroundColor: colors.lightred }]}
              >
              <FontAwesomeIcon icon={faTrashCan} color={colors.white} size={13} style={{ alignSelf: 'center' }} />
          </TouchableOpacity>

          <Animated.View
            style={[
              styles.arrowContainer,
              { transform: [{ rotate: arrowRotation }] },
            ]}
          >
            <FontAwesomeIcon icon={faAngleDown} />
          </Animated.View>
        </View>
      </TouchableOpacity>

      <Animated.View
        // style={[
        //   styles.body,
        //   {
        //     height: height.interpolate({
        //       inputRange: [0, 1],
        //       outputRange: [0, 500], // Set the max height of the expanded content
        //     }),
        //   },
        // ]}
      >
        {expanded && <Text style={[typography.h7, {color:colors.bandingblack, padding:15}]}>{children}</Text>}
      </Animated.View>
    </View>
  );
};

const UserNotification: React.FC<{ navigation: any }> = ({ navigation }) => {
  
  const notificationData = useSelector((state : RootState) => state.notification.allNotification);
  const [data, setData] = useState<notificationType[]>();
  
  useEffect(() => {
    if(notificationData){
      const data = notificationData.map((item: any) => {
        return {
          id: item.id,
          title: item.title,
          type : item.type,
          description : item.notification,
          date: formatDateAndTime(item.created_at).formattedDate,
        }}
      );
      setData(data);
    }else{
      setData([]);
    }
  }, [notificationData]);

  return (
    <View style={styles.container}>
      <DeleteModal />
      <View style={{ flexDirection: 'row', marginTop: 18, marginBottom:30,  justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={left_arrow} />
        </TouchableOpacity>
        <Text style={[typography.h3, { color: colors.black, fontWeight: 'bold' }]}>Notification</Text>
        <Image source={left_arrow} style={{ opacity: 0 }} />
      </View>
      <ScrollView >
        {data && data.map((item, index) => {
          return (
            <AccordionItem key={index} item={item} title={item.title}>
              {item.description}
            </AccordionItem>
          )
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
  },

  itemContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily:'Poppins'
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  body: {
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },

  backText: {
    fontFamily: 'Poppins',
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
    marginVertical: 13,
    alignSelf: 'center',
    color: colors.secondary
  },

  action_btn: {
    height: 23,
    width: 23,
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 30,
  },
});

export default UserNotification;
