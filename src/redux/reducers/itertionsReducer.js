import {ADD_NEW_ITERATION} from "../types";

const INITIAL_STATE = 0;

export default (state = INITIAL_STATE, action) => {
    switch (action.type){
        case ADD_NEW_ITERATION:
            return state += action.payload
        default:
            return state
    }
}