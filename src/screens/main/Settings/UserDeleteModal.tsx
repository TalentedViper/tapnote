import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Modal,
    StatusBar,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { userDelete, userDeleteModalHide } from '../../../redux/actions/authAction';
import { RootState } from '../../../redux/reducers';

import { colors, typography } from '../../../styles';

const UserDeleteModal: React.FC = () => {

    const isVisible = useSelector((state: RootState) => state.auth.userDeleteModalisVisible);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const deletAccount = async () => {
        const result = await (dispatch as any)(userDelete());
        if(result.success){
            dispatch(userDeleteModalHide());
            navigation.navigate('Login');
        }
    };

    return (
        <Modal
            animationType="none" // Options: 'none', 'slide', 'fade'
            transparent={true}
            visible={isVisible}
            onRequestClose={() => dispatch(userDeleteModalHide())}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => dispatch(userDeleteModalHide())}
                style={styles.modalOverlay}>
                <StatusBar barStyle="light-content" backgroundColor="rgba(120, 126, 128, 1)" />
                <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                    <View style={styles.modal_title_part}>
                        <Text style={[styles.modal_title, typography.h1]}>Delete Account</Text>
                    </View>
                    <Text style={[styles.modal_title, typography.h3,{marginTop:20}]}>Are you sure?</Text>
                    <View style={{ marginTop: 24, flexDirection:'row', gap:50 }}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={[styles.folderCancelBtn, {justifyContent:'center'}]}
                            onPress={() => dispatch(userDeleteModalHide())}
                        >
                            <Text style={[styles.btn_text, typography.h4]}>No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={styles.folderOkBtn}
                            onPress={deletAccount}
                        >
                            <Text style={[styles.btn_text, typography.h4]}>Yes</Text>
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
        fontWeight: 'bold',
        color: colors.bandingblack,
    },
    btn_text: {
        color: colors.white,
        fontWeight: 'bold',
    },
    folderCancelBtn : {
        backgroundColor: colors.lightred,
        paddingHorizontal: 50,
        paddingVertical: 15,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        borderRadius: 30,
    },
    folderOkBtn: {
        backgroundColor: colors.green,
        paddingHorizontal: 50,
        paddingVertical: 15,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        borderRadius: 30,
    },
});

export default UserDeleteModal;
