const stateDefault = {
  arrMeal: [],
};

export const MealReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case "GET_LIST_MEAL": {
      state.arrMeal = action.arrMeal;
      return { ...state };
    }

    default:
      return state;
  }
};
