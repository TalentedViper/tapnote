import { 
    SET_ALL_RECORDING,
    DELETE_MODAL_SHOW,
    DELETE_MODAL_HIDE,
    EDIT_MODAL_SHOW,
    EDIT_MODAL_HIDE,
    SET_FOLDER_RECORDING,
} from '../../actions/note/noteActions';

const initialState = {
    allRecordings: null,
    folderRecordings : null,
    deleteModal : {
        isVisible : false,
        del_id : null,
    },
    editModal : {
        isVisible : false,
        edit_id : null,
        recording_name : null,
    }
};

const noteReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ALL_RECORDING:
            return {
                ...state,
                allRecordings: action.payload.allrecording,
            };

         case SET_FOLDER_RECORDING:
            return {
                ...state,
                folderRecordings: action.payload.folderRecordings,
            };
        
        case DELETE_MODAL_SHOW:
            return {
                ...state,
                deleteModal : {
                    isVisible : true,
                    del_id : action.payload.del_id,
                }
            };
        case DELETE_MODAL_HIDE:
            return {
                ...state,
                deleteModal : {
                    isVisible : false,
                    del_id : null,
                }
            };
        case EDIT_MODAL_SHOW :
            return {
                ...state,
                editModal :{
                    isVisible : true,
                    edit_id : action.payload.edit_id,
                    recording_name : action.payload.recording_name,
                }
            }
        case EDIT_MODAL_HIDE :
            return {
                ...state,
                editModal :{
                    isVisible : false,
                    edit_id : null,
                    recording_name : null
                }
            }
        default:
            return state;
    }
};

export default noteReducer;
