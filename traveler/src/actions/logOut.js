import history from '../history.js'
import setUserID from './setUserID.js'
import toggleLogin from './toggleLogin.js'
import toggleDropdown from './toggleDropdown.js'

export default function logOut() {
    return dispatch => {
        localStorage.clear();
        dispatch(toggleLogin(false));
        dispatch(setUserID(null));
        dispatch(toggleDropdown(false));
        history.push('/');
    }
}


