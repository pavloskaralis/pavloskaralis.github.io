export default function filter(state = '', action) {
    switch (action.type) {
        case 'SET_FILTER':
            return action.text
        default: 
            return state 
    }
}