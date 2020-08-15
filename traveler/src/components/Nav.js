import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import toggleDropdown from '../actions/toggleDropdown.js'
import Dropdown from './Dropdown.js'

const NavStyle = styled.nav`
    height: 60px;
    width: 100%;
    background-color: ${props => props.theme.black};
    display: flex;
    justify-content: space-between;
    z-index: 3;

    & h2 {
        padding-left: 16px;
        align-self: center;
        margin: 0; 
        color: ${props => props.theme.orange};
        font-family: Georgia;
        cursor: default;
        display:block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
    }
`;

const DropdownContainer = styled.div`
    height: 60px; 
    min-width: 60px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px 16px; 
    box-sizing: border-box;
    cursor: pointer;  

    & span {
        height: 2px;
        cursor: pointer;
        background-color: white;
        display: block;
    }

    &:hover span{
        background-color: ${props => props.theme.gray};
    }
`;

const mapStateToProps = state => {
    return {
        dropdown: state.dropdown,
        location: state.itinerary.location
    }
}

const mapDispatchToProps = {
    toggleDropdown
}

let Nav = ({dropdown, toggleDropdown, location}) => {

    const url = window.location.href;
    const regex = new RegExp(/\/\d+\/\d+/);
    //detect current page by url
    const showPage = regex.test(url) ? true : false;
    //title conditional based on current page and page loading state 
    let title;
    if(!location && showPage) {
        title = 'Loading...';
    } else if (location && showPage) {
        title = location.slice(0, 1).toUpperCase() + location.slice(1);
    } else {
        title = 'Traveler'
    }

    return (
        <NavStyle>
            {/* nav title changes to location on edit form and show page */}
            <h2>{title}</h2>
            <DropdownContainer onClick={() => toggleDropdown(!dropdown)}>
                {/* hamburder dropdown; thanks Madeline! */}
                <span> </span>
                <span> </span>
                <span> </span>
            </DropdownContainer>
            {dropdown && <Dropdown/>}
        </NavStyle>
    )
}

Nav = connect(
    mapStateToProps,
    mapDispatchToProps
)(Nav)

export default Nav

  