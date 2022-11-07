import {DRAW_CITIES} from "../types";

const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
    switch (action.type){
        case DRAW_CITIES:
            return action.payload
        default:
            return state
    }
}