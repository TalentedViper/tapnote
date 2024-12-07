import { fetchWithAuth } from '../api';
export const SET_ALL_RECORDING = 'SET_ALL_RECORDING';
export const SET_SHARE_RECORDING = 'SET_SHARE_RECORDING';
export const SET_FLTER_RECORDING = 'SET_FLTER_RECORDING';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const DELETE_MODAL_SHOW = 'DELETE_MODAL_SHOW';
export const DELETE_MODAL_HIDE = 'DELETE_MODAL_HIDE';
export const EDIT_MODAL_SHOW = 'EDIT_MODAL_SHOW';
export const EDIT_MODAL_HIDE = 'EDIT_MODAL_HIDE';
export const SET_FOLDER_RECORDING = 'SET_FOLDER_RECORDING';
export const SET_RECORDING_DETAIL = 'SET_RECORDING_DETAIL';
export const ALL_USERS = 'ALL_USERS';

export const getAllRecording = () => async (dispatch) => {
    try {
        const response = await fetchWithAuth('post', '/get_all_recording');
        dispatch({
            type: SET_ALL_RECORDING,
            payload: {
                allrecording: response.data,
            }
        })
    } catch(error) {
        console.log("error", error);
    }
}

export const getRecordingDetails = (recording_id) => async (dispatch) => {
    try {
        const response = await fetchWithAuth('post', '/get_recording_detail', {recording_id});
        if(response.success){
            dispatch({
                type: SET_RECORDING_DETAIL,
                payload: {
                    recordingDetail: response.data,
                }
            })
        }
        return response;
    } catch(error) {
        console.log("error", error);
    }
}

export const getFilterRecording = (period = '', sortType='asc') => async (dispatch) => {
    try {
        const response = await fetchWithAuth('post', '/get_all_recording', {period, sortType});
        dispatch({
            type: SET_FLTER_RECORDING,
            payload: {
                allrecording: response.data,
            }
        })
    } catch(error) {
        console.log("error", error);
    }
}

export const getFilterShareRecording = (type = 1) => async (dispatch) => {
    try {
        const response = await fetchWithAuth('post', '/get_share_list', {type});
        dispatch({
            type: SET_SHARE_RECORDING,
            payload: {
                shareRecordins: response.data,
            }
        })
    } catch(error) {
        console.log("error", error);
    }
}

export const getFolderRecording = (folder_id) => async (dispatch) => {
    try {
        const response = await fetchWithAuth('post', '/get_folder_detail', {folder_id});
        dispatch({
            type: SET_FOLDER_RECORDING,
            payload: {
                folderRecordings: response.data.folder_detail.map(folder => folder.recordings)
            }
        })
    } catch(error) {
        console.log("error", error);
    }
}

export const folderChoose = (folder_id, recording_id) => async (dispatch) => {
    try {
        const response = await fetchWithAuth('post', '/move_recording', {folder_id, recording_id});
        return response;
    } catch(error) {
        console.log("error", error);
    }
}

export const recordEdit = (recording_id, recording_name, edit_type = 'home', folder_id = null) => async (dispatch) => {
    try {
        const response = await fetchWithAuth('post', '/update_recording', {recording_id, recording_name});
        if(response.success){
            dispatch(getAllRecording());
            if(edit_type !== 'home'){
                dispatch(getFolderRecording(folder_id));
            }
        }
        return response;
    } catch(error) {
        console.log("error", error);
    }
};

export const recordingDelete = (recording_id, type = 4, from = 'home', folder_id = null) => async (dispatch) => {
    try {
        const response = await fetchWithAuth('post', '/delete_recording', {recording_id, type});
        if(response.success){
            if(from === 'home'){
                dispatch(getAllRecording());
            }else{
                dispatch(getFolderRecording(folder_id));
            }
        }
        return response;
    } catch(error) {
        console.log("error", error);
    }
}

export const editModalShow = (edit_id, recording_name, edit_type = 'home') => ({
    type : EDIT_MODAL_SHOW,
    payload : {
        edit_type,
        edit_id,
        recording_name,
    }
})

export const editModalHide = () => ({
    type : EDIT_MODAL_HIDE
})

export const delModalShow = (item) => (
    {
        type : DELETE_MODAL_SHOW,
        payload : {
            item,
        }
    }
)

export const delModalHide = () => (
    {
        type : DELETE_MODAL_HIDE,
    }
)

export const addNote = (recording_id, note) => async (dispatch) => {
    try {
        const response = await fetchWithAuth('post', '/add_recording_note', {recording_id, note});
        if(response.success){
            dispatch(getRecordingDetails(recording_id));
        }
    } catch(error) {
        console.log("error", error);
    }
}

export const getAllUsers = () => async (dispatch) => {
    try {
        const response = await fetchWithAuth('post', '/get_all_users' );
        if(response.success){
            dispatch({
                type : ALL_USERS,
                payload : {
                    allUsers : response.data
                }
            })
        }
    } catch(error) {
        console.log("error", error);
    }
}

export const shareRecording = (rec_id, rec_type = 1, share_user_list) => async (dispatch) => {
    try {
        const response = await fetchWithAuth('post', '/share_recording', {rec_id, rec_type, share_user_list} );
        return response;
    } catch(error) {
        console.log("error", error);
    }
}