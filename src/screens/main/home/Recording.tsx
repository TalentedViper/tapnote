import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  Animated
} from 'react-native';
import RNFS from 'react-native-fs';
import Slider from '@react-native-community/slider';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCircleExclamation, faFlag, faHighlighter, faPause, faPenSquare, faPlay } from '@fortawesome/free-solid-svg-icons';
import { RootState } from '../../../redux/reducers';
import { colors, commonStyles, typography } from '../../../styles';
import { toHHMMSS } from "../../../utils";

const { height } = Dimensions.get('window');

const left_arrow = require('../../../assets/images/left-arrow.png');
const recording = require('../../../assets/images/recording.png');
const morevert = require('../../../assets/images/morevert.png');
const calendar = require('../../../assets/images/s-calendar.png');
const counter = require('../../../assets/images/counter.png');
const clock = require('../../../assets/images/s-clock.png');
const trans = require('../../../assets/images/trans.png');
const h_light = require('../../../assets/images/h-light.png');
const gray_flag = require('../../../assets/images/gray-flag.png');

type NavigationProps = {
  navigation: StackNavigationProp<any, 'Recording'>;
  route: any;
};

const BarWaveform: React.FC<{ levels: Animated.Value[] }> = ({ levels }) => {
  return (
    <View style={styles.waveformContainer}>
      {levels.map((level, index) => (
        <Animated.View
          key={index}
          style={{
            width: 10,
            borderRadius: 10,
            height: level,
            backgroundColor: '#fff',
            marginHorizontal: 7,
          }}
        />
      ))}
    </View>
  );
};

const Recording: React.FC<NavigationProps> = ({ route, navigation }) => {
  
  const { data } = route.params;
  const recordDetail = useSelector((state: RootState) => state.home.recordingDetail);
  const recordId = recordDetail?.id;
  
  const [selectButtonText, setSelectButtonText] = useState('Details');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);

  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

  const [waveformLevels, setWaveformLevels] = useState(
    Array(7).fill(0).map(() => new Animated.Value(0))
  );

  const goBack = () => {
    navigation.goBack();
  };

  const changeButtonText = (text: string) => {
    setSelectButtonText(text);
  };

  const onStartPlay = async () => {
    setIsPlaying(true);
    
    audioRecorderPlayer.startPlayer(`file://${RNFS.DocumentDirectoryPath}/${recordDetail?.recording}`);
    audioRecorderPlayer.addPlayBackListener((e) => {
      const current = e.currentPosition;
      const duration = e.duration;
      if (current && duration) {
        setCurrentTime(current);
        setTotalDuration(duration);
  
        // Smoothly update the slider value
        const sliderVal = current / duration;
        requestAnimationFrame(() => {
          setSliderValue(sliderVal);
        });
        if (Math.round(current / 100) >= Math.floor(duration / 100)) {
          onStopPlay();
        }
      }
      return;
    });

  };

  const onStopPlay = async () => {
    setIsPlaying(false);
    await audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
    setCurrentTime(0);
    setSliderValue(0);
  };

  const onPausePlay = async () => {
    setIsPlaying(false);
    await audioRecorderPlayer.pausePlayer();
  };

  const onResumePlay = async () => {
    setIsPlaying(true);
    await audioRecorderPlayer.resumePlayer();
  };

  const onSliderChange = async (value: number, time = '') => {
    if (!isPlaying) {
      onStartPlay();
    }
    const seekTime = totalDuration * value;
    setSliderValue(value);
    setCurrentTime(seekTime);
    await audioRecorderPlayer.seekToPlayer(seekTime);
  };

  function convertTimeToMilliseconds(time: string): number {
    // Split the time string into hours, minutes, and seconds
    const [hours, minutes, seconds] = time.split(':').map(Number);

    // Convert to milliseconds
    const milliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;

    return milliseconds;
  }

  const playHight = (item: any) => {
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
    setIsPlaying(true);
    audioRecorderPlayer.startPlayer(`file://${RNFS.DocumentDirectoryPath}/${recordDetail?.recording}`);

    const initialTimeOffset = convertTimeToMilliseconds(item.start_time);

    audioRecorderPlayer.addPlayBackListener((e) => {
      const adjustedCurrentTime = initialTimeOffset + e.currentPosition;

      setCurrentTime(adjustedCurrentTime);
      setTotalDuration(e.duration);
      setSliderValue(adjustedCurrentTime / e.duration);

      if (adjustedCurrentTime >= convertTimeToMilliseconds(item.time)) {
        onPausePlay();
      }
      return;
    });
  };

  useEffect(() => {
    return () => {
      audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
    };
  }, []);

  useEffect(() => {
    let wave: NodeJS.Timeout;
    if (isPlaying) {
      wave = setInterval(() => {
        const newLevels = waveformLevels.map(level => {
          const newValue = Math.floor(Math.random() * (100 - 30 + 1)) + 30; // Random value between 44 and 130
          Animated.timing(level, {
            toValue: newValue,
            duration: 150,
            useNativeDriver: false,
          }).start();
          return level;
        });
        setWaveformLevels(newLevels);
      }, 150);

    }
    return () => {
      clearInterval(wave);
    };
  }, [isPlaying]);

  return (
    <View style={styles.container}>
      <View style={styles.top_part}>
        <View style={styles.page_title_part}>
          <TouchableOpacity
            onPress={goBack}
            style={styles.go_back}>
            <Image source={left_arrow} />
          </TouchableOpacity>
          <View style={styles.middle_part}>
            <Image source={recording} style={styles.small_icon} />
            <Text style={[styles.page_title, typography.h3, { color: colors.bandingblack }]}>Recording</Text>
          </View>
          <TouchableOpacity activeOpacity={0}
            style={[styles.three_dot, { opacity: 0 }]}>
            <Image source={morevert} style={styles.small_icon} />
          </TouchableOpacity>
        </View>
        <Text style={[typography.h3, styles.record_title]}>{data.recording_name}</Text>
        <View style={styles.btn_group}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => changeButtonText('Details')}
            style={selectButtonText === 'Details' ? [styles.select_btn, commonStyles.box_show] : [styles.unselect_btn, commonStyles.box_show]}>
            <FontAwesomeIcon icon={faCircleExclamation} size={20} color={selectButtonText === 'Details' ? colors.white : colors.bandingblack} />
            <Text style={selectButtonText === 'Details' ? styles.select_btn_text : styles.unselect_btn_text}>Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => changeButtonText('Highlights')}
            style={selectButtonText === 'Highlights' ? [styles.select_btn, commonStyles.box_show] : [styles.unselect_btn, commonStyles.box_show]}>
              <FontAwesomeIcon icon={faHighlighter} size={20} color={selectButtonText === 'Highlights' ? colors.white : colors.bandingblack} />
            <Text style={selectButtonText === 'Highlights' ? styles.select_btn_text : styles.unselect_btn_text}>Highlights</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.record__info]}>
          <View style={styles.record_info_top}>
            <View style={styles.sub_info}>
              <Image source={calendar} />
              <Text style={typography.h6}>{data.created_date}</Text>
            </View>
            <View style={styles.sub_info}>
              <Image source={counter} />
              <Text style={typography.h6}>{data.duration}</Text>
            </View>
            <View style={styles.sub_info}>
              <Image source={clock} />
              <Text style={typography.h6}>{data.created_time}</Text>
            </View>
          </View>
          <View style={styles.record_info_bottom}>
            <Text style={[typography.h5, styles.by_creator]}>Created By: 
              <Text style={{ color: colors.green }}>{recordDetail?.user_detail?.first_name}
                </Text>
            </Text>
          </View>
        </View>
        {selectButtonText === 'Details' ? (
          <View style={styles.transcription_part}>
            <View style={styles.trans_title_part}>
              <Image source={trans} />
              <Text style={[typography.h4, styles.trans_title]}>Transcription</Text>
            </View>
            <ScrollView style={styles.trans_main}>
              <Text style={[styles.transcription, typography.h5]}>{data.transcription_box}</Text>
            </ScrollView>
          </View>
        ) : (
          recordDetail?.recording_highlights.length > 0 ? (
            recordDetail.recording_highlights.map((item: any, index: number) => (
              <TouchableOpacity
                onPress={() => playHight(item)}
                activeOpacity={0.8}
                key={index}
                style={[styles.h_light_item, { marginBottom: 10 }]}
              >
                <View style={styles.item_left_part}>
                  <Image source={h_light} />
                  <View>
                    <Text style={[typography.h5, styles.h_title]}>Highlight {index + 1}</Text>
                    <View style={styles.sub_info}>
                      <Image source={gray_flag} />
                      <Text style={[typography.h6, styles.h_start_time]}>
                        Start Time: {item.start_time || '00:00:22'}
                      </Text>
                    </View>
                  </View>
                </View>
                <View>
                  <TouchableOpacity
                    style={{
                      width: 20,
                      height: 20,
                      alignSelf: 'flex-end',
                      marginBottom: 10,
                    }}
                  >
                    {/* <Image source={morevert} style={{ alignSelf: 'center' }} /> */}
                  </TouchableOpacity>
                  <View style={styles.sub_info}>
                    <Image source={clock} />
                    <Text style={[typography.h6, styles.h_created_time]}>
                      {data.created_time || '10:43 AM'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text>No highlights available</Text>
          )
        )}
      </View>
      <View style={styles.play_part}>
        <View style={{ height: 130, flexDirection:'row', marginTop:20, justifyContent:'center' }}>
          <BarWaveform levels={waveformLevels} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.timeText}>
            {toHHMMSS(currentTime / 1000)}
          </Text>
          <Text style={styles.timeText}>
            {toHHMMSS(totalDuration / 1000)}
          </Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={sliderValue}
          onValueChange={onSliderChange}
          minimumTrackTintColor="#fff"
          maximumTrackTintColor="#BABABA"
          thumbTintColor={'#ffffff'}
        />

        <View style={[styles.buttonContainer, { alignItems: 'flex-end', justifyContent: 'space-between' }]}>
          <TouchableOpacity onPress={() => navigation.navigate('NoteAdd', { recordId })} >
            <FontAwesomeIcon icon={faPenSquare} color={colors.white} size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={isPlaying ? onPausePlay : currentTime > 0 ? onResumePlay : onStartPlay}
            style={styles.btnActions}>
            {isPlaying ? <FontAwesomeIcon icon={faPause} color='white' style={{ alignSelf: 'center' }} size={45} />
              : <FontAwesomeIcon icon={faPlay} color='white' style={{ marginEnd: -7, alignSelf: 'center' }} size={45} />}
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesomeIcon icon={faFlag} color={colors.white} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waveform: {
    height: 100,
    width: '100%',
    marginBottom: 20,
  },
  play_part: {
    position: 'absolute',
    bottom: 0,
    height: 280,
    width: '100%',
    backgroundColor: colors.brown,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 15
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  artist: {
    fontSize: 18,
    marginBottom: 20,
  },
  slider: {
    // width: '100%',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
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
    marginBottom: 295,
    flex: 1,
  },
  page_title_part: {
    flexDirection: 'row',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 19,
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
  btnActions: { width: 70, height: 70, borderRadius: 50, borderWidth: 4, justifyContent: 'center', flexDirection: 'row', borderColor: colors.white }
});

export default Recording;
