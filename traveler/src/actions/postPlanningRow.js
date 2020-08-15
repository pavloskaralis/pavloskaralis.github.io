import axios from 'axios'
import addPlanningRow from './addPlanningRow.js';

export default function postPlanningRow(itineraryID) {
    return dispatch => {
        const postRequest = async () => {
            const result = await axios.post(`https://traveler-backend.herokuapp.com/itineraries/${itineraryID}/planning_rows`,{});
            const {data} = result;
            if (!data.error) {
                dispatch(addPlanningRow(data.planning_row));
            } else {
                console.log('Failed To Create')
            }
        }
        postRequest();
    }
}


