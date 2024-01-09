import { http } from "../../util/reponse";

export const GetListUserAction = () => {
  return async (dispatch) => {
    try {
      let result = await http.get("/user/getlistuser");
      const action = {
        type: "GET_LIST_USER",
        arrUser: result.data.data,
      };
      // console.log(result.data.data)
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};

export const SearchUserAction = (value) => {
  return async (dispatch) => {
    try {
      let result = await http.post("/user/searchuser", value);
      const action = {
        type: "GET_LIST_USER",
        arrUser: result.data.data,
      };
      // console.log(result.data.data)
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};

export const DeteleUserAction = (id) => {
  return async (dispatch) => {
    try {
      let result = await http.put(`/user/deleteuser/${id}`);
      const action = GetListUserAction();
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};
