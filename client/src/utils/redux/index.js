import { combineReducers, createStore } from "redux";
import useProductReducer from "../reducers";

const reducer = () => combineReducers({
  update: useProductReducer
});

const store = createStore(reducer);

export default store;
