import { combineReducers } from 'redux';
import authReducer from './authReducer';
import filterModalReducer from './filterModalReducer';
import recordModalReducer from './home/recordModalReducer';
import saveRecordingModalReducer from './home/saveRecordingModalRecuder';
import chooseFolderModalReducer from './home/chooseFolderModalReducer';
import homeReducer from './home/homeReducer';
import folderReducer from './folderReducer';
import noteReducer from './note/noteReducer';
import notificationReducer from './notificationReducer';

// Combine reducers
const rootReducer = combineReducers({
    auth: authReducer,
    home : homeReducer,
    folder : folderReducer,
    filterModal : filterModalReducer,
    record: recordModalReducer,
    saveRecording : saveRecordingModalReducer,
    chooseFolder : chooseFolderModalReducer,
    note : noteReducer,
    notification : notificationReducer,
    // Add more reducers here if needed
});

// Define the RootState type
export type RootState = ReturnType<typeof rootReducer>;

// Export the root reducer as default
export default rootReducer;
