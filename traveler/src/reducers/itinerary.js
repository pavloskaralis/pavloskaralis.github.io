export default function itinerary(state = '', action) {
    switch (action.type) {
        case 'SELECT_ITINERARY':
            return action.itinerary
        case 'ADD_PLANNING':
            return {...state, planning_rows: [...state.planning_rows,action.planning_row]}
        case 'ADD_SCHEDULING':
            return {...state, scheduling_rows: [...state.scheduling_rows,action.scheduling_row]}
        case 'SWAP_PLANNING':
            let planning_index = state.planning_rows.findIndex(planning_row => planning_row.id === action.id);
            return {...state, planning_rows: [...state.planning_rows.slice(0, planning_index), action.planning_row, ...state.planning_rows.slice(planning_index + 1)]}
        case 'SWAP_SCHEDULING':
            let scheduling_index = state.scheduling_rows.findIndex(scheduling_row => scheduling_row.id === action.id);
            return {...state, scheduling_rows: [...state.scheduling_rows.slice(0, scheduling_index), action.scheduling_row, ...state.scheduling_rows.slice(scheduling_index + 1)] }
        case 'REMOVE_SCHEDULING':
            return {...state, scheduling_rows: state.scheduling_rows.filter(scheduling_row => scheduling_row.id !== action.id)}
        default:
            return state
    }
}