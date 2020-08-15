import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import toggleDropdown from '../actions/toggleDropdown.js'
import Tools from './Tools.js'
import Itinerary from './Itinerary.js'
import Form from './Form.js'

const Wrapper = styled.div`
    width: 100%;
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    background-color: ${props => props.theme.cream}; 
`;

const Container = styled.div`
    margin:0 auto; 
    max-width: 992px;
    min-width: 300px; 
    height: calc(100% - 120px); 
    width: 100%; 
    background-color: white; 
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow-y: auto;
    box-sizing: border-box;
    box-shadow: 0 0 4px 0 rgba(0,0,0,.5);
    ::-webkit-scrollbar {
    width: 8px;    
    height: 8px;
    background-color: ${props => props.theme.gray};
    }
    ::-webkit-scrollbar-thumb {
        background-color: ${props => props.theme.black};   
    }
`;

const Empty = styled.div`
    width: 100%;
    max-width: 992px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    & div {
        position: fixed;
        width: 100%;
        max-width: 992px;
        text-align: center;
        color: ${props => props.theme.gray};
        font-family: Verdana;
        font-weight: 600;
    }
`;

const mapStateToProps = state => {
    return {
      dropdown: state.dropdown,
      itineraries: state.itineraries,
      filter: state.filter,
      form: state.form
    }
}

const mapDispatchToProps = {
    toggleDropdown
}

let Index = ({dropdown, toggleDropdown, itineraries, filter, form}) => {

    //filter itinerary by search bar query
    if(filter) itineraries = itineraries.filter(itinerary => itinerary.location.toLowerCase() === filter.toLowerCase());

    return (
        <Wrapper onClick={()=> {if(dropdown)toggleDropdown(false)}}>
            {form && <Form page='index'/>}
            <Tools page='index'/>
            <Container>
                {/* empty page state conditionals */}
                {itineraries.length === 0 && !filter && 
                    <Empty>
                        <div>You Have No Itineraries</div>
                    </Empty>
                }
                {itineraries.length === 0 && filter && 
                    <Empty>
                        <div>No Matching Itineraries</div>
                    </Empty>
                }
                {/* index is passed multiple times to swap updated index with outdate version is state */}
                {itineraries.map((itinerary,index) => <Itinerary itinerary={itinerary} index={index} key={itinerary.id}s/>)}
            </Container>
        </Wrapper>
    )
}

Index = connect(
    mapStateToProps,
    mapDispatchToProps
)(Index)

export default Index

  