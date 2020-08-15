import axios from 'axios'
import removeSchedulingRow from './removeSchedulingRow.js'

export default function deleteItinerary(schedulingRowID) {
    return dispatch => {


        const deleteRequest = async () => {
            const result = await axios.delete(`https://traveler-backend.herokuapp.com/scheduling_rows/${schedulingRowID}`);  
            const {data} = result;  
            if(!data.error){
                dispatch(removeSchedulingRow(schedulingRowID));
            } else {               
                console.log('Failed To Delete')
            }  
        }

       deleteRequest();
    }
}
