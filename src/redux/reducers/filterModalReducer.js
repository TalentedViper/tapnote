// src/redux/reducers/filterModalReducer.js
import { FILTERMODALSHOW, FILTERMODALHIDE, SET_SHARE } from '../actions/filterModalActions';

const initialState = {
    modalVisible : false,
    creationDate : null,
    sortType : 'asc',
    isShare : false,
};

const filterModalReducer = (state = initialState, action) => {
    switch (action.type) {
        case FILTERMODALSHOW:
            return { 
                ...state,
                modalVisible : true,
            };
        case FILTERMODALHIDE:
            return {
                ...state,
                modalVisible: false,
            };
        case SET_SHARE:
            return {
                ...state,
                isShare : action.payload.isShare
            }
        default:
            return state;
    }
};

export default filterModalReducer;
