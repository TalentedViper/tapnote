import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // Adjust the path to your root reducer

const store = configureStore({
    reducer: rootReducer,
    // Default middleware includes thunk
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(/* your custom middleware, if any */),
});

export default store;
