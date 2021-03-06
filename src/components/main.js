import React from 'react'
import {connect} from 'react-redux'
import {getProductsQ} from '../queries/products'
import {getRelativeDateOrNot, handleObserver, handleInactivityTime} from '../utils/utils'
import Loader from '../components/loader'
import Ad from '../components/ad'

// main component
function Main({dispatch, state}){
    React.useEffect(()=>{
        // get initial back of products products
        getProductsQ(dispatch, state);

        // observer to observe end of page
        handleObserver()

        // update products when idle for 7 seconds
        handleInactivityTime()
        
        
    }, [])




    // function to handle sorting and get initial sorted products
    const handleSort=(event)=>{
        event.preventDefault()
        state.reducer['sortby'] = event.target.value
        state.reducer['page'] = 1
        dispatch({type:'SET_STATE', state: {...state.reducer}})
        getProductsQ(dispatch, state)
    }
      
    return(
        <div className="is-flex is-flex-direction-column is-justify-content-center is-align-content-center p-4">
            
            <div className="is-flex is-justify-content-center">
                {/* sort options */}
                <div className="is-flex p-2">
                <div className="m-2 is-size-4">sort</div>
                <div className="select" onChange={handleSort} >
                    <select>
                        <option>{null}</option>
                        <option>date</option>
                        <option>size</option>
                        <option>price</option>
                        
                    </select>
                </div>
                </div>
                </div>
                {/* products grid */}
            <div className="grid-container">
                {/* show loading before products are loader */}
                {state.reducer.data && state.reducer.data.length > 0 ? 
                    state.reducer.data.map(face=>{
                        return (
                            <>                            
                                <div key={face.id} className="grid-item is-flex is-flex-direction-column is-justify-content-center p-4 m-2">
                                    
                                    <div className="product p-2 is-flex is-justify-content-center is-align-items-center" style={{fontSize: face.size, color: 'green'}}>{face.face}</div>
                                    <div className="p-2" >{getRelativeDateOrNot(face.date)}</div>
                                    <div className="p-2" >size: {face.size} px</div>
                                    <div className="p-2 is-size-4"> Price: ${face.price}</div>
                                    
                                </div>
                                {state.reducer.data && state.reducer.data.indexOf(face) !== 0 && state.reducer.data.indexOf(face) % 20 === 0 ? <Ad  key={state.reducer.data.indexOf(face)}/> : null }
                            </>
                            
                            )
                    })
                    : <Loader/>}
                </div>
                {/* show loading on end of page when updating */}
                {state.reducer.loading ? <Loader/> : null}
                {/* show 'no more products' message when no more products left */}
                {state.reducer.endOfData ? <div style={{height:"300px"}} className="p-4 is-size-1 is-flex is-justify-content-center">No more data to load</div>:null}
                {/* observer area */}
                <div id="loading-area" className="mt-8"></div>
            </div>
    )
}

export default connect((state, dispatch)=>({state, dispatch}))(Main)