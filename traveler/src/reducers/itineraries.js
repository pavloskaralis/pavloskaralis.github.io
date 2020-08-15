export default function username(state = [], action) {
    switch (action.type) {
        case 'SET_ITINERARIES':
            // sort itineraries by newest to oldest
            return action.itineraries.sort((a, b)=> b.id - a.id);
        case 'ADD_ITINERARY':
            return [action.itinerary, ...state]
        case 'SWAP_ITINERARY': 
            return [...state.slice(0,action.index),action.itinerary,...state.slice(action.index + 1)]
        case 'REMOVE_ITINERARY':
            return state.filter(itinerary => itinerary.id !== action.id)
        default:
            return state
    }
}