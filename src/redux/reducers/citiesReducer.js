import {GENERATE_CITIES, SET_DATA} from "../types";

const INITIAL_STATE =  [];

export default (state = INITIAL_STATE, action) => {
    switch (action.type){
        case GENERATE_CITIES:
            return action.payload
        default:
            return state
    }
}