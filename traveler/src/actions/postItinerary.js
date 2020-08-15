import axios from 'axios'
import toggleError from './toggleError.js'
import toggleForm from './toggleForm.js'
import addItinerary from './addItinerary.js';

export default function postItinerary(location,departureDate,returnDate,userID) {
    return dispatch => {
        //check date format is valid
        const regex = /(20)[2-9]\d-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])/i;
        if(!departureDate.match(regex) || !returnDate.match(regex)){
            return dispatch(toggleError('Invalid Date Format'));
        } 
        //find today's date
        const date = new Date();
        const dd = date.getDate();
        const mm = date.getMonth() + 1;
        const yyyy = date.getFullYear();
        const today = [parseFloat(yyyy), parseFloat(mm), parseFloat(dd)]
        //breakdown depart and return dates 
        const splitDepartureDate = departureDate.split('-');
        const splitReturnDate = returnDate.split('-');
        const parsedDepartureDate = splitDepartureDate.map(num => parseFloat(num));
        const parsedReturnDate = splitReturnDate.map(num => parseFloat(num));
        //check departure date occurs before return date and after today,
        // [0] = YY; [1] = MM; [2] = DD;
        //checks years
        if(parsedDepartureDate[0] > parsedReturnDate[0] || parsedDepartureDate[0] < today[0]) { 
            // console.log(1)
            return dispatch(toggleError('Invalid Dates'));
        //checks months
        } else if((parsedDepartureDate[0] === parsedReturnDate[0] && parsedDepartureDate[1] > parsedReturnDate[1]) || (parsedDepartureDate[0] === today[0] && parsedDepartureDate[1] < today[1])) {
            // console.log(2)
            return dispatch(toggleError('Invalid Dates'));
        //checks days
        } else if ((parsedDepartureDate[0] === parsedReturnDate[0] && parsedDepartureDate[1] === parsedReturnDate[1] && parsedDepartureDate[2] > parsedReturnDate[2]) || (parsedDepartureDate[0] === today[0] && parsedDepartureDate[1] === today[1] && parsedDepartureDate[2] < today[2])) {
            // console.log(3)
            return dispatch(toggleError('Invalid Dates'));
        }
        //make sure range won't break site; 
        // [0] = YY; [1] = YY; [2] = DD;
        if((parsedDepartureDate[0] < parsedReturnDate[0]) && ((parsedDepartureDate[0] + 1) < parsedReturnDate[0])) {
            return dispatch(toggleError('60 Day Limit'));
        } else if ((parsedDepartureDate[0] === parsedReturnDate[0]) && ((parsedDepartureDate[1] + 4) < parsedReturnDate[1])) {
            return dispatch(toggleError('60 Day Limit'));
        }
        //create array of dates
        const dates = [];
        const endDate = new Date(returnDate); 
        let nextDate = new Date(departureDate);
        while (nextDate <= endDate) {
            const dd = nextDate.getDate() + 1;
            const mm = nextDate.getMonth() + 1;
            const yyyy = nextDate.getFullYear();
            let day = [mm, dd, yyyy];
            if(day[0] < 10) day[0] = '0'+ day[0];
            if(day[1] < 10) day[1] = '0'+ day[1];
            day[2] = day[2].toString().split('').slice(2).join('');
            dates.push(day[0] + '.' + day[1] + '.' + day[2]);
            nextDate.setDate(nextDate.getDate() + 1);
        }
        //error in Date class adding extra day to each month
        dates.forEach((date,index) => {
            const sliced = date.slice(0,5);
            const errors = ['01.32','02.30','03.32','04.31','05.32','06.31','07.32','08.32','09.31','10.32','11.31','12.32'];
            if(errors.indexOf(sliced) !== -1 ) {
                switch (sliced) {
                    case errors[0]: dates[index] = '02.01' + dates[index].slice(5);
                        break;
                    case errors[1]: dates[index] = '03.01' + dates[index].slice(5);
                        break;
                    case errors[2]: dates[index] = '04.01' + dates[index].slice(5);
                        break;
                    case errors[3]: dates[index] = '05.01' + dates[index].slice(5);
                        break;
                    case errors[4]: dates[index] = '06.01' + dates[index].slice(5);
                        break;
                    case errors[5]: dates[index] = '07.01' + dates[index].slice(5);
                        break;
                    case errors[6]: dates[index] = '08.01' + dates[index].slice(5);
                        break;
                    case errors[7]: dates[index] = '09.01' + dates[index].slice(5);
                        break;
                    case errors[8]: dates[index] = '10.01' + dates[index].slice(5);
                        break;
                    case errors[9]: dates[index] = '11.01' + dates[index].slice(5);
                        break;
                    case errors[10]: dates[index] = '12.01' + dates[index].slice(5);
                        break;
                    case errors[11]: dates[index] = '01.01' + dates[index].slice(5);
                        break;
                }       
            }
        });
        if(dates.find(date => date.slice(0,5) === ('02.30'))) {
            let errorIndex = dates.indexOf(dates.find(date => date.slice(0,5) === ('02.30')));
            dates[errorIndex] = '03.01' + dates[errorIndex].slice(5);
        }
        //easier 60 day limit check
        if(dates.length > 60) return dispatch(toggleError('60 Day Limit'));
        //post request
        const newItinerary = {
            location: location,
            dates:  JSON.stringify(dates),
            shared: false
        }
        const postRequest = async () => {
            dispatch(toggleError('Saving Itinerary...'));
            const result = await axios.post(`https://traveler-backend.herokuapp.com/users/${userID}/itineraries`, newItinerary);
            const {data} = result;
            if (!data.error) {
                dispatch(toggleError(''));
                dispatch(toggleForm(''));
                const newDates = JSON.parse(newItinerary.dates)
                dispatch(addItinerary({...newItinerary, dates: newDates, id: data.id}))
            } else {
                dispatch(toggleError('Failed To Save'));
            }
        }
        postRequest();
    }
}


