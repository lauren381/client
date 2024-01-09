const stateDefault = {
    arrWorkout: [],
  };
  
  export const WorkoutReducer = (state = stateDefault, action) => {
    switch (action.type) {
      case "GET_LIST_WORKOUT": {
        state.arrWorkout = action.arrWorkout;
        return { ...state };
      }
  
      default:
        return state;
    }
  };
  