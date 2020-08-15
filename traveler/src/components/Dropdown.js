import React from 'react'
import styled from 'styled-components'
import logOut from '../actions/logOut.js'
import { connect } from 'react-redux'
import toggleForm from '../actions/toggleForm.js'

const Menu = styled.div`
    z-index: 1;
    position: absolute;
    width: 35%;
    background-color: ${props => props.theme.black};
    top: 60px;
    right: 0; 
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    box-shadow: -2px 0 2px 0 rgba(0,0,0,.5);
    border-bottom: 1px solid ${props => props.theme.gray};
    box-sizing: border-box;

    @media (max-width: 992px) {
        width: 29%;
    }

    & a, div {
        text-decoration-line: none;
        padding: 20px 16px;
        color: white;
        text-transform: capitalize;
        font-family: Verdana;
        border-top: 1px solid ${props => props.theme.gray};
        cursor: pointer;
        @media (max-width: 499px) {
            font-size: 12px; 
        }
    }

    & a:hover, div:hover {
        color: ${props => props.theme.gray};
    }
    
`;

const mapStateToProps = state => {
    return { isLoggedIn: state.isLoggedIn}
}

const mapDispatchToProps = {
    logOut,
    toggleForm
}

let Dropdown = ({isLoggedIn, logOut, toggleForm}) => {
    return (
        <Menu>
            {isLoggedIn ? 
                <React.Fragment>
                    <a href='/'>itineraries</a>
                    <a href='/' onClick={logOut}>log out</a>
                </React.Fragment> : 
                <React.Fragment>
                    <div onClick={()=> toggleForm('sign up')}>sign up</div>
                    <div onClick={()=> toggleForm('log in')}>log in</div>
                </React.Fragment>
            }
        </Menu>
    )
}

Dropdown = connect(
    mapStateToProps,
    mapDispatchToProps
)(Dropdown)

export default Dropdown

  