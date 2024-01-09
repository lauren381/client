const stateDefault = {
  arrExercises: [],
};

export const ExercisesReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case "GET_LIST_EXERCISES": {
      state.arrExercises = action.arrExercises;
      return { ...state };
    }

    default:
      return state;
  }
};
