import {GENERATE_NEW_GENERATION, MAKE_DECISIONS} from "../types";

const INITIAL_STATE =  [];

export default (state = INITIAL_STATE, action) => {
    switch (action.type){
        case MAKE_DECISIONS:
            return action.payload
        case GENERATE_NEW_GENERATION:
            return action.payload
        default:
            return state
    }
}