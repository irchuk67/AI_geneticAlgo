import {DRAW_ROUTES} from "../types";

const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
    switch (action.type){
        case DRAW_ROUTES:
            return [...state, ...action.payload]
        default:
            return state
    }
}