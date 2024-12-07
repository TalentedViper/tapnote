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
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { delModalHide, folderDelete } from '../../../redux/actions/folderAction';
import {recordingDelete} from '../../../redux/actions/home/homeAction';
import { RootState } from '../../../redux/reducers';

import { colors, typography } from '../../../styles';
import { Root } from 'postcss';

const folder_icon = require('../../../assets/images/new-folder.png');

const DeleteModal: React.FC = () => {
    const delModal = useSelector((state: RootState) => state.folder.deleteModal);
    const folder_id = useSelector((state:RootState) => state.folder.folder_id);
    const dispatch = useDispatch();

    const deleteFolder = async () => {
        if(delModal.del_type === 'folder'){
            const result = await (dispatch as any)(folderDelete(delModal.id));
            console.log("res", result);
            if(result.success){
                dispatch(delModalHide());
            }        
        }else{
            const result = await (dispatch as any)(recordingDelete(delModal.id, 1, 'folder', folder_id));
            if(result.success){
                dispatch(delModalHide());
            }
        }
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
                        <FontAwesomeIcon icon={faTrash} size={22} color={colors.secondary} />
                        <Text style={[styles.modal_title, typography.h1, {fontWeight:'bold'}]}>
                            {delModal.del_type === 'folder' ? 'Delete Folder' : 'Delete Recording'}
                        </Text>
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
                            onPress={deleteFolder}
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
