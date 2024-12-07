import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleXmark, faSave, faCompactDisc } from '@fortawesome/free-solid-svg-icons';
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity, StatusBar, TouchableWithoutFeedback } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import { RootState } from '../../../redux/reducers';
import { editModalHide, recordEdit } from '../../../redux/actions/home/homeAction';

import { colors, typography } from '../../../styles';

const RecordingEdit: React.FC = () => {
    const dispatch = useDispatch();
    const editModal = useSelector((state: RootState) => state.home.editModal);
    const folder_id = useSelector((state: RootState) => state.folder.folder_id);

    const validationSchema = Yup.object().shape({
        recordName: Yup.string().required('Recording name is required')
    });

    const editRecording = async (values: any) => {
        if (editModal.recording_name !== values.recordName) {
            const result = await (dispatch as any)(recordEdit(editModal.edit_id, values.recordName, editModal.edit_type, folder_id));
            if (!result.success) {
                Toast.show({
                    type: 'error',
                    text1: result.message
                })
            }
        }
        dispatch(editModalHide());

    };

    return (
        <Modal
            animationType="none" // Options: 'none', 'slide', 'fade'
            transparent={true}
            visible={editModal.isVisible}
            onRequestClose={() => dispatch(editModalHide())}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => dispatch(editModalHide())}
                style={styles.modalOverlay}>
                <StatusBar barStyle="light-content" backgroundColor="rgba(120, 126, 128, 1)" />
                <TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                        <View style={styles.modal_title_part}>
                            <FontAwesomeIcon icon={faCompactDisc} size={25} color='#FF507D' />
                            <Text style={[styles.modal_title, typography.h1]}>Edit Recording</Text>
                        </View>
                        <Text style={[styles.record_title, typography.h3, { marginBottom: 5 }]}>Recording Name</Text>
                        <Formik
                            initialValues={{ recordName: editModal.recording_name }}
                            validationSchema={validationSchema}
                            onSubmit={editRecording}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                                <>
                                    <View style={styles.input_part}>
                                        <TextInput
                                            placeholder="Input recording name"
                                            keyboardAppearance="light"
                                            placeholderTextColor={colors.place_text}
                                            style={styles.input}
                                            onChangeText={handleChange('recordName')}
                                            onBlur={handleBlur('recordName')}
                                            value={values.recordName}
                                        />
                                        <TouchableOpacity
                                            onPress={() => {
                                                setFieldValue('recordName', '');
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faCircleXmark} size={15} color='#666666' />
                                        </TouchableOpacity>
                                    </View>
                                    {touched.recordName && typeof errors.recordName === 'string' ? (
                                        <Text style={styles.errorText}>{errors.recordName}</Text>
                                    ) : null}
                                    <View style={{ flexDirection: 'row', gap: 14, marginTop: 15 }}>
                                        <TouchableOpacity
                                            activeOpacity={0.9}
                                            style={[styles.action_btn, { flex: 1, backgroundColor: colors.red }]}
                                            onPress={() => dispatch(editModalHide())}
                                        >
                                            <FontAwesomeIcon icon={faCircleXmark} color={colors.white} size={20} />
                                            <Text style={[styles.btn_text, typography.h4]}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            activeOpacity={0.9}
                                            style={[styles.action_btn, { flex: 1, backgroundColor: colors.green }]}
                                            onPress={() => handleSubmit()}
                                        >
                                            <FontAwesomeIcon icon={faSave} size={20} color={colors.white} />
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
    errorText: {
        color: colors.red,
        marginVertical: 5,
        fontSize: 12,
        fontFamily: 'Poppins',
        fontWeight: '400',
    },
});

export default RecordingEdit;
