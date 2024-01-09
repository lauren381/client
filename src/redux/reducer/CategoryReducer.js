const stateDefault = {
  arrCategory: [],
};

export const CategoryReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case "GET_LIST_CATEGORY": {
      state.arrCategory = action.arrCategory;
      return { ...state };
    }

    default:
      return state;
  }
};
