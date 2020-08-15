import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import searchIcon from '../images/search.png'
import leftIcon from '../images/left.png'
import rightIcon from '../images/right.png'
import setFilter from '../actions/setFilter.js'
import toggleTable from '../actions/toggleTable.js'

const Wrapper = styled.form`
  display: flex;
  height: 40px;
  min-width: ${props => props.page === 'index' ? '50%' : '0%'}; 
  border-radius: 8px;
  box-sizing: border-box;
  max-width: ${props => props.page === 'show' ? '400px' : ''};
  margin: ${props => props.page === 'show' ? '0 8px' : ''};
  background-color: white;

  & input, select {
    font-size: 16px;
    padding: 0 16px;
    width: calc(100% - 80px);
    font-family: Verdana;
    border-radius: 8px 0 0 8px;
    border: none;
    outline: none;
    box-sizing: border-box;

    @media (max-width: 499px) {
      max-width: 140px; 
    }
  }

  & select {
    min-height: 40px;
    text-align-last: center;
    padding-right: 20px; 
    min-width:  0px; 
    cursor: pointer; 

    @-moz-document url-prefix() {
      padding: 0;
    }
  }

  &:hover {
    box-shadow: 0 2px 2px 0 rgba(0,0,0,.5);
  }

`;

const Submit = styled.div`
  background-color: ${props => props.theme.black};
  width: 80px;
  height: 40px;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  background-image: url(${searchIcon});
  background-size: 20px;
  background-repeat: no-repeat;
  background-position: center;
  color: ${props => props.theme.opaque};

  &:hover {
    background-color: ${props => props.theme.blackHover};
  }
`;

const Arrow = styled(Submit)`
  background-size: 20px;
  min-width: 40px;
  max-width: 40px; 
  background-image: ${props => `url(${props.image})`};
  border-radius: ${props => props.radius}; 
`;


const mapStateToProps = state => {
  return {
    table: state.table,
    tables: state.itinerary.dates,
    itinerary: state.itinerary
  }
}

const mapDispatchToProps = {
  setFilter,
  toggleTable
}


// component has conditional css based on current table or show page
let Search = ({setFilter, page, tables, toggleTable, itinerary, table}) => {

  //conditional form submit 
  const submit = e => {
    e.preventDefault();
    
    switch(page) {
      case 'index': setFilter(query.value);
        break;
      case 'show': toggleTable(query.value);
        break;
      default: return;
    }
   
  }

  //required to update query value once submit is used; passed to left and right onClick
  const update = (nextTable) => document.querySelector('select').value = nextTable;

  //conditional table arrow button values
  let left;
  let right;
  if(tables){
    const currentIndex = tables.indexOf(table);
    left = currentIndex !== 0 ? tables[currentIndex - 1] : tables[tables.length - 1];
    right = currentIndex !== tables.length - 1 ? tables[currentIndex + 1] : tables[0];
  }

  //input reference
  let query;

  return (
      <Wrapper page={page} onSubmit={submit}>
        {page === 'show' && <Arrow radius='8px 0 0 8px' image={leftIcon} onClick={ ()=> {toggleTable(left); update(left)}}/>}
        {page === 'index' && <input type='text' ref={node => query = node} id='search'/>}
        {page === 'show' && itinerary &&       
          <select  onChange={()=>{toggleTable(query.value); update(query.value)}} ref={node => query = node} autoFocus >
              {itinerary.dates.map(date => {
                  return (
                      <option key={date} value={date}>{date}</option>
                  )
              })}
          </select>
        }
        {page === 'show' && <Arrow image={rightIcon} onClick={ ()=> {toggleTable(right); update(right)}}/>}
        {page === 'index' && <Submit onClick={e => {e.preventDefault(); setFilter(query.value)}}/>}
      </Wrapper> 
  )
}

Search = connect(
  mapStateToProps,
  mapDispatchToProps
)(Search)

export default Search

  