import dataReducer from "./dataReducer";
import {combineReducers} from "redux";
import citiesReducer from "./citiesReducer";
import formReducer from "./formReducer";
import decisionsReducer from "./decisionsReducer";
import dotsReducer from "./dotsReducer";
import routesReducer from "./routesReducer";
import itertionsReducer from "./itertionsReducer";

export default combineReducers({
    data: dataReducer,
    cities: citiesReducer,
    isFormOpen: formReducer,
    decisions: decisionsReducer,
    dots: dotsReducer,
    routes: routesReducer,
    iterations: itertionsReducer
})