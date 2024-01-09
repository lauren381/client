import { http } from "../../util/reponse";

export const GetListMealAction = () => {
  return async (dispatch) => {
    try {
      let result = await http.get("/meals/getlistmeals");
      const action = {
        type: "GET_LIST_MEAL",
        arrMeal: result.data.data,
      };
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};

export const SearchMealAction = (value) => {
  return async (dispatch) => {
    try {
      let result = await http.post("/meals/searchmealname", value);
      const action = {
        type: "GET_LIST_MEAL",
        arrMeal: result.data.data,
      };
      // console.log(result.data.data);
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};

export const CreateMealAction = (value) => {
  return async (dispatch) => {
    try {
      let result = await http.post("/meals/createmeal", value);
      const action = await GetListMealAction();
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};

export const UpdateMealAction = (value) => {
  return async (dispatch) => {
    try {
      let result = await http.post("/meals/updatemeal", value);
      const action = await GetListMealAction();
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};

export const DeleteMealAction = (value, toast) => {
  return async (dispatch) => {
    try {
      let result = await http.delete(`/meals/deletemeal/${value}`);
      const action = await GetListMealAction();
      dispatch(action);
      console.log(123);
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: `Xóa thực phẩm thành công`,
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
