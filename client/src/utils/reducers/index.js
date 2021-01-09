import {combineReducers} from 'redux';
import { useProductReducer } from '../reducers';

const allReducers = combineReducers({
    update : useProductReducer,
})

export default allReducers;
