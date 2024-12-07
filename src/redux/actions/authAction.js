// src/store/actions/authActions.js
import axios from 'axios';
import { fetchWithAuth } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../config';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const SIGNUP_FAILURE = 'SIGNUP_FAILURE';
export const OTP_SUCCESS = 'OTP_SUCCESS';
export const OTP_FAILURE = 'OTP_FAILURE';
export const OTP_RESEND_SUCCESS = 'OTP_RESEND_SUCCESS';
export const OTP_RESEND_FAILURE = 'OTP_RESEND_FAILURE';
export const PROFILE_EDIT_SUCCESS = 'PROFILE_EDIT_SUCCESS';
export const SECURITY_EDIT_SUCCESS = 'SECURITY_EDIT_SUCCESS';
export const CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS';
export const LOGOUT_MODAL_SHOW = 'LOGOUT_MODAL_SHOW';
export const LOGOUT_MODAL_HIDE = 'LOGOUT_MODAL_HIDE';
export const USER_DELETE_MODAL_SHOW = 'USER_DELETE_MODAL_SHOW';
export const USER_DELETE_MODAL_HIDE = 'USER_DELETE_MODAL_HIDE';
export const USER_DELETE_SUCCESS = 'USER_DELETE_SUCCESS';

export const APP_CLOSE_MODAL_SHOW = 'APP_CLOSE_MODAL_SHOW';
export const APP_CLOSE_MODAL_HIDE = 'APP_CLOSE_MODAL_HIDE';

export const signUp = ({first_name, last_name, email, password, device_type, device_token}) => async (dispatch) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/sign_up`, {
            first_name,
            last_name,
            email,
            password,
            device_type,
            device_token,
        });

        if (!response.data.success) {
            console.log("Sign up failed with response:", response.data);
            return response.data; // Returning the error response for further handling
        } else {
            console.log("xxx", response.data.data.email, response.data.data.otp);
            dispatch({
                type: SIGNUP_SUCCESS,
                payload: {
                    email: response.data.data.email,
                    otp: response.data.data.otp,
                },
            });
            return response.data; // Returning success response
        }
    } catch (error) {
        console.error("An error occurred during sign up:", error);
        return false; // Returning false to indicate failure
    }
};

export const userLogin = ({email, password, device_type, device_token, device_model, country='', location=''}) => async (dispatch) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, {
            email,
            password,
            device_type,
            device_token,
            device_model,
            country,
            location
        });
        if (response.data && response.data && response.data.data && response.data.data.token) {
            storeToken(response.data.data.token);
            storeUserData(response.data.data);
        }
        
        dispatch({
            type: LOGIN_SUCCESS,
            payload: {
                user: response.data.data,
                token: response.data.data.token,
            },
        });
        return response.data;
    } catch (error) {
        return false;
    }
};

export const socialLogin = ({first_name, last_name, email, device_type, device_token, device_model, country, location}, social_login_type) => async (dispatch) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/social_login`, {
            first_name,
            last_name,
            email,
            device_type,
            device_token,
            device_model,
            social_login_type,
            country,
            location
        });
        if (response.data && response.data && response.data.data && response.data.data.token) {
            storeToken(response.data.data.token);
            storeUserData(response.data.data);
        }
        dispatch({
            type: LOGIN_SUCCESS,
            payload: {
                user: response.data.data,
                token: response.data.data.token,
            },
        });
        return response.data;
    } catch (error) {
        return false;
    }
};

export const userLogOut = () => async (dispatch) => {
    return fetchWithAuth('get', '/logout', {})
    .then((response) => {
      if (response.success) {
        removeToken();
        storeUserData(response.data);
        return response;
        }
      throw new Error("Logout failed");
    })
    .catch((error) => {
      console.error("Logout error:", error);
      return false;
    });
};

export const verifyOtp = (data) => async (dispatch) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/verify_otp`, {
            email: data.email,
            otp: data.otp,
        });
        await AsyncStorage.setItem('token', response.data.data.token);
        dispatch({
            type: OTP_SUCCESS,
            payload: {
                user: response.data.data,
                token: response.data.data.token,
            },
        });
        return response.data;
    } catch {
        console.log("error occurs ");
        return false;
    }
}

export const resendCode = (email) => async (dispatch) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/resend_otp`, {
            email
        });
        dispatch({
            type: OTP_RESEND_SUCCESS,
            payload: {
                email: email,
                otp: response.data.data,
            }
        })
        return response.data;
    } catch {
        return false;
    }
}

export const isNotify = (email) => async () => {
    try {
        const response = await axios.post(`${API_BASE_URL}/push_notify`, {
            email
        });
        return response.data;
    } catch {
        console.log("error occurs");
        return false;
    }
}

export const storeToken = async (token) => {
    try {
        await AsyncStorage.setItem('token', token);
    } catch (e) {
        console.error('Failed to save the token.', e);
    }
};

export const storeUserData = async (user) => {
    try {
        await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (e) {
        console.error('Failed to save the user.', e);
    }
};

export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem('token');
    } catch (e) {
        console.error('Failed to remove the token.', e);
    }
}

export const getToken = async () => {
    try {
        return await AsyncStorage.getItem('token');
    } catch (e) {
        console.error('Failed to retrieve the token.', e);
    }
};

export const getUserData = async () => {
    try {
        return await AsyncStorage.getItem('user');
    } catch (e) {
        console.error('Failed to retrieve the user.', e);
    }
};

export const profileUpdate = (data) => async(dispatch) => {
    const formData = new FormData();
    if(data.profile_image !== ''){
        formData.append('profile_image', {
            uri: data.profile_image,
            type: 'image/*',
            name: 'img.png',
        });
    }
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('phone', data.phone);
    formData.append('date_of_birth', data.date_of_birth);
    formData.append('short_bio', data.short_bio);
    try {
        const token = await getToken();
        const response = await fetch(`${API_BASE_URL}/edit_profile`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        const jsonResponse = await response.json();
        if (jsonResponse.success) {
            dispatch({
                type : PROFILE_EDIT_SUCCESS,
                payload :{
                    user : jsonResponse.data,
                }
            })
        } else {
            console.error("Failed to create recording:", jsonResponse.message);
        }
        return jsonResponse;
    } catch {
        console.log("error occurs");
        return false;
    }
};

export const settingSecurityEdit = (type, value) => async (dispatch) => {
    try {
        const response = await fetchWithAuth('post', '/setting_security_edit', {type, value});
        if(response.success){
            dispatch({
                type : SECURITY_EDIT_SUCCESS,
                payload : {
                    user : response.data,
                }
            });
        }
        return response;
    } catch(error) {
        console.log("error", error);
    }
};


export const passwordChange = (old_password, new_password) => async (dispatch) => {
    try {
        const response = await fetchWithAuth('post', '/change_password', {old_password, new_password});
        if(response.success){
            dispatch({
                type : CHANGE_PASSWORD_SUCCESS,
                payload : {
                    user : response.data,
                }
            });
        }
        return response;
    } catch(error) {
        console.log("error", error);
    }
};

export const logOutModalShow = () => ({
    type: LOGOUT_MODAL_SHOW,
});

export const logOutModalHide = () => ({
    type: LOGOUT_MODAL_HIDE,
});

export const userDeleteModalShow = () => ({
    type : USER_DELETE_MODAL_SHOW,
})

export const userDeleteModalHide = () => ({
    type : USER_DELETE_MODAL_HIDE,
})


export const passwordForgot = (email) => async (dispatch) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/forgot_password`, {email});
        return response.data;
    } catch {
        console.log("error occurs ");
        return false;
    }
}

export const passwordReset = (email, password, confirm_password) => async (dispatch) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/reset_password`, {email, password, confirm_password});
        return response.data;
    } catch {
        console.log("error occurs ");
        return false;
    }
} 

export const userDelete = () => async (dispatch) => {
    try {
        const response = await fetchWithAuth('get', '/delete_account', {});
        if(response.success){
            removeToken();
            dispatch({
                type : USER_DELETE_SUCCESS,
            });
        }
        return response;
    } catch(error) {
        console.log("error", error);
    }
};


export const setUserData = (data) => async(dispatch) => {
    dispatch({
        type: LOGIN_SUCCESS,
        payload: {
            user: data
        },
    });
}

export const closeModalShow = () => ({
    type : APP_CLOSE_MODAL_SHOW,
})

export const closeModalHide = () => ({
    type : APP_CLOSE_MODAL_HIDE,
})

export const googlePay = (token, order_id, amount) => async(dispatch) => {
      try {
        const response = await fetchWithAuth('post', '/purchase_subscription', {token, order_id, amount});
        if(response.success){
            dispatch({
                type : USER_DELETE_SUCCESS,
            });
        }
        return response;
    } catch(error) {
        console.log("error", error);
    }
};