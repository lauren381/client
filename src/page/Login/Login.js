import React from "react";
import { useFormik } from "formik";
import { history } from "../../App";
export default function Login() {
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: (value) => {
      if (value.username === "admin" && value.password === "1234") {
        history.push("/meal");
        localStorage.setItem("admin", "admin");
      } else {
        alert("Vui lòng đăng nhập với vai trò admin");
      }
    },
  });
  return (
    <div className="container" style={{ marginTop: "100px" }}>
      <div className="row m-5 no-gutters shadow-lg">
        <div className="col-md-6  d-md-block">
          <img
            src="./../image/banner.jpg"
            className="img-fluid"
            style={{ minHeight: "100%" }}
          />
        </div>
        <div className="col-md-6 bg-white p-5 form-login">
          <h3 className="pb-3">Đăng nhập</h3>
          <div className="form-style">
            <form onSubmit={formik.handleSubmit}>
              <div className="form-group pb-3">
                <input
                  type="text"
                  placeholder="Username"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  name="username"
                  onChange={formik.handleChange}
                />
              </div>
              <div className="form-group pb-3">
                <input
                  type="password"
                  placeholder="Password"
                  className="form-control"
                  id="exampleInputPassword1"
                  name="password"
                  onChange={formik.handleChange}
                />
              </div>
              <div className="pb-2">
                <button
                  type="submit"
                  className="btn btn-dark w-100 font-weight-bold mt-2"
                >
                  Đăng nhập
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
