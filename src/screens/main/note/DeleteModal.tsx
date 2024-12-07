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
import { delModalHide, notesDelete } from '../../../redux/actions/note/noteActions';
import { RootState } from '../../../redux/reducers';
import Toast from 'react-native-toast-message';
import { colors, typography } from '../../../styles';

const record_play = require('../../../assets/images/l-record.png');

const DeleteModal: React.FC = () => {

    const delModal = useSelector((state: RootState) => state.note.deleteModal);
    const dispatch = useDispatch();
    const deleteNotes = async () => {
        const result = await (dispatch as any)(notesDelete(delModal.del_id));
        if(result.success){
            Toast.show({
                type:'success',
                text1:result.message
            })
        } else{
            Toast.show({
                type:'error',
                text1:result.message
            })
        }
        
        dispatch(delModalHide());
    }
    return (
        <Modal
            animationType="none" // Options: 'none', 'slide', 'fade'
            transparent={true}
            visible={delModal.isVisible}
            onRequestClose={() => dispatch(delModalHide())}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => dispatch(delModalHide())}
                style={styles.modalOverlay}>
                <StatusBar barStyle="light-content" backgroundColor="rgba(120, 126, 128, 1)" />
                <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                    <View style={styles.modal_title_part}>
                        <Image source={record_play} style={{ width: 30, height: 30 }} />
                        <Text style={[styles.modal_title, typography.h1]}>Delete Recording Notes</Text>
                    </View>
                    <Text style={[styles.modal_title, typography.h3,{marginTop:20}]}>Are you sure?</Text>
                    <View style={{ marginTop: 24, flexDirection:'row', gap:50 }}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={[styles.folderCancelBtn, {justifyContent:'center'}]}
                            onPress={() => dispatch(delModalHide())}
                        >
                            <Text style={[styles.btn_text, typography.h4]}>No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={styles.folderOkBtn}
                            onPress={deleteNotes}
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

export default DeleteModal;
