export default function username(state = '', action) {
    switch (action.type) {
        case 'SELECT_PLANNING':
            return action.planningRow
        default:
            return state
    }
}