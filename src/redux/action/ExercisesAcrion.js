import { http } from "../../util/reponse";

export const GetListExercisesAction = () => {
  return async (dispatch) => {
    try {
      let result = await http.get("/exercises/getlistexercises");
      const action = {
        type: "GET_LIST_EXERCISES",
        arrExercises: result.data.data,
      };
      // console.log(result.data.data);
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};

export const SearchExercisesAction = (value) => {
  return async (dispatch) => {
    try {
      let result = await http.post("/exercises/searchexercisesname", value);
      const action = {
        type: "GET_LIST_EXERCISES",
        arrExercises: result.data.data,
      };
      // console.log(result.data.data);
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};

export const UpdateExercisesAction = (value) => {
  return async (dispatch) => {
    try {
      let result = await http.post("/exercises/updateexercises", value);
      const action = await GetListExercisesAction();
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};

export const CreateExercisesAction = (value) => {
  return async (dispatch) => {
    try {
      let result = await http.post("/exercises/createexercises", value);
      const action = await GetListExercisesAction();
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};

export const DeleteExercisesAction = (value, toast) => {
  return async (dispatch) => {
    try {
      let result = await http.delete(`/exercises/deleteexercises/${value}`);
      const action = await GetListExercisesAction();
      dispatch(action);
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: `Xóa bài tập thành công`,
        life: 3000,
        options: {
          style: {
            zIndex: 100,
          },
        },
      });
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: "error",
        summary: "Xóa thất bại",
        detail: `${error.response.data.message}`,
        life: 3000,
        options: {
          style: {
            zIndex: 100,
          },
        },
      });
    }
  };
};
