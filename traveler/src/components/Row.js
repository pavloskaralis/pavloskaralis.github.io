import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { TextareaAutosize } from '@material-ui/core'
import scheduleIcon from '../images/schedule.png'
import cancelIcon from '../images/cancel.png'
import addIcon from '../images/add.png'
import subtractIcon from '../images/subtract.png'
import toggleForm from '../actions/toggleForm'
import selectPlanningRow from '../actions/selectPlanningRow.js'
import putPlanningRow from '../actions/putPlanningRow.js'
import deleteSchedulingRow from '../actions/deleteSchedulingRow.js'
import putSchedulingRow from '../actions/putSchedulingRow.js'


const Wrapper = styled.div`
    min-height: 60px;
    width: 100%;
    min-width: 768px;
    display: flex;
    border-bottom: 1px solid ${props => props.theme.gray};
    padding: 0 8px;
    box-sizing: border-box;

    input::-webkit-datetime-edit-hour-field:focus,
    input::-webkit-datetime-edit-minute-field:focus,
    input::-webkit-datetime-edit-ampm-field:focus {
        background-color: ${props => props.theme.blue};
    }
`;

const TextArea = styled(TextareaAutosize)`
    box-sizing: border-box;
    min-height: 60px;
    width: 16.67%;
    background-color: white;
    color: ${props => props.theme.black};
    font-family: Verdana;
    font-size: 16px;
    padding: 19px 8px;
    border: none;
    resize: none;
    outline: none;
    font-weight: ${props => props.first ? '600' : ''};
`;

const TDContainer = styled.div`
    box-sizing: border-box;
    min-height: 60px;
    width: 16.67%;
    display: flex;
    flex-direction: ${props => props.interest? 'row' : 'column'};
    justify-content: center;
`;

const Icon = styled.div`
    background-image: ${props => `url(${props.image})`};
    background-size: 37px;
    background-repeat: no-repeat;
    background-position: center; 
    width: 50px;
    height: 50px;
    border-radius: 50px;
    cursor: pointer;
    align-self: center;

    &:hover {
        background-color: ${props => props.theme.orange};
    }
`;

const Interest = styled.div`
    font-family: Verdana;
    color: ${props => props.theme.black};
    align-self: center;
    margin-right: 16px;
    font-weight: 600;
    cursor: default;
    font-size: 18px;
`;

const Time = styled.input`
    padding: 4px; 
    font-family: 'Verdana';
    width: 125px;
    height: 36px;
    box-sizing: border-box;
    font-size: 15px;
    border: 0;
    outline: 0;
    cursor: text;
    font-weight: 600;
`;

const Button = styled.div`
    cursor: pointer;
    align-self: center;
    background-color: ${props => props.theme.black};
    width: 18px;
    height: 18px;
    border-radius: 4px;
    background-image: ${props => `url(${props.image})`};
    background-size: 10px;
    background-position: center;
    background-repeat: no-repeat;

    &:hover {
        background-color: ${props => props.theme.blackHover};
    }
`;

const mapStateToProps = state => {
    return {
      userID: state.userID
    }
}

const mapDispatchToProps = {
    toggleForm,
    selectPlanningRow,
    putPlanningRow,
    deleteSchedulingRow,
    putSchedulingRow
}


let Row = ({rowType, row, userID, toggleForm, selectPlanningRow, putPlanningRow, deleteSchedulingRow, putSchedulingRow}) => {

    //textarea cannot use ref; must rely on state values for storage
    const [activity, updateActivity] = useState(row.activity);
    const [type, updateType] = useState(row.category);
    const [address, updateAddress] = useState(row.address);
    const [website, updateWebsite] = useState(row.website);
    const [interest, updateInterest] = useState(row.interest);
    const [time, updateTime] = useState(row.time);

    //onClick for interest button; not a text area
    const toggleInterest = () => {
        let updatedInterest = interest.indexOf(userID) === -1 ? 
            [...interest,userID] : [...interest.slice(0,interest.indexOf(userID)),...interest.slice(interest.indexOf(userID) + 1)];

        updateInterest(updatedInterest)
    }
    
    // autoupdate for sort 


    //handles input value change for both planning and scheduling row
    const handleInput = (e) => {
        switch(e.target.id){
            case `activity${row.id}`:return updateActivity(e.target.value);
            case `type${row.id}`:return updateType(e.target.value);
            case `address${row.id}`:return updateAddress(e.target.value);
            case `website${row.id}`:return updateWebsite(e.target.value);
            case `time${row.id}`: return updateTime(e.target.value);
            default: console.log();
        }
        // updatedTime =  document.querySelector(`#time${row.id}`).value;
    }
    
    useEffect(()=> {
        // put request row on dismount if changed
   
            if(row.interest){
                const updatedPlanning = {
                    activity: activity,
                    category: type,
                    address: address,
                    website: website,
                    interest: JSON.stringify(interest)
                }
                if ( row.activity !== updatedPlanning.activity || row.category !== updatedPlanning.category ||
                    row.address !== updatedPlanning.address || row.website!== updatedPlanning.website || 
                    JSON.stringify(row.interest) !== updatedPlanning.interest
                )  putPlanningRow(row.id,updatedPlanning,row.id);
            }else{
                const updatedScheduling = {
                    activity: activity,
                    category: type,
                    address: address,
                    website: website,
                    time: time
                }
                if( row.activity !== updatedScheduling.activity || row.category !== updatedScheduling.category ||
                    row.address !== updatedScheduling.address || row.website!== updatedScheduling.website ||
                    row.time !== updatedScheduling.time
                ) putSchedulingRow(row.id,updatedScheduling,row.id);
            }
     
    },[time, activity, type, website, address, interest])

    return (
        <>
            {/* planning row */}
            {rowType === 'planning' && 
                <Wrapper id={row.id}>
                    <TextArea onChange={handleInput} value={activity} first='true' id={`activity${row.id}`}/>
                    <TextArea onChange={handleInput} value={type} id={`type${row.id}`}/>
                    <TextArea onChange={handleInput} value={address} id={`address${row.id}`}/>
                    <TextArea onChange={handleInput} value={website} id={`website${row.id}`}/>
                    <TDContainer interest>
                        <Interest>{interest.length}</Interest>
                        <Button image={interest.indexOf(userID) === -1 ? addIcon : subtractIcon} onClick={()=> toggleInterest(interest)} id='interest'/>
                    </TDContainer>
                    <TDContainer>
                        <Icon image={scheduleIcon} onClick={()=> {selectPlanningRow(row); toggleForm('schedule')}}/>
                    </TDContainer>
                </Wrapper>}
            {/* scheduling row */}
            {rowType === 'scheduling' && 
                <Wrapper id={row.id}>
                    <TDContainer>
                        <Time type='time' onChange={handleInput} defaultValue={row.time} id={`time${row.id}`} placeholder="hh:mm"/>
                    </TDContainer>
                    <TextArea onChange={handleInput} value={activity} id={`activity${row.id}`}/>
                    <TextArea onChange={handleInput} value={type} id={`type${row.id}`}/>
                    <TextArea onChange={handleInput} value={address} id={`address${row.id}`}/>
                    <TextArea onChange={handleInput} value={website} id={`website${row.id}`}/>
                    <TDContainer>
                        <Icon image={cancelIcon} onClick={()=> deleteSchedulingRow(row.id)}/>
                    </TDContainer>
                </Wrapper>}
        </>
    )
}

Row = connect(
    mapStateToProps,
    mapDispatchToProps
)(Row)

export default Row

  