import axios from 'axios'
import toggleError from './toggleError.js'
import selectItinerary from './selectItinerary.js'
import swapItinerary from './swapItinerary.js'

export default function postLookup(itinerary_id, username, index) {
    return dispatch => {

        const lookup = {
            itinerary_id: itinerary_id,
            username: username
        }
    
        const postRequest = async () => {
            const result = await axios.post('https://traveler-backend.herokuapp.com/lookups', lookup);  
            const {data} = result;  
            if(!data.error){
                dispatch(selectItinerary(data));
                const updatedItinerary = {
                    location: data.location,
                    shared: data.shared,
                    id: data.id,
                    //show page uses Planning but index does not
                    dates: data.dates.filter(date => date !== 'Planning')
                }
                dispatch(toggleError(''));
                dispatch(swapItinerary(updatedItinerary, index));
                if(document.getElementById('addUser')) document.getElementById('addUser').value='';
            } else {               
                dispatch(toggleError('User Not Found'))
            }  
        }

        postRequest();
    }
}
