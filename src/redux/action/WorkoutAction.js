import { http } from "../../util/reponse";

export const GetListWorkoutAction = () => {
  return async (dispatch) => {
    try {
      let result = await http.get("/workout/getlistworkout");
      const action = {
        type: "GET_LIST_WORKOUT",
        arrWorkout: result.data.data,
      };
      // console.log(result.data.data)
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};
export const SearchWorkoutAction = (value) => {
  return async (dispatch) => {
    try {
      let result = await http.post("/workout/searchworkout", value);
      const action = {
        type: "GET_LIST_WORKOUT",
        arrWorkout: result.data.data,
      };
      // console.log(result.data.data)
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};

export const WorkoutDeleteMealAction = (id) => {
  return async (dispatch) => {
    try {
      let result = await http.delete(`/workout/deleteplanmeal/${id}`);
      const action = GetListWorkoutAction();
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};

export const WorkoutDeleteExercisesAction = (id) => {
  return async (dispatch) => {
    try {
      let result = await http.delete(`/workout/deleteplanexercises/${id}`);
      const action = GetListWorkoutAction();
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};

export const UpdateWorkoutAction = (value) => {
  return async (dispatch) => {
    try {
      let result = await http.post(`/workout/updateworkout`, value);
      const action = GetListWorkoutAction();
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};
export const UpdateWorkout1Action = (value) => {
  return async (dispatch) => {
    try {
      let result = await http.post(`/workout/updateworkout1`, value);
      const action = GetListWorkoutAction();
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};

export const CreateWorkoutAction = (value) => {
  return async (dispatch) => {
    try {
      let result = await http.post(`/workout/createworkout`, value);
      const action = GetListWorkoutAction();
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};

export const DeleteWorkoutAction = (value) => {
  return async (dispatch) => {
    try {
      let result = await http.put(`/workout/deleteworkout/${value}`);
      const action = GetListWorkoutAction();
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};

export const CreateDailyAction = (value) => {
  return async (dispatch) => {
    try {
      let result = await http.post(`/workout/createplandaily`, value);
      const action = GetListWorkoutAction();
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};

export const DeleteDailyAction = (value) => {
  return async (dispatch) => {
    try {
      let result = await http.delete(`/workout/deleteplandaily/${value}`);
      const action = GetListWorkoutAction();
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};
