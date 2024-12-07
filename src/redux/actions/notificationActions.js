import { fetchWithAuth } from './api';
export const SET_ALL_NOTIFICATION = 'SET_ALL_NOTIFICATION';
export const DELETE_MODAL_SHOW = 'DELETE_FOLDER_MODAL_SHOW';
export const DELETE_MODAL_HIDE = 'DELETE_FOLDER_MODAL_Hide';

export const getUserNotification = () => async (dispatch) => {
    try {
        const response = await fetchWithAuth('post', '/get_user_notifications');
        dispatch({
            type: SET_ALL_NOTIFICATION,
            payload: {
                allNotification: response.data,
            }
        })

    } catch(error) {
        console.log("error", error);
    }
}

export const notificationUpdate = (notification_id) => async (dispatch) => {
    try{
        const response = await fetchWithAuth('post', '/edit_user_notification', {notification_id});
        // console.log("response", response.data);
        if(response.data){
            dispatch(getUserNotification());
        }
        return response;
    }catch{
        console.log("error", error);
    }
}


export const deleteNotification = (notification_id) => async (dispatch) => {
    try{
        const response = await fetchWithAuth('post', '/delete_user_notification', {notification_id});
        if(response.success){
            dispatch(getUserNotification());
        }
        return response;
    }catch{
        console.log("error", error);
    }
}


export const deleteModalShow = (del_id, del_type) => ({
    type : DELETE_MODAL_SHOW,
    payload :{
        del_id,
        del_type,
    }
})

export const delModalHide = () => ({
    type: DELETE_MODAL_HIDE,
});