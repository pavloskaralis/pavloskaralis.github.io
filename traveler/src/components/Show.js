import React, {useEffect, useCallback} from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import rowIcon from '../images/row.png'
import getItinerary from '../actions/getItinerary.js'
import postPlanningRow from '../actions/postPlanningRow.js'
import postSchedulingRow from '../actions/postSchedulingRow.js'
import toggleDropdown from '../actions/toggleDropdown.js'
import Tools from './Tools.js'
import Row from './Row.js'
import Form from './Form.js'

const Wrapper = styled.div`
    width: 100%;
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    background-color: ${props => props.theme.cream}; 
`;

const Table = styled.div`
    margin:0 auto; 
    max-width: 1200px;
    min-width: 300px; 
    width: 100%; 
    overflow: auto;
    height: calc(100% - 120px); 
    background-color: white; 
    display: table-row-group;
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

const Head = styled.div`
    max-width: 1200px;
    min-width: 768px;
    box-sizing: border-box;
    min-height: 60px;
    display: flex;
    padding: 0 8px;
    background-color: ${props => props.theme.black};
    text-transform: capitalize;
`;

const Body = styled.div`
    max-width: 1200px;
    min-width: 768px;
    box-sizing: border-box;
    min-height: calc(100% - 120px);
    height: calc(100% - 120px);
    overflow-y: auto;
    overflow-x: hidden;

    ::-webkit-scrollbar {
        width: 8px;    
        height: 8px;
        background-color: ${props => props.theme.gray};
      }
      ::-webkit-scrollbar-thumb {
          background-color: ${props => props.theme.black};   
      }
`;

const TH = styled.div`
    cursor: default;
    color: ${props => props.orange ? props.theme.orange : 'white'}; 
    font-weight: 600;
    box-sizing: border-box;
    min-height: 60px;
    width: 16.67%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    font-family: Verdana;
`;

const AddRow = styled.div`
    position: fixed;
    align-self: auto;
    max-width: 1200px;
    width: 100%;
    min-height: 60px; 
    justify-self: flex-end;
    min-height: 60px;
    background-image: url(${rowIcon});
    background-position: center;
    background-repeat: no-repeat;
    background-size: 35px;
    background-color: ${props => props.theme.black};
    overflow: hidden;
    cursor: pointer;

    &:hover {
        background-color: ${props => props.theme.blackHover};
    }
`;

const Empty = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center; 

    & div {
        position: fixed;
        width: 100%;
        text-align: center;
        color: ${props => props.theme.gray};
        font-family: Verdana;
        font-weight: 600;
        max-width: 1200px;
    }
`;

const mapStateToProps = state => {
    return {
      dropdown: state.dropdown,
      form: state.form,
      userID: state.userID,
      itinerary: state.itinerary,
      table: state.table
    }
}

const mapDispatchToProps = {
    getItinerary,
    postPlanningRow,
    postSchedulingRow,
    toggleDropdown
}

let Show = ({dropdown, toggleDropdown, form, getItinerary, postPlanningRow, postSchedulingRow, userID, itinerary, table}) => {
    //pass userID to ensure user is associated with itineraryID in url param
    useEffect(()=> {
        getItinerary(userID);
    },[])

  
    if(itinerary) console.log('itinerary', itinerary.scheduling_rows)
    // auto scroll to bottom on row creation; passed to add-row onClick
    const autoScroll = () => setTimeout(()=>document.querySelector('#body').scrollTop = document.querySelector('#body').scrollHeight, 100);
    return (
        // dropdown off focus click
        <Wrapper onClick={()=> {if(dropdown)toggleDropdown(false)}}>
            {form && <Form page='show'/>}
            <Tools page='show'/>
            <Table>
                <Head>
                    <TH orange>{table === 'Planning' ? 'Activity' : 'Time'}</TH>
                    <TH>{table === 'Planning' ? 'Type' : 'Activity'}</TH>
                    <TH>{table === 'Planning' ? 'Address' : 'Type'}</TH>
                    <TH>{table === 'Planning' ? 'Website' : 'Address'}</TH>
                    <TH>{table === 'Planning' ? 'Interest' : 'Website'}</TH>
                    <TH>{table === 'Planning' ? 'Schedule' : 'Remove'}</TH>
                </Head>
                <Body id='body'>
                    {/* render planning rows */}
                    {itinerary.planning_rows && table === 'Planning' && itinerary.planning_rows.sort((a,b) => a.id - b.id).map(planningRow => {
                        return (
                            <Row rowType='planning' row={planningRow} key={planningRow.id}/>
                        )
                    })}

                    {/* empty schedulowing table messsage */}
                    { itinerary && table !== 'Planning' && itinerary.scheduling_rows.filter(row => row.date === table).length === 0 &&
                        <Empty>
                            <div>You Have Nothing Scheduled On This Date</div>
                        </Empty>
                    }
                    
                    {/* render scheduling rows */}
                    {itinerary.scheduling_rows && (table !== 'Planning') && itinerary.scheduling_rows.sort((a,b)=> (parseFloat(a.time.replace(':','')) || 2500)  - (parseFloat(b.time.replace(':','')) || 2500)).map(schedulingRow => {
                        return (
                            // only render matching dates
                            (table === schedulingRow.date) && <Row rowType='scheduling' row={schedulingRow} key={schedulingRow.id}/>
                        )
                    })}
                </Body>
                {/* create scheduling or planning row based on table */}
                <AddRow onClick={table !== 'Planning' ? ()=> {postSchedulingRow(itinerary.id, table); ; autoScroll();} : ()=> {postPlanningRow(itinerary.id); autoScroll();}}/>
            </Table>
        </Wrapper>
    )
}

Show = connect(
    mapStateToProps,
    mapDispatchToProps
)(Show)

export default Show

  