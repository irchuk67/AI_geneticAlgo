import {SET_DATA} from "../types";

const INITIAL_STATE =  {};

export default (state = INITIAL_STATE, action) => {
    switch (action.type){
        case SET_DATA:
            return action.payload
        default:
            return state
    }
}