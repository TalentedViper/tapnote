// src/redux/actions/saveRocordingModalActions.js
import { fetchWithAuth } from '../api';
import { API_BASE_URL } from '../../../config';
import { getToken } from '../authAction';
import { getAllRecording } from './homeAction';
export const SAVE_RECORDING_MODAL_SHOW = 'SAVE_RECORDING_MODAL_SHOW';
export const SAVE_RECORDING_MODA_LHIDE = 'SAVE_RECORDING_MODA_LHIDE';

export const modalShow = () => ({
    type: SAVE_RECORDING_MODAL_SHOW,
});

export const modalHide = () => ({
    type: SAVE_RECORDING_MODA_LHIDE,
});

export const saveRecording = (data) => async (dispatch) => {

    const formData = new FormData();
    formData.append('file', {
        uri: `file://${data.recording_path}`, // Add file path for upload
        type: 'audio/mp3', // Specify the file type
        name: `${data.recording_name}.mp3`, // Name the file
    });
    formData.append('recording_name', data.recording_name); // Append recording name
    formData.append('duration', data.duration); // Append duration
    formData.append('transcription_box', data.transcription); // Append transcription

    try {
        const token = await getToken();
        const response = await fetch(`${API_BASE_URL}/create_recording`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`,
                // 'Content-Type': 'multipart/form-data',
            },
        });

        const jsonResponse = await response.json();
        if (jsonResponse.success) {
            dispatch(getAllRecording());
            const recording_id = jsonResponse.data.id;
            if(data.highArr){
                try {
                    const response = await fetchWithAuth('post', '/add_highlight', {recording_id, data:data.highArr});
                } catch(error) {
                    console.log("error", error);
                }
            }

        } else {
            console.error("Failed to create recording:", jsonResponse.message);
        }
        return jsonResponse;
    } catch (error) {
        console.error('Error uploading recording:', error.message);
    }
};


