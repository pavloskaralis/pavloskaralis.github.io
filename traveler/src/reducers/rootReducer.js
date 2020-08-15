import { combineReducers } from 'redux'
import isLoggedIn from './isLoggedIn.js'
import userID from './userID.js'
import itineraries from './itineraries.js'
import itinerary from './itinerary.js'
import form from './form.js'
import dropdown from './dropdown.js'
import error from './error.js'
import filter from './filter.js'
import table from './table.js'
import planningRow from './planningRow.js'

const traveler = combineReducers({
    isLoggedIn,
    userID,
    itineraries,
    itinerary,
    planningRow,
    table,
    form,
    dropdown,
    error,
    filter
})

console.log(traveler)

export default traveler