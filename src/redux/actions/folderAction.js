import { fetchWithAuth } from './api';
export const SET_ALL_FOLDER = 'SET_ALL_FOLDER';
export const DELETE_FOLDER_MODAL_SHOW = 'DELETE_FOLDER_MODAL_SHOW';
export const DELETE_FOLDER_MODAL_HIDE = 'DELETE_FOLDER_MODAL_Hide';
export const SET_FOLDER_ID = 'SET_FOLDER_ID';
// export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const createFolder = (folder_name) => async () => {
    try {
        const response = await fetchWithAuth('post', '/create_folder', {folder_name});
        return response;
    } catch(error) {
        console.log("error", error);
    }
}

export const getAllFolder = () => async (dispatch) => {
    try {
        const response = await fetchWithAuth('post', '/get_all_folder');
        dispatch({
            type: SET_ALL_FOLDER,
            payload: {
                allfolder: response.data,
            }
        })
    } catch(error) {
        console.log("error", error);
    }
}

export const folderDelete = (folder_id) => async (dispatch) => {
    try{
        const response = await fetchWithAuth('post', '/delete_folder', {folder_id});
        if(response.success){
            dispatch(getAllFolder());
        }
        return response;
    }catch{
        console.log("error", error);
    }
}

export const editingFolder = (folder_id, folder_name) => async () => {
    try{
        const response = await fetchWithAuth('post', '/edit_folder', {folder_id, folder_name});
        return response;
    }catch{
        console.log("error", error);
    }
}

export const FolderID = (folder_id) => ({
    type: SET_FOLDER_ID,
    payload : {
        folder_id
    }
})

export const deleteModalShow = (del_id, del_type) => ({
    type : DELETE_FOLDER_MODAL_SHOW,
    payload :{
        del_id,
        del_type,
    }
})

export const delModalHide = () => ({
    type: DELETE_FOLDER_MODAL_HIDE,
});