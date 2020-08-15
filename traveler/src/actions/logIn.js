import axios from 'axios'
import setUserID from './setUserID.js'
import setItineraries from './setItineraries.js'
import toggleError from './toggleError.js'
import toggleLogin from './toggleLogin.js';
import toggleDropdown from './toggleDropdown.js';
import toggleForm from './toggleForm.js';


export default function logIn(username, password) {
    return dispatch => {
        const user = {
            username: username,
            password: password
        }
        const postRequest = async () => { 
            const result = await axios.post('https://traveler-backend.herokuapp.com/login', user);
            const {data} = result;
            if(!data.error) {
                localStorage.setItem("token", data.jwt)
                dispatch(toggleLogin(true));
                dispatch(setUserID(data.id));
                dispatch(setItineraries(data.itineraries))
                dispatch(toggleError(''));
                dispatch(toggleDropdown(false));
                dispatch(toggleForm(''));
            } else {
                dispatch(toggleError('Invalid Username/Password'));
            }
        }
        postRequest();
    }
}






   