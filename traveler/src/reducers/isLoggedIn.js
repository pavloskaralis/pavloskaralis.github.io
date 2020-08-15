export default function isLoggedIn(state = null, action) {
    switch (action.type) {
        case 'TOGGLE_LOGIN':
            return action.boolean
        default: 
            return state 
    }
}