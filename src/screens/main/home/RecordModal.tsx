import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  View,
  Platform,
  Text,
  Image,
  StyleSheet,
  Modal,
  Alert,
  TouchableOpacity,
  StatusBar,
  Animated,
  TouchableWithoutFeedback,
  PermissionsAndroid,
} from 'react-native';
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioSet
} from 'react-native-audio-recorder-player';
import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';
import AudioRecord from 'react-native-audio-record';
import axios from 'axios';
import RNFS from 'react-native-fs';
import { LogBox } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFloppyDisk, faHighlighter, faPause, faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
LogBox.ignoreLogs(['new NativeEventEmitter()']);
LogBox.ignoreAllLogs();
import { RootState } from '../../../redux/reducers';
import { modalHide, setRecordData } from '../../../redux/actions/home/recordModalActions';
import { modalShow as saveModal } from '../../../redux/actions/home/saveRecordingActions';
import { colors, typography } from '../../../styles';
import { formatDuration } from '../../../utils';

const BarWaveform: React.FC<{ levels: Animated.Value[] }> = ({ levels }) => {
  return (
    <View style={styles.waveformContainer}>
      {levels.map((level, index) => (
        <Animated.View
          key={index}
          style={{
            width: 12,
            borderRadius: 10,
            height: level,
            backgroundColor: '#9A49B1',
            marginHorizontal: 7,
          }}
        />
      ))}
    </View>
  );
};

interface Highlight {
  start_time: string;
  time: string;
}

const RecordModal: React.FC = () => {

  const dispatch = useDispatch();

  const isVisible = useSelector((state: RootState) => state.record.modalVisible);

  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;
  const audioSet: AudioSet = {
    AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
    AudioSourceAndroid: AudioSourceAndroidType.MIC,
    AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
    AVNumberOfChannelsKeyIOS: 2,
    AVFormatIDKeyIOS: AVEncodingOption.aac,
  };
  const [waveformLevels, setWaveformLevels] = useState(
    Array(7).fill(0).map(() => new Animated.Value(0))
  );

  
  const [recordingState, setRecordingState] = useState({
    duration: '00:00:00',
    isPaused: true,
    currentAction: 'start',
  });
  
  const [highLightArr, setHighLightArr] = useState<Highlight[]>([]);
  const [recordingName, setRecordingName] = useState<string>('');
  const [recordingPath, setRecordingPath] = useState<string>('');
  const [transcription, setTranscription] = useState('');
  const [dateNow, setDateNow] = useState(Date.now());
  const [isHighLighting, setIsHighLighting] = useState(false);
  const [startTime, setStartTime] = useState('');

  useEffect(() => {
    setDateNow(Date.now());
    setRecordingState(prev => ({
      ...prev,
      duration: '00:00:00',
      transcription: '',
      isPaused: true,
      currentAction: 'start'
    }))
  }, [isVisible]);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'This app needs access to your microphone to convert speech to text.',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Failed to request permission', err);
        return false;
      }
    }
    return true;
  };

  const startRecording = async () => {
    const hasPermission = await requestPermissions();
    if (!recordingState.isPaused) {
      Alert.alert('Recording in Progress', 'Please stop the current recording before starting a new one.');
      return;
    }
    if (!hasPermission) {
      Alert.alert('Permissions required', 'Please allow permissions to record audio.');
      return;
    }

    try {
      let path = `${RNFS.DocumentDirectoryPath}/Recording_${dateNow}.mp3`;
      await audioRecorderPlayer.startRecorder(path, audioSet, true);
      setRecordingName(`Recording_${dateNow}`);
      setRecordingPath(path);
      console.log("Voice recognition started");
      audioRecorderPlayer.addRecordBackListener(async (e) => {
        // setMetering(e.currentMetering ?? 0);
        setRecordingState((prev) => ({
          ...prev,
          duration: formatDuration(e.currentPosition),
        }));
      });

      setRecordingState((prev) => ({
        ...prev,
        isPaused: false,
        currentAction: 'pause',
      }));

    } catch (error) {
      console.error('Error starting recording:', error);
      Alert.alert('Error', 'Could not start recording. Please try again.');
    }
  };

  const pauseRecording = async () => {
    if (!recordingState.isPaused) {
      await audioRecorderPlayer.pauseRecorder();
      setRecordingState(prev => ({
        ...prev,
        isPaused: true,
        currentAction: 'resume',
      }));
    }
  };

  const resumeRecording = async () => {
    if (recordingState.isPaused) {
      await audioRecorderPlayer.resumeRecorder();
      setRecordingState(prev => ({
        ...prev,
        isPaused: false,
        currentAction: 'pause',
      }));
    }
  };

  const stopRecording = async () => {
    if (!recordingState.isPaused) {
      await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
    }

    const duration = recordingState.duration;
    dispatch(setRecordData({ recordingName, recordingPath, duration, transcription, highLightArr }));
    clearState();
    dispatch(modalHide());
    setTimeout(() => dispatch(saveModal()), 100);
  };

  const clearState = () => {
    setTranscription('');
    audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setHighLightArr([]);
    setIsHighLighting(false);
  };

  const saveRecording = async () => {
    await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    dispatch(modalHide());
    setTimeout(() => dispatch(saveModal()), 100);
    const duration = recordingState.duration;
    dispatch(setRecordData({ recordingName, recordingPath, duration, transcription, highLightArr }));
    clearState();
  };

  const modalClose = async () => {
    if (!recordingState.isPaused) {
      await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
    }
    clearState();
    dispatch(modalHide())
  }

  const handleHighLight = async () => {
    const currentTime = recordingState.duration;

    if (!isHighLighting) {
      setStartTime(currentTime);
    } else {
      if (startTime !== '') {
        const newHighlight: Highlight = {
          start_time: startTime,
          time: currentTime,
        };
        setHighLightArr((prevArr) => [...prevArr, newHighlight]);
      }
    }
    setIsHighLighting(!isHighLighting);
  };

  useEffect(() => {
    let wave: NodeJS.Timeout;
    if (!recordingState.isPaused) {
      wave = setInterval(() => {
        const newLevels = waveformLevels.map(level => {
          const newValue = Math.floor(Math.random() * (130 - 44 + 1)) + 44; // Random value between 44 and 130
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
  }, [recordingState.isPaused]);

  return (
    <Modal
      animationType="none"
      transparent
      visible={isVisible}
      onRequestClose={modalClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressOut={modalClose}
        style={styles.modalOverlay}>
        <StatusBar barStyle="light-content" backgroundColor="rgba(120, 126, 128, 1)" />

        <TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <View style={styles.modalTitlePart}>
              <Image source={require('../../../assets/images/record.png')} />
              <Text style={[styles.modalTitle, typography.h1]}>Record</Text>
            </View>
            <Text style={[styles.recordTitle, typography.h3]}>{`Recording_${dateNow}`}</Text>
            <View style={{ height: 190, paddingVertical: 25 }}>
              <BarWaveform levels={waveformLevels} />
            </View>
            <View style={styles.counterPart}>
              <Image source={require('../../../assets/images/clock.png')} />
              <Text style={[styles.counterText, typography.h3]}>{recordingState.duration}</Text>
            </View>
            <View style={styles.btnGroup}>
              {recordingState.currentAction === 'start' ? (
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: colors.green }]}
                  onPress={startRecording}
                >
                  {/* <Image source={require('../../../assets/images/play.png')} /> */}
                  <FontAwesomeIcon icon={faPlay} size={22} color={colors.white} />
                  <Text style={[styles.btnText, typography.h4, { fontWeight: 'bold' }]}>Start</Text>
                </TouchableOpacity>
              ) : recordingState.currentAction === 'pause' ? (
                <>
                  <View style={[styles.actionRow, { marginBottom: 15, gap: 10 }]}>
                    <TouchableOpacity
                      style={[styles.actionBtn, { flex: 1, backgroundColor: colors.lightred }]}
                      onPress={pauseRecording}
                    >
                      <FontAwesomeIcon icon={faPause} size={22} color={colors.white} />
                      <Text style={[styles.btnText, typography.h4]}>Pause</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, { flex: 1, backgroundColor: colors.red }]}
                      onPress={stopRecording}
                    >
                      <FontAwesomeIcon icon={faStop} size={20} color={colors.white} />
                      <Text style={[styles.btnText, typography.h4]}>Stop</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    onPress={handleHighLight}
                    style={[styles.hLightBtn, { backgroundColor: isHighLighting ? colors.green : colors.lightgreen }]}
                  >
                    <FontAwesomeIcon icon={faHighlighter} size={22} color={colors.white} />
                    <Text style={[styles.btnText, typography.h4]}>{isHighLighting ? 'Highlighting...' : 'Highlight'}</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={[styles.actionRow, { gap: 10 }]}>
                  <TouchableOpacity
                    style={[styles.actionBtn, { flex: 1, backgroundColor: colors.green }]}
                    onPress={resumeRecording}
                  >
                    <FontAwesomeIcon icon={faPlay} size={22} color={colors.white} />
                    <Text style={[styles.btnText, typography.h4]}>Resume</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, { flex: 1, backgroundColor: colors.lightgreen }]}
                    onPress={saveRecording}
                  >
                    <FontAwesomeIcon icon={faFloppyDisk} size={22} color={colors.white} />
                    <Text style={[styles.btnText, typography.h4]}>Save</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalTitlePart: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginBottom: 17,
  },
  modalTitle: {
    fontWeight: 'bold',
    color: colors.bandingblack,
  },
  recordTitle: {
    color: colors.secondary,
    fontWeight: '500',
  },
  counterPart: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  counterText: {
    color: colors.secondary,
    fontWeight: '500',
  },
  btnGroup: {
    width: '100%',
  },
  actionBtn: {
    paddingVertical: 15,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: colors.white,
    marginLeft: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  hLightBtn: {
    paddingVertical: 50,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: 15,
  }
});

export default RecordModal;
