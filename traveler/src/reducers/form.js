export default function form(state='', action) {
    switch (action.type) {
        case 'TOGGLE_FORM': 
            return action.formType
        default: 
            return state
    }
}