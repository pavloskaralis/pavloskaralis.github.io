import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App.js'
import {Router} from 'react-router-dom'
import history from './history.js'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './reducers/rootReducer.js'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'

// const loggerMiddleware = createLogger()

const store = createStore(
    rootReducer,
    applyMiddleware(thunkMiddleware)
)

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <App />
        </Router>
    </Provider>,
    document.getElementById('root')
)
