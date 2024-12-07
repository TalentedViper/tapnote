// src/redux/reducers/authReducer.js
import { 
    LOGIN_SUCCESS, 
    LOGIN_FAILURE,
    SIGNUP_SUCCESS,
    SIGNUP_FAILURE,
    OTP_SUCCESS,
    OTP_RESEND_SUCCESS,
    LOGOUT,
    PROFILE_EDIT_SUCCESS,
    SECURITY_EDIT_SUCCESS,
    CHANGE_PASSWORD_SUCCESS,
    LOGOUT_MODAL_SHOW,
    LOGOUT_MODAL_HIDE,
    USER_DELETE_MODAL_SHOW,
    USER_DELETE_MODAL_HIDE,
    USER_DELETE_SUCCESS,
    APP_CLOSE_MODAL_SHOW,
    APP_CLOSE_MODAL_HIDE,
} from '../actions/authAction';

const initialState = {
    user: null,
    token: null,
    logoutModalisVisible : false,
    userDeleteModalisVisible : false,
    isVisibleCloseModal : false, 
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case SIGNUP_SUCCESS :
            return {
                ...state,
                user: action.payload
                
            }
        case OTP_SUCCESS : 
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
            };
        
        case OTP_RESEND_SUCCESS : 
            return {
                ...state,
                user : action.payload
            }
        
        case LOGOUT:
            return {
                ...state,
                user: null,
                token: null,
                error: null,
            };

        case PROFILE_EDIT_SUCCESS:
            return {
                ...state,
                user : action.payload.user
            }
        case SECURITY_EDIT_SUCCESS:
            return {
                ...state,
                user : action.payload.user
            }
        case CHANGE_PASSWORD_SUCCESS:
            return {
                ...state,
                user : action.payload.user
            }
        case LOGOUT_MODAL_SHOW:
            return {
                ...state,
                logoutModalisVisible : true
            }
        case LOGOUT_MODAL_HIDE:
            return {
                ...state,
                logoutModalisVisible : false
            }
        case USER_DELETE_MODAL_SHOW:
            return {
                ...state,
                userDeleteModalisVisible : true
            }
        case USER_DELETE_MODAL_HIDE:
            return {
                ...state,
                userDeleteModalisVisible : false
            }

        case APP_CLOSE_MODAL_SHOW :
            return{
                ...state,
                isVisibleCloseModal : true,
            }

        case APP_CLOSE_MODAL_HIDE :
            return{
                ...state,
                isVisibleCloseModal : false,
            }
        default:
            return state;
    }
};

export default authReducer;
