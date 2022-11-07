import {CLOSE_FORM, OPEN_FORM} from "../types";

export default (state = true, action) => {
    switch (action.type){
        case OPEN_FORM:
            return action.payload
        case CLOSE_FORM:
            return action.payload
        default:
            return state
    }
}