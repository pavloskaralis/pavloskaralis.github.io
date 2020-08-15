export default function userID(state = null, action) {
    switch (action.type) {
        case 'SET_USER_ID':
            return action.id
        default:
            return state
    }
}