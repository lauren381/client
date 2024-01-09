import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import reduxThunk from "redux-thunk";
import { MealReducer } from "./reducer/MealReducer";
import { ExercisesReducer } from "./reducer/ExercisesReducer";
import { UserReducer } from "./reducer/USerReducer";
import { WorkoutReducer } from "./reducer/WorkoutReducer";
import { CategoryReducer } from "./reducer/CategoryReducer";


const rootReducer = combineReducers({
    MealReducer,
    ExercisesReducer,
    UserReducer,
    WorkoutReducer,
    CategoryReducer,
});

let middleWare = applyMiddleware(reduxThunk);
let composeCustom = compose(middleWare);

export const store = createStore(rootReducer, composeCustom);
