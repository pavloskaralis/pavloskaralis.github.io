export default function error(state='', action) {
    switch (action.type) {
        case 'TOGGLE_ERROR': 
            return action.message
        case 'TOGGLE_FORM': 
            return ''
        default: 
            return state
    }
}