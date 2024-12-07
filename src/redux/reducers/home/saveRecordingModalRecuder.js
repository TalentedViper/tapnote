// src/redux/reducers/saveRecordingModalReducer.js
import { SAVE_RECORDING_MODAL_SHOW, SAVE_RECORDING_MODA_LHIDE } from '../../actions/home/saveRecordingActions';

const initialState = {
    modalVisible : false,
};

const saveRecordingModalReducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_RECORDING_MODAL_SHOW:
            return { 
                ...state,
                modalVisible : true,
            };
        case SAVE_RECORDING_MODA_LHIDE:
            return {
                ...state,
                modalVisible: false,
            };
        default:
            return state;
    }
};

export default saveRecordingModalReducer;
