import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity, Platform, StatusBar, TouchableWithoutFeedback } from 'react-native';
import RNFS from 'react-native-fs';
import { RootState } from '../../../redux/reducers';
import { modalHide, saveRecording } from '../../../redux/actions/home/saveRecordingActions';
import { resetRecordName } from '../../../redux/actions/home/recordModalActions';
import { modalShow as modal_show } from '../../../redux/actions/home/chooseFolderModalActions';


import { colors, typography } from '../../../styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleXmark, faSave, faX } from '@fortawesome/free-solid-svg-icons';

const save_record = require('../../../assets/images/save-record.png');

const SaveRecordingModal: React.FC = () => {
    const dispatch = useDispatch();
    const [inputValue, setInputValue] = useState('');
    const isVisible = useSelector((state: RootState) => state.saveRecording.modalVisible);
    const formData = useSelector((state: RootState) => state.record.formData);

    useEffect(() => {
        setInputValue('');
    }, [isVisible])

    const cleanInput = () => {
        setInputValue('');
    }

    const inputHandleChange = (value: string) => {
        setInputValue(value);
    };

    const renameAudioFile = async (currentPath: string, newName: string) => {
        try {
            const newPath = `file://${RNFS.DocumentDirectoryPath}/${newName}.mp3`;
            await RNFS.moveFile(`file://${currentPath}`, newPath); // Rename the file by moving it
            return newPath; // Return the new file path
        } catch (error) {
            console.error("Error renaming file:", error);
        }
    };

    const recordingSave = async () => {
        // Create a copy of formData to avoid mutating Redux state directly
        const updatedFormData = { ...formData };

        if (inputValue !== '') {
            updatedFormData.recording_path = await renameAudioFile(formData.recording_path, inputValue);
            updatedFormData.recording_name = inputValue;
        }

        // Dispatch with the updated form data
        const result = await (dispatch as any)(saveRecording(updatedFormData));

        if (result.success) {
            setInputValue('');
            dispatch(modalHide());
            setTimeout(() => {
                dispatch(modal_show(result.data.id));
            }, 100);
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
                            {/* <Image source={save_record} /> */}
                            <FontAwesomeIcon icon={faSave} size={25} color={colors.lightgreen} />
                            <Text style={[styles.modal_title, typography.h1]}>Save Recording</Text>
                        </View>
                        <Text style={[styles.record_title, typography.h3]}>Recording Name</Text>
                        <View style={styles.input_part}>
                            <TextInput
                                style={styles.input}
                                value={inputValue}
                                placeholder={formData.recording_name}
                                placeholderTextColor='#666666'
                                onChangeText={inputHandleChange}
                            />
                            <TouchableOpacity
                                onPress={cleanInput}
                            >
                                <FontAwesomeIcon icon={faCircleXmark} size={15} color='#666666' />
                            </TouchableOpacity>
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
                                onPress={recordingSave}
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
    input_part: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 13,
        paddingVertical: 0,
        borderRadius: 30,
        borderColor: colors.gray,
        borderWidth: 1,
        marginTop: 5,
        marginBottom: 15,
    },
    input: {
        fontFamily: 'Poppins',
        fontStyle: 'normal',
        fontWeight: '400',
        color: colors.bandingblack,
        flex: 1,
        fontSize: 18,
        lineHeight: 27,
    },
    action_btn: {
        paddingVertical: 15,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    btn_text: {
        color: colors.white,
        fontWeight: 'bold',
    },
});

export default SaveRecordingModal;
