import { Fragment, useEffect, useState } from "react";
import { Route, NavLink } from "react-router-dom";
import { history } from "../../App";

export const AdminTemplate = (props) => {
  const { Component, ...restProps } = props;

  return (
    <Route
      {...restProps}
      render={(propsRoute) => {
        if (localStorage.getItem("admin")) {
          return (
            <div>
              {/* Banner */}
              {/* <a
              href="#"
              className="btn w-full btn-primary text-truncate rounded-0 py-2 border-0 position-relative"
              style={{ zIndex: 1000 }}
            > */}
              {/* <strong>Project Healthy</strong> →
            </a> */}
              {/* Dashboard */}
              <div className="d-flex flex-column flex-lg-row h-lg-full bg-surface-secondary">
                {/* Vertical Navbar */}
                <nav
                  className="navbar show navbar-vertical h-lg-screen navbar-expand-lg px-0 py-3 navbar-light bg-white border-bottom border-bottom-lg-0 border-end-lg"
                  id="navbarVertical"
                >
                  <div className="container-fluid">
                    {/* Toggler */}
                    <button
                      className="navbar-toggler ms-n2"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#sidebarCollapse"
                      aria-controls="sidebarCollapse"
                      aria-expanded="false"
                      aria-label="Toggle navigation"
                    >
                      <span className="navbar-toggler-icon" />
                    </button>
                    {/* Brand */}
                    <a
                      className="navbar-brand py-lg-2 mb-lg-5 px-lg-6 me-0"
                      href="#"
                    >
                      <img
                        style={{ width: "200px", height: "200px" }}
                        src="../../image/logo.webp"
                        alt="..."
                      />
                    </a>
                    {/* User menu (mobile) */}
                    <div className="navbar-user d-lg-none"></div>
                    {/* Collapse */}
                    <div
                      className="collapse navbar-collapse"
                      id="sidebarCollapse"
                    >
                      {/* Navigation */}
                      <ul className="navbar-nav">
                        {/* <li className="nav-item">
                        <a className="nav-link" href="#">
                          <i className="bi bi-house" /> Dashboard
                        </a>
                      </li> */}
                        <li className="nav-item">
                          <NavLink to="/meal" className="nav-link">
                            <i className="bi bi-bar-chart" /> Thực Đơn
                          </NavLink>
                        </li>
                        {/* <li className="nav-item">
                        <a className="nav-link" href="#">
                          <i className="bi bi-chat" /> Messages
                          <span className="badge bg-soft-primary text-primary rounded-pill d-inline-flex align-items-center ms-auto">
                            6
                          </span>
                        </a>
                      </li> */}
                        <li className="nav-item">
                          <NavLink to="/exercises" className="nav-link">
                            <i className="bi bi-bookmarks" /> Bài tập
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink to="/user" className="nav-link">
                            <i className="bi bi-people" /> Người dùng
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink to="/planworkout" className="nav-link">
                            <i className="bi bi-bookmarks" /> Kế hoạch tập luyện
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink to="/category" className="nav-link">
                            <i className="bi bi-bookmarks" /> Loại kế hoạch
                          </NavLink>
                        </li>
                      </ul>
                      {/* Divider */}
                      <hr className="navbar-divider my-2 opacity-20" />
                      {/* Navigation */}

                      {/* Push content down */}
                      <div className="mt-10" />
                      {/* User (md) */}
                      <ul className="navbar-nav">
                        <li
                          className="nav-item"
                          onClick={() => {
                            localStorage.removeItem("admin");
                          }}
                        >
                          <NavLink to="/" className="nav-link">
                            <i className="bi bi-box-arrow-left" /> Đăng xuất
                          </NavLink>
                        </li>
                      </ul>
                    </div>
                  </div>
                </nav>
                {/* Main content */}
                <div className="h-screen flex-grow-1 overflow-y-lg-auto">
                  {/* Header */}
                  <header className="bg-surface-primary border-bottom pt-6"></header>
                  {/* Main */}
                  <main className="py-6 bg-surface-secondary">
                    <Component {...propsRoute} />
                  </main>
                </div>
              </div>
            </div>
          );
        }
        alert("Bạn không đủ quyền truy cập! Vui lòng đăng nhập vai trò admin");
        history.push("/");
      }}
    />
  );
};
