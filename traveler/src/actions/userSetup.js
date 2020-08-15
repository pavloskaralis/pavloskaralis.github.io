import axios from 'axios'
import setUserID from './setUserID.js'
import setItineraries from './setItineraries.js'
import toggleLogin from './toggleLogin.js'


export default function userSetup() {
    return dispatch => {
        const getRequest = async() => {
            const result = await axios.get('https://traveler-backend.herokuapp.com/auto_login', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }) 
            const {data} = result;  
            if(!data.error){
                //setUserID must dispatch first for Show Page useEffect to work properly
                dispatch(setUserID(data.id));
                dispatch(toggleLogin(true));
                dispatch(setItineraries(data.itineraries))
            } else {
                dispatch(toggleLogin(false));
            }  
        }
        
        const token = localStorage.getItem("token");
        if(token) {
            getRequest();
        } else {
            dispatch(toggleLogin(false));
        }
    }
}