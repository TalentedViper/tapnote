import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    StatusBar,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useSelector, useDispatch } from 'react-redux';
import { BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { closeModalHide } from '../redux/actions/authAction';
import { RootState } from '../redux/reducers';

import { colors, typography } from '../styles';


const log_out = require('../assets/images/log-out.png');

const AppCloseModal: React.FC = () => {
    const isVisible = useSelector((state: RootState) => state.auth.isVisibleCloseModal);
    const dispatch = useDispatch();

    const appClose = async () => {
        dispatch(closeModalHide());
        BackHandler.exitApp();
        return true;
    };

    return (
        <Modal
            animationType="none" // Options: 'none', 'slide', 'fade'
            transparent={true}
            visible={isVisible}
            onRequestClose={() => dispatch(closeModalHide())}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => dispatch(closeModalHide())}
                style={styles.modalOverlay}>
                <StatusBar barStyle="light-content" backgroundColor="rgba(120, 126, 128, 1)" />
                <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                    <View style={styles.modal_title_part}>
                        <Text style={[styles.modal_title, typography.h1, {fontWeight:'bold'}]}>Exit?</Text>
                    </View>
                    <Text style={[styles.modal_title, typography.h4,{marginTop:20}]}>Do you want to exit the application?</Text>
                    <View style={{ marginTop: 24, gap:30, flexDirection:'row', justifyContent:'space-between'}}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={[styles.folderCancelBtn]}
                            onPress={() =>  dispatch(closeModalHide())}
                        >
                            <Text style={[styles.btn_text, typography.h4]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={styles.folderOkBtn}
                            onPress={appClose}
                        >
                            <Text style={[styles.btn_text, typography.h4]}>Exit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 20,
        position: 'relative',
    },
    title_part: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 7,
    },
    title: {
        fontWeight: 'bold',
        color: colors.black,
    },
    filter_icon: {
        width: 20,
        height: 20,
    },
    action_btn: {
        height: 23,
        width: 23,
    },

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
        padding: 10,
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
    },
    modal_title: {
        color: colors.bandingblack,
    },
    btn_text: {
        color: colors.white,
        fontWeight: 'bold',
    },
    folderCancelBtn : {
        backgroundColor: colors.lightred,
        paddingHorizontal: 30,
        paddingVertical: 15,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        borderRadius: 30,
    },
    folderOkBtn: {
        paddingHorizontal: 30,
        backgroundColor: colors.green,
        paddingVertical: 15,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        borderRadius: 30,
    },
});

export default AppCloseModal;
