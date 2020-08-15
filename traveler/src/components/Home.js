import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import bg from '../images/bg.jpeg'
import toggleForm from '../actions/toggleForm.js'
import toggleDropdown from '../actions/toggleDropdown.js'
import Form from './Form.js'


const ImageOverlay = styled.div`
    z-index: -1;
    position: absolute;
    top: 60px; 
    width: 100%;
    height: calc(100% - 60px);
    min-height: 620px; 
    background-image: url(${bg});
    background-position: center;
    background-size: cover;
    opacity: .3;
    filter: blur(3px) grayscale(33%);

    @media (max-width: 992px) {
        min-height: 800px; 
    }

    @media (max-width: 499px) {
        min-height: 600px; 
    }
`;

const ColorOverlay = styled.div`
    z-index: -1;
    position: absolute;
    top: 60px; 
    width: 100%;
    height: calc(100% - 60px);
    min-height: 620px; 
    background-image: linear-gradient(
        to right,
        ${props => props.theme.blue} 0%,
        ${props => props.theme.blue} 64.75%,
        ${props => props.theme.cream} 65.25%,
        ${props => props.theme.cream} 100%
    );

    @media (max-width: 992px) {
        min-height: 800px; 
        background-image: linear-gradient(
            to right,
            ${props => props.theme.blue} 0%,
            ${props => props.theme.blue} 70.75%,
            ${props => props.theme.cream} 71.25%,
            ${props => props.theme.cream} 100%
        );
    }

    @media (max-width: 499px) {
        min-height: 600px; 
    }
`;

const GradientOverlay = styled.div`
    z-index: -1;
    position: absolute;
    top: 60px; 
    width: 100%;
    height: calc(100% - 60px);
    min-height: 620px; 
    background-image: linear-gradient(
        to bottom,
        rgba(0,0,0,.1)30%,
        rgba(0,0,0,.5)
    );

    @media (max-width: 992px) {
        min-height: 800px; 
    }

    @media (max-width: 499px) {
        min-height: 600px; 
    }
`;

const HomeContainer = styled.div`
    width: 100%;
    height: calc(100vh - 60px);
    display: flex;

    @media (max-width: 992px) {
        flex-direction: column;
        padding-top: 24px;
        box-sizing: border-box;
    }
`;

const HomeWrap = styled.div`
    height: calc(100vh - 60px);
    min-height: 620px; 
    width: 50%; 
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    @media (max-width: 992px) {
        height: ${props => props.mobile ? '25%' : '75%'};
        min-height: ${props => props.mobile ? '150px' : '610px'};
        width: 100%; 
        justify-content: ${props => props.mobile ? 'flex-start' : 'space-evenly'};
    }

    @media (max-width: 499px) {
        min-height: ${props => props.mobile ? '100px' : '300px'};
    }

    & h2 {
        margin: 0 auto;
        color: white;
        text-shadow: .05vw .05vw 0 ${props => props.theme.black};
        font-family: 'Georgia';
        font-size: 2vw; 
        cursor: default;

        @media (min-width: 993px)  and (max-width: 1200px) {
            font-size: 24px;
            min-width: 600px; 
            margin: 0 auto; 
            text-align: center;
        }

        @media (max-width: 992px) {
            font-size: 4vw; 
        }
    }
`;

const Slogan = styled.div`
    width: 100%;
    padding: 0 80px;
    box-sizing: border-box;

    & div {
        display: flex;
        justify-content: flex-end;
    }

    @media (min-width: 993px)  and (max-width: 1200px) {
        min-width: 560px;
    }
`;

const SloganText = styled.h1`
    margin: 0;
    height: 12vw; 
    width: 68%;
    font-size: 3vw;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-transform: uppercase;
    box-sizing: border-box;
    font-family: 'Verdana';
    text-shadow: -.05vw -.05vw 0 ${props => props.theme.black};
    box-shadow: .05vw .05vw 0 0 ${props => props.theme.black};
    cursor: default;
    color: ${props => props.plan ? props.theme.gray : props.theme.orange };  
    background-color: ${props => props.plan ? 'white' : props.theme.gray };

    @media (min-width: 993px)  and (max-width: 1200px) {
        height: 144px;
        min-width: 298px;
        font-size: 36px;
    }

    @media (max-width: 992px) {
        height: 24vw; 
        font-size: 6vw; 
        text-shadow: -.1vw -.1vw 0 ${props => props.theme.black};
        box-shadow: .1vw .1vw 0 0 ${props => props.theme.black};
    }

`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-evenly;
`;

const Button = styled.div`
    border-radius: .6vw;
    width: 14vw;
    height: 6vw;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 2vw;
    font-family: Verdana;
    box-shadow: .05vw .05vw 0 0 ${props => props.theme.black};
    cursor: pointer;
    background-color: ${props => props.signup ? props.theme.orange : props.theme.black};
    color: ${props => props.signup ? props.theme.black : 'white'};

    &:hover {
        background-color: ${props => props.signup ? props.theme.orangeHover : props.theme.blackHover};
    }

    @media (min-width: 993px)  and (max-width: 1200px) {
        width: 168px;
        height: 72px;
        font-size: 24px;
    }

    @media (max-width: 992px) {
        border-radius: 1.2vw;
        width: 28vw;
        height: 12vw;
        box-shadow: .1vw .1vw 0 0 ${props => props.theme.black};
        font-size: 4vw;
    }

`;

const mapStateToProps = state => {
    return {
      form: state.form,
      dropdown: state.dropdown
    }
}

const mapDispatchToProps = {
    toggleForm,
    toggleDropdown
}
  
let Home = ({toggleForm, form, dropdown, toggleDropdown}) => {
    return (
        <React.Fragment>
            {form && <Form page='home'/>}
            <ColorOverlay/>
            <ImageOverlay/>
            <GradientOverlay/>
            {/* close dropdown when off focus */}
            <HomeContainer onClick={()=>{if(dropdown)toggleDropdown(false)}}>
                    <HomeWrap>
                        <Slogan>
                            <SloganText plan>Plan {'\u00A0'} <br/> Early</SloganText>
                            <div>
                                <SloganText>& Relax.</SloganText>
                            </div>
                        </Slogan>
                        <h2>Have a big trip around the corner? &nbsp; <br/>
                        Invite your friends & plan together.</h2>
                    </HomeWrap>
                    <HomeWrap mobile>
                        <ButtonContainer>
                            <Button signup onClick={()=> toggleForm('sign up')}>Sign Up</Button>
                            <Button onClick={()=> toggleForm('log in')}>Log In</Button>
                        </ButtonContainer>
                    </HomeWrap>
            </HomeContainer>
        </React.Fragment>
    )
}

Home = connect(
    mapStateToProps,
    mapDispatchToProps
)(Home) 

export default Home

  