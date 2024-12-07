// src/redux/actions/saveRocordingModalActions.js
export const CHOOSE_FOLDER_MODAL_SHOW = 'CHOOSE_FOLDER_MODAL_SHOW';
export const CHOOSE_FOLDER_MODA_LHIDE = 'CHOOSE_FOLDER_MODA_LHIDE';

export const modalShow = (recording_id) => ({
    type: CHOOSE_FOLDER_MODAL_SHOW,
    payload:{
        recording_id,
    }
});

export const modalHide = () => ({
    type: CHOOSE_FOLDER_MODA_LHIDE,
});
