const stateDefault = {
    arrUser: [],
  };
  
  export const UserReducer = (state = stateDefault, action) => {
    switch (action.type) {
      case "GET_LIST_USER": {
        state.arrUser = action.arrUser;
        return { ...state };
      }
  
      default:
        return state;
    }
  };
  