import { 
    SET_ALL_FOLDER,
    DELETE_FOLDER_MODAL_SHOW,
    DELETE_FOLDER_MODAL_HIDE,
    SET_FOLDER_ID,
} from '../actions/folderAction';

const initialState = {
    allFolder: null,
    folder_id : null,
    deleteModal :{
        del_type: null,
        id : null,
        isVisible : false,
    }
};

const folderReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ALL_FOLDER:
            return {
                ...state,
                allFolder: action.payload.allfolder,
            };

        case DELETE_FOLDER_MODAL_SHOW :
            return {
                ...state,
                deleteModal :{
                    del_type : action.payload.del_type,
                    id : action.payload.del_id,
                    isVisible : true,
                }
            }
        case DELETE_FOLDER_MODAL_HIDE :
            return {
                ...state,
                deleteModal :{
                    del_type : null,
                    id : null,
                    isVisible : false,
                }
            }
        case SET_FOLDER_ID :
            return {
                ...state,
                folder_id : action.payload.folder_id,
            }
        default:
            return state;
    }
};

export default folderReducer;
