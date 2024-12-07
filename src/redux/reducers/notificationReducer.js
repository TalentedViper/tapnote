import { 
    SET_ALL_NOTIFICATION,
    DELETE_MODAL_SHOW,
    DELETE_MODAL_HIDE,
} from '../actions/notificationActions';

const initialState = {
    allNotification: null,
    deleteModal :{
        id : null,
        isVisible : false,
    }
};

const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ALL_NOTIFICATION:
            return {
                ...state,
                allNotification: action.payload.allNotification,
            };

        case DELETE_MODAL_SHOW :
            return {
                ...state,
                deleteModal :{
                    id : action.payload.del_id,
                    isVisible : true,
                }
            }
        case DELETE_MODAL_HIDE :
            return {
                ...state,
                deleteModal :{
                    id : null,
                    isVisible : false,
                }
            }
        default:
            return state;
    }
};

export default notificationReducer;
