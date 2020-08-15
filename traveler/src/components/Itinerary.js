import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import sharedIcon from '../images/shared.png'
import sharedHoverIcon from '../images/sharedhover.png'
import editIcon from '../images/edit.png'
import editHoverIcon from '../images/edithover.png'
import toggleForm from '../actions/toggleForm.js'
import selectItinerary from '../actions/selectItinerary.js'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-weight: 600;
    font-family: Verdana;
    cursor: pointer;
    white-space: nowrap;
    min-width: ${props => props.width};

`;

const Location = styled(Container)`
    color: ${props => props.theme.black};
    padding-right: 4px;
    width: 21.5%;
    overflow-x: hidden;
    text-transform: capitalize;
    font-weight: 600;
    text-shadow: none;
    font-size: 18px;

    &:hover {
        color: ${props => props.theme.orange};
    }

    & span {
        width: 100%;
        display:block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
    }
`;

const Shared = styled(Container)`
    background-image: ${props => props.shared ? `url(${sharedIcon})` : 'none'};
    background-size: 45px;
    background-repeat: no-repeat;
    background-position: left;
    background-position-x: 22px;
    min-width: 20%;
`;

const Edit = styled(Container)`
    background-image: url(${editIcon});
    background-size: 36px;
    background-repeat: no-repeat;
    background-position: center; 
    width: 50px;
    height: 50px;
    border-radius: 50px;
    cursor: pointer;
    margin-left: 4px;

    &:hover {
        background-color: ${props => props.theme.gray};
    }
`;

const Wrapper = styled.a`
    text-decoration-line: none;
    width: 100%;
    min-width: 500px;
    padding-left: 8%;
    min-height: 90px; 
    display: flex;
    border-bottom: 1px solid ${props => props.theme.gray};
    box-sizing: border-box;
    cursor: pointer;
    color: ${props => props.theme.gray};
    background-color: white;

    &:hover {
        background-color: ${props => props.theme.black};
        color: white;
        border-bottom: 1px solid ${props => props.theme.black};
        z-index: 1;
    }

    &:hover ${Location} {
        color: ${props => props.theme.orange};
    }

    &:hover ${Edit} {
        background-image: url(${editHoverIcon});
    }

    &:hover ${Shared} {
        background-image: ${props => props.shared ? `url(${sharedHoverIcon})` : 'none'};
    }
`;

const mapStateToProps = state => {
    return {
      userID: state.userID
    }
}
const mapDispatchToProps = {
    toggleForm,
    selectItinerary
}

let Itinerary = ({itinerary, toggleForm, selectItinerary, index, userID}) => {
    const length = itinerary.dates.length
    return (
        <Wrapper href={`/${userID}/${itinerary.id}`} shared={itinerary.shared}>
            {/* span css uses ellipsis to prevent overflow */}
            <Location><span>{itinerary.location}</span></Location>
            <Shared shared={itinerary.shared}/>
            <Container width='20.5%'>{itinerary.dates[0]}</Container>
            <Container width='20.5%'>{itinerary.dates[length - 1]}</Container>
            <Container width='16%'>
                {/* selectItinerary allows form to access specific itinerary through state */}
                <Edit onClick={e => {e.preventDefault(); selectItinerary({...itinerary, index: index});toggleForm('update')}}/>
            </Container>
        </Wrapper>
    )
}

Itinerary = connect(
    mapStateToProps,
    mapDispatchToProps
)(Itinerary)

export default Itinerary

  