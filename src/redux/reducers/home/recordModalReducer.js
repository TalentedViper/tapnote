// src/redux/reducers/recordModalReducer.js
import { RECORDMODALSHOW, 
    RECORDMODALHIDE, 
    SET_FORM_DATA, 
    RESET_RECORD_NAME } from '../../actions/home/recordModalActions';

const initialState = {
    modalVisible : false,
    formData : {
        file:{
            uri : null,
            type: 'audio/wav',
            name : null,
        },
        recording_name : null,
        recording_path : null,
        duration : '',
        transcription : null,
        highArr:null,
    },
};

const recordModalReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECORDMODALSHOW:
            return { 
                ...state,
                modalVisible : true,
            };
        case RECORDMODALHIDE:
            return {
                ...state,
                modalVisible: false,
            };
        case SET_FORM_DATA:
            return {
                ...state,
                formData : {
                    recording_name : action.payload.recordName,
                    recording_path : action.payload.recordPath,
                    duration : action.payload.duration,
                    transcription : action.payload.transcription,
                    highArr : action.payload.highArr,
                },
            }
        case RESET_RECORD_NAME:
            return {
                ...state,
                formData : {
                    recording_path : action.payload.recordPath,
                    duration : action.payload.duration,
                    transcription : action.payload.transcription,
                    recording_name : action.payload.recordName,
                }
            }
        default:
            return state;
    }
};

export default recordModalReducer;
