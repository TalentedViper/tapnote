// src/redux/actions/recordModalActions.js
export const RECORDMODALSHOW = 'RECORDMODALSHOW';
export const RECORDMODALHIDE = 'RECORDMODALHIDE';
export const SET_FORM_DATA = 'SET_FORM_DATA';
export const RESET_RECORD_NAME = 'RESET_RECORD_NAME';

export const modalShow = () => ({
    type: RECORDMODALSHOW,
});

export const modalHide = () => ({
    type: RECORDMODALHIDE,
});

export const setRecordData = (data) => (
    {
        type : SET_FORM_DATA,
        payload : {
            recordName : data.recordingName,
            recordPath : data.recordingPath,
            duration : data.duration,
            transcription : data.transcription,
            highArr : data.highLightArr,
        }
    }
);

export const resetRecordName = (recordName) => (
    {
        type : RESET_RECORD_NAME,
        payload : recordName
    }
)
