export default function dropdown(state=false, action) {
    switch (action.type) {
        case 'TOGGLE_DROPDOWN':
            return action.boolean
        default: 
            return state
    }
}