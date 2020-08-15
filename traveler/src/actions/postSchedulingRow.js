import axios from 'axios'
import addSchedulingRow from './addSchedulingRow.js';
import selectPlanningRow from './selectPlanningRow.js'
import toggleForm from './toggleForm.js'

export default function postSchedulingRow(itineraryID, date, time = '', planningRow = {}) {

    return dispatch => {
        const schedulingRow = {...planningRow, date: date, time: time}
        delete schedulingRow.interest;
        delete schedulingRow.id;
        delete schedulingRow.created_at;
        delete schedulingRow.updated_at;

        const postRequest = async () => {
            const result = await axios.post(`https://traveler-backend.herokuapp.com/itineraries/${itineraryID}/scheduling_rows`, schedulingRow);
            const {data} = result;
            if (!data.error) {
                dispatch(addSchedulingRow(data.scheduling_row));
                dispatch(selectPlanningRow(''))
                dispatch(toggleForm(''));
            } else {
                console.log('Failed To Create')
            }
        }
        postRequest();
    }
}


