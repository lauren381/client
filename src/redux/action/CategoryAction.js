import { http } from "../../util/reponse";

export const GetListCategoryAction = () => {
  return async (dispatch) => {
    try {
      let result = await http.get("/category/getlistcategory");
      const action = {
        type: "GET_LIST_CATEGORY",
        arrCategory: result.data.data,
      };
      // console.log(result.data.data);
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};

export const CreateCategoryAction = (value) => {
  return async (dispatch) => {
    try {
      let result = await http.post("/category/createcategory", value);
      const action = GetListCategoryAction();
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};

export const UpdateCategoryAction = (value) => {
  return async (dispatch) => {
    try {
      let result = await http.post("/category/updatecategory", value);
      const action = GetListCategoryAction();
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};
export const SearchCategoryAction = (value) => {
  return async (dispatch) => {
    try {
      let result = await http.post("/category/searchcategory", value);
      const action = {
        type: "GET_LIST_CATEGORY",
        arrCategory: result.data.data,
      };
      // console.log(result.data.data);
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};
export const DeleteCategoryAction = (value, toast) => {
  return async (dispatch) => {
    try {
      let result = await http.delete(`/category/deletecategory/${value}`);
      const action = await GetListCategoryAction();
      dispatch(action);
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: `Xóa loại kế hoạch thành công`,
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
