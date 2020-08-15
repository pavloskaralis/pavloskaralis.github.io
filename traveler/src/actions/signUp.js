import axios from 'axios'
import setUserID from './setUserID.js'
import toggleError from './toggleError.js'
import toggleLogin from './toggleLogin.js';
import toggleDropdown from './toggleDropdown.js';
import toggleForm from './toggleForm.js';



export default function signUp(username, password) {
    return dispatch => {
        const newUser = {
            username: username,
            password: password
        }
        const postRequest = async() => {
            const result = await axios.post('https://traveler-backend.herokuapp.com/users', newUser);
            const {data} = result;
            if (!data.error) {
                localStorage.setItem("token", data.jwt)
                dispatch(toggleLogin(true));
                dispatch(setUserID(data.id));
                dispatch(toggleError(''));
                dispatch(toggleDropdown(false));
                dispatch(toggleForm(''));
            } else {
                dispatch(toggleError('Username Already Taken'));
            }
        }
        postRequest();
    }
}


