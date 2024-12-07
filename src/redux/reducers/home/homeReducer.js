import { 
    SET_ALL_RECORDING,
    SET_SHARE_RECORDING,
    SET_FLTER_RECORDING,
    DELETE_MODAL_SHOW,
    DELETE_MODAL_HIDE,
    EDIT_MODAL_SHOW,
    EDIT_MODAL_HIDE,
    SET_FOLDER_RECORDING,
    SET_RECORDING_DETAIL,
    ALL_USERS,
} from '../../actions/home/homeAction';

const initialState = {
    allRecordings: null,
    folderRecordings : null,
    recordingDetail : null,
    allUsers : null,
    shareRecordings:null,
    deleteModal : {
        isVisible : false,
        item : null,
    },
    editModal : {
        isVisible : false,
        edit_type : null,
        edit_id : null,
        recording_name : null,
    }
};

const homeReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ALL_RECORDING:
            return {
                ...state,
                allRecordings: action.payload.allrecording,
            };
        case SET_RECORDING_DETAIL:
            return {
                ...state,
                recordingDetail: action.payload.recordingDetail,
            }
        case SET_SHARE_RECORDING:{
            return {
                ...state,
                shareRecordings: action.payload.shareRecordins,
            }
        }
        case SET_FLTER_RECORDING:
            return {
                ...state,
                allRecordings: action.payload.allrecording,
            };
        case ALL_USERS:
            return {
                ...state,
                allUsers : action.payload.allUsers
            }
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
                    item : action.payload.item,
                }
            };
        case DELETE_MODAL_HIDE:
            return {
                ...state,
                deleteModal : {
                    isVisible : false,
                    item : null,
                }
            };
        case EDIT_MODAL_SHOW :
            return {
                ...state,
                editModal :{
                    isVisible : true,
                    edit_type : action.payload.edit_type,
                    edit_id : action.payload.edit_id,
                    recording_name : action.payload.recording_name,
                }
            }
        case EDIT_MODAL_HIDE :
            return {
                ...state,
                editModal :{
                    isVisible : false,
                    edit_type : null,
                    edit_id : null,
                    recording_name : null
                }
            }
        default:
            return state;
    }
};

export default homeReducer;
