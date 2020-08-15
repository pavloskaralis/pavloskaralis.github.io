import axios from 'axios'
import history from '../history.js'
import toggleForm from './toggleForm.js'
import selectItinerary from './selectItinerary.js'
import removeItinerary from './removeItinerary.js'

export default function deleteItinerary(itinerary, userID) {
    return dispatch => {
        
        
        const removeRequests = async () => {
            const result = await axios.delete(`https://traveler-backend.herokuapp.com/lookups/${userID}/${itinerary.id}`); 
            const {data} = result;     
            if(!data.error){
                history.push('/');
                dispatch(toggleForm(''));
                dispatch(selectItinerary(''));
                dispatch(removeItinerary(itinerary.id));
            } else {               
                console.log('Failed To Remove')
            }  
        }


        const deleteRequest = async () => {
            const result = await axios.delete(`https://traveler-backend.herokuapp.com/itineraries/${itinerary.id}`);  
            const {data} = result;  
            if(!data.error){
                history.push('/');
                dispatch(toggleForm(''));
                dispatch(selectItinerary(''));
                dispatch(removeItinerary(itinerary.id));
            } else {               
                console.log('Failed To Delete')
            }  
        }

        //only delete if no other user has acces; otherwise remove individual user and their interests
        itinerary.usernames.length === 1 ? deleteRequest() : removeRequests();
    }
}
