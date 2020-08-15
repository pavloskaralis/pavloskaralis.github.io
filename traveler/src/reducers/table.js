export default function table(state='Planning', action) {
    switch (action.type) {
        case 'TOGGLE_TABLE': 
            return action.table
        default: 
            return state
    }
}