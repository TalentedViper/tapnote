// src/redux/actions/filterModalActions.js
export const FILTERMODALSHOW = 'FILTERMODALSHOW';
export const FILTERMODALHIDE = 'FILTERMODALHIDE';
export const SET_SHARE = 'SET_SHARE';

export const modalShow = () => ({
    type: FILTERMODALSHOW,
});

export const modalHide = () => ({
    type: FILTERMODALHIDE,
});

export const setShare = (state) => ({
    type : SET_SHARE,
    payload : {
        isShare : state,
    }
})
