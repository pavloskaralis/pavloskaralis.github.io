import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import selectIcon from '../images/select.png'
import toggleForm from '../actions/toggleForm.js'
import signUp from '../actions/signUp.js'
import logIn from '../actions/logIn.js'
import toggleError from '../actions/toggleError.js'
import postItinerary from '../actions/postItinerary.js'
import selectItinerary from '../actions/selectItinerary.js'
import selectPlanningRow from '../actions/selectPlanningRow.js'
import putItinerary from '../actions/putItinerary.js'
import deleteItinerary from '../actions/deleteItinerary.js'
import postLookup from '../actions/postLookup.js';
import postSchedulingRow from '../actions/postSchedulingRow.js';

const Wrapper = styled.div`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(25,25,25,.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    z-index: 3;

    & form {
        width: 400px;
        margin: 0 auto; 
        background-color: ${props => props.theme.black};
        border-radius: 15px; 
        box-shadow: 0 5px 10px 0 rgba(0,0,0,.5);

        @media (max-width: 499px) {
            max-width: 300px; 
        }
    }

    & legend {
        text-transform: capitalize;
        color: ${props => props.theme.orange}; 
        text-align: center;
        margin: 24px auto; 
        font-family: 'Verdana';
        cursor: default;
        font-weight: 600;
        font-size: 17.5px;
        padding: 0;
        width: 100%;
    }

    & select {
        border: 2px solid ${props => props.theme.opaque}; 
        padding: 4px; 
        font-family: 'Verdana';
        width: 175px;
        height: 36px;
        box-sizing: border-box;
        font-size: 16px;
        -webkit-appearance: none;
        -webkit-border-radius: 0px;
        background-position: 95% 60%;
        background-size: 20px;
        background-repeat: no-repeat;
        background-image: url(${selectIcon});
        cursor: pointer;
        
        &:focus {
            border: 2px solid ${props => props.theme.blue};
            outline: none;
        }
    }

    input::-webkit-datetime-edit-hour-field:focus,
    input::-webkit-datetime-edit-minute-field:focus,
    input::-webkit-datetime-edit-ampm-field:focus,
    input::-webkit-datetime-edit-day-field:focus,
    input::-webkit-datetime-edit-month-field:focus,
    input::-webkit-datetime-edit-year-field:focus {
        background-color: ${props => props.theme.blue};
    }
`;

const InputContainer = styled.div`
    display: flex; 
    justify-content: space-between;
    padding: 0 64px;
    margin-bottom: 16px;

    & label {
        color: white;
        font-family: 'Verdana';
        display: flex;
        flex-direction: column;
        justify-content: ${props => props.all ? 'flex-start' : 'center'};
        text-align: ${props => props.remove ? 'center' : ''};
        width: ${props => props.remove ? '220px' : ''};
        margin: ${props => props.remove ? '0 auto' : ''};
    }

    & input {
        border: 2px solid ${props => props.theme.opaque}; 
        padding: 4px; 
        font-family: 'Verdana';
        width: 175px;
        height: 36px;
        box-sizing: border-box;
        font-size: 16px;

        &:focus {
            border: 2px solid ${props => props.theme.blue};
            outline: none;
        }
    }

    & input[type="date"], input[type="time"] {
        cursor: text;
    }

    @media (max-width: 499px) {
        padding: 16px; 
    }
`;

const ButtonContainer = styled.div`
    margin-bottom: 24px; 
    display: flex;
    justify-content: space-evenly;
    & input {
        display: none;
    }
`;

const UsernameContainer = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 270px;
    flex-wrap: wrap;
    max-height: 120px;
    justify-content: space-between;
    font-family: Verdana;
    color: white;
    font-weight: 600;
    width: 175px;

    & div {
        margin-bottom: 4px;
        margin: 4px;
    }
`;

const Button = styled.div`
    border-radius: 8px; 
    width: 80px; 
    text-align: center;
    font-family: 'Verdana';
    cursor: pointer;
    box-sizing: border-box;
    height: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-weight: 600;
    font-size: 14px;
    margin-top: 8px;
    color: ${props => props.cancel ? 'white' : props.theme.black};
    background-color: ${props => props.cancel ? props.theme.gray : props.theme.orange};
    &:hover {
        background-color: ${props => props.cancel ? props.theme.grayHover : props.theme.orangeHover}; 
    }
`;

const mapStateToProps = state => {
    return {
        form: state.form,
        error: state.error,
        userID: state.userID,
        itinerary: state.itinerary,
        index: state.itineraries.findIndex(itinerary => itinerary.location === state.itinerary.location),
        planningRow: state.planningRow
    }
}

const mapDispatchToProps = {
    toggleForm,
    signUp,
    logIn,
    postItinerary,
    selectItinerary,
    selectPlanningRow,
    putItinerary,
    deleteItinerary,
    postLookup,
    toggleError,
    postSchedulingRow
}

//form reused for home, index, and show pages
let Form = ({
    form, error, toggleForm, signUp, logIn, page, userID, itinerary, toggleError, 
    postSchedulingRow, postItinerary, selectItinerary, selectPlanningRow, putItinerary, 
    deleteItinerary, postLookup, index, planningRow
}) => {
    //define variables for ref attributes
    let username,
    password,
    location,
    departureDate,
    returnDate,
    schedulingDate,
    schedulingTime,
    addUser; 

    const submit = e => {
        
        e.preventDefault();
        //prevent empty input submission 
        switch(form) {
            case 'sign up': if(!username.value || !password.value)return
                break;
            case 'log in': if(!username.value || !password.value)return
                break;
            case 'new': if(!location.value || !departureDate.value || !returnDate.value)return
                break;
            case 'update': if(!location.value || !departureDate.value || ! returnDate.value)return
                break;
            case 'share': if(!addUser.value) return
                break; 
            case 'schedule': if(!schedulingDate.value || !schedulingTime.value) return
                break;
            default: console.log();
        }
        //prevent sharing itinerary with more than 8 users
        if(form === 'share' && itinerary.usernames.length === 8) return toggleError('8 User Limit');
        //prevent sharing itinerary with more than 8 users
        if(form === 'share' && itinerary.usernames.find(username => username === addUser.value)) return toggleError('Already Shared');

        //switch submit actions based on form type        
        switch(form) {
            case 'sign up': signUp(username.value,password.value);
                break;
            case 'log in': logIn(username.value,password.value);
                break;
            case 'new': postItinerary(location.value,departureDate.value,returnDate.value,userID);
                break;
            case 'update': putItinerary(location.value,departureDate.value,returnDate.value,itinerary.id,itinerary.index, itinerary.shared, departureDate.defaultValue);
                break;
            case 'remove': deleteItinerary(itinerary, userID);
                break;
            case 'share': postLookup(itinerary.id,addUser.value, index);
                break;
            case 'schedule': postSchedulingRow(itinerary.id, schedulingDate.value, schedulingTime.value , planningRow );
                break;
            default: console.log();
        }
        //reset values
        // if(document.getElementById('addUser')) document.getElementById('addUser').value='';
        // document.querySelectorAll('input').forEach(input => {if(input.id !== 'search') input.value = ''});
    }
    //transform button text to form legend text
    let legend = form;
    switch(form) {
        case 'new': legend = 'new itinerary';
            break;
        case 'update': legend = 'update itinerary';
            break;
        case 'remove': legend = 'remove itinerary';
            break;
        case 'share': legend = 'share itinerary';
            break;
        case 'schedule': legend = 'schedule activity';
            break;
        default: console.log();
    }
    //refactor departure and return date for update form default values
    let firstDay;
    let lastDay;
    if(form === 'update'){
        firstDay = itinerary.dates[0].split('.');
        lastDay = itinerary.dates[itinerary.dates.length - 1].split('.');
        firstDay[2] = '20' + firstDay[2];
        lastDay[2] = '20' + lastDay[2];
        firstDay = firstDay[2] + '-' + firstDay[0] + '-' + firstDay[1];
        lastDay = lastDay[2] + '-' + lastDay[0] + '-' + lastDay[1];
    }

    // makes error message appear temporarily
    if(toggleError !== '') setTimeout(()=> toggleError(''),1500);

    //inputs vary based on page and form type
    return (
        // close dropdown on off focus
        <Wrapper onClick={()=>{
            if(form && page === 'index'){toggleForm('');selectItinerary('')}
            else if(form && page === 'show'){toggleForm('');selectPlanningRow('')}
            else if(form && page === 'home')toggleForm('');
        }}>
            <form onSubmit={ submit } onClick={e => e.stopPropagation()} >
                <legend>{error? error : legend }</legend>
                {/* home page has login and signup form */}
                {page === 'home' &&
                    <>
                        <InputContainer>
                            <label>Username:</label>
                            <input type="text" ref={node => username = node} autoFocus/>
                        </InputContainer>
                        <InputContainer>
                            <label>Password:</label>
                            <input type={form==="log in" ? "password" : "text"} ref={node => password = node}/>
                        </InputContainer>
                    </>
                }
                {/* index page has itinerary create and update form */}
                {page === 'index' &&
                    <>
                        <InputContainer>
                            <label>Location:</label>
                            <input type="text" ref={node => location = node} defaultValue={form === 'update' ? itinerary.location : ''} autoFocus/>
                        </InputContainer>
                        <InputContainer>
                            <label>Departure:</label>
                            <input type="date" ref={node => departureDate = node} defaultValue={firstDay} placeholder='yyyy-mm-dd'/>
                        </InputContainer>
                        <InputContainer>
                            <label>Return:</label>
                            <input type="date" ref={node => returnDate = node} defaultValue={lastDay} placeholder='yyyy-mm-dd'/>
                        </InputContainer>
                    </>
                }
                {page === 'show' &&
                    <>  
                        {form === 'schedule' &&
                            <>
                                <InputContainer>
                                    <label>Date:</label>
                                    <select ref={node => schedulingDate = node} autoFocus >
                                        {itinerary.dates.slice(1).map(date => {
                                            return (
                                                <option key={date} value={date}>{date}</option>
                                            )
                                        })}
                                    </select>
                                </InputContainer>
                                 <InputContainer>
                                    <label>Time:</label>
                                    <input type="time" ref={node => schedulingTime = node} placeholder='hh:mm'/>
                                </InputContainer>
                            </>
                        }
                        {form === 'remove' &&
                            <InputContainer remove>
                                <label>Are you sure you want to remove this itinerary?</label>
                            </InputContainer>
                        }
                        {form === 'share' && 
                            <>
                                 <InputContainer all>
                                    <label>All Users:</label>
                                    <UsernameContainer>
                                        {itinerary.usernames && itinerary.usernames.map(username =>{
                                            return (
                                                <div key={username}>{username}</div>
                                            )
                                        })}
                                    </UsernameContainer>
                                </InputContainer>
                                <InputContainer>
                                    <label>Add User:</label>
                                    <input type="text" ref={node => addUser = node} autoFocus id='addUser'/>
                                </InputContainer>
                            </>
                        }
                    </>
                }
                <ButtonContainer>
                    <Button cancel onClick={page === 'index' ? ()=> {toggleForm(''); selectItinerary('')} : ()=> {toggleForm(''); selectPlanningRow('')}}>
                        {form === 'share' ? 'Close' : 'Cancel'}
                    </Button>
                    <Button type="submit" onClick={ submit }>{form === 'remove' ? 'Confirm' : 'Submit'}</Button>
                    {/* required for enter key to work on home page for unknown reason */}
                    <input type="submit"/>
                </ButtonContainer>
            </form>
        </Wrapper>
    )
}

Form = connect(
    mapStateToProps,
    mapDispatchToProps
)(Form)

export default Form

  