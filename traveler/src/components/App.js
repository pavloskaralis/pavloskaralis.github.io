import React, { useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import styled, {ThemeProvider} from 'styled-components'
import userSetup from '../actions/userSetup.js'
import Nav from './Nav.js'
import Home from './Home.js'
import Index from './Index.js'
import Show from './Show.js'

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%; 
  box-sizing: border-box;
  display: flex;         
  flex-direction: column;

  ::-webkit-scrollbar {
    width: 8px;    
    height: 8px;
    background-color: ${props => props.theme.gray};
  }
  ::-webkit-scrollbar-thumb {
      background-color: ${props => props.theme.black};   
  }
`;

const theme = {
    black: 'rgb(40, 40, 40)',
    orange: 'rgb(255,200,0)',
    blue: 'rgb(0, 190, 235)',
    cream: 'rgb(235, 225, 220)',
    gray: 'rgb(120,115,115)',
    opaque: 'rgba(0,0,0,0)', 
    orangeHover: 'rgb(255,220,20)',
    grayHover: 'rgb(140, 135, 135)',
    blackHover: 'rgb(55, 55, 55)',
};

const mapStateToProps = state => {
  return {
    isLoggedIn: state.isLoggedIn,
  }
}

const mapDispatchToProps = {
  userSetup,
}

let App = ({isLoggedIn,userSetup}) => {
  useEffect(userSetup,[])

  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        <Nav/>
        <Switch>
          {isLoggedIn && <Route path={'/:location'} render={()=> <Show/>}/>}  
          {/* null prevents index home page flash */}
          <Route path={'/'} render={()=> isLoggedIn === true? <Index/> : isLoggedIn === false? <Home/> : null}/>
        </Switch>
      </Wrapper>  
    </ThemeProvider>
  )
}

App = connect(
  mapStateToProps,
  mapDispatchToProps
)(App) 

export default App

  