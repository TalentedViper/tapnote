import { data } from 'autoprefixer';
import { fetchWithAuth } from '../api';
export const SET_ALL_RECORDING = 'SET_ALL_RECORDING';
export const DELETE_MODAL_SHOW = 'DELETE_MODAL_SHOW';
export const DELETE_MODAL_HIDE = 'DELETE_MODAL_HIDE';
export const EDIT_MODAL_SHOW = 'EDIT_MODAL_SHOW';
export const EDIT_MODAL_HIDE = 'EDIT_MODAL_HIDE';
export const SET_FOLDER_RECORDING = 'SET_FOLDER_RECORDING';

export const getAllRecording = (period = '', sortType='asc') => async (dispatch) => {
    try {
        const response = await fetchWithAuth('post', '/get_all_recording', {period, sortType});
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

export const recordEdit = (recording_id, recording_name) => async (dispatch) => {
    try {
        const response = await fetchWithAuth('post', '/update_recording', {recording_id, recording_name});
        if(response.success){
            dispatch(getAllRecording());
        }
        return response;
    } catch(error) {
        console.log("error", error);
    }
};

export const notesDelete = (recording_id) => async (dispatch) => {
    try {
        const response = await fetchWithAuth('post', '/delete_recording_notes', {recording_id});
        return response;
    } catch(error) {
        console.log("error", error);
    }
}


export const delModalShow = (del_id) => (
    {
        type : DELETE_MODAL_SHOW,
        payload : {
            del_id,
        }
    }
)

export const delModalHide = () => (
    {
        type : DELETE_MODAL_HIDE,
    }
)