// src/redux/reducers/chooseFolderModalReducer.js
import { CHOOSE_FOLDER_MODAL_SHOW, CHOOSE_FOLDER_MODA_LHIDE } from '../../actions/home/chooseFolderModalActions';

const initialState = {
    modalVisible : false,
    recording_id : null,
};

const chooseFolderModalReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHOOSE_FOLDER_MODAL_SHOW:
            return { 
                modalVisible : true,
                recording_id : action.payload.recording_id,
            };
        case CHOOSE_FOLDER_MODA_LHIDE:
            return {
                modalVisible: false,
                recording_id : null,
            };
        default:
            return state;
    }
};

export default chooseFolderModalReducer;
