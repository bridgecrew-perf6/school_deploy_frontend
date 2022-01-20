import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getToken, isAdmin, isSignedIn, isTeacher } from "../helper";

const currentTab = (location, path) => {
  return { color: location.pathname === path ? "#2ecc72" : "#FFFFFF" };
};

export default function Header() {
  const [auth, setAuth] = useState(isSignedIn());
  const location = useLocation();
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand text-white" to="/">
          Sunrise Public School
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                style={currentTab(location, "/")}
                className="nav-link"
                aria-current="page"
                to="/"
              >
                Home
              </Link>
            </li>
            {auth && isAdmin(auth.user) && (
              <li className="nav-item">
                <Link
                  style={currentTab(location, "/admin")}
                  className="nav-link"
                  aria-current="page"
                  to="/admin"
                >
                  Dashboard
                </Link>
              </li>
            )}
            {auth && isTeacher(auth.user) && (
              <li className="nav-item">
                <Link
                  style={currentTab(location, "/teacher")}
                  className="nav-link"
                  aria-current="page"
                  to="/teacher"
                >
                  Dashboard
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link
                style={currentTab(location, "/about")}
                className="nav-link"
                to="/about"
              >
                About
              </Link>
            </li>
            {getToken() ? (
              <li className="nav-item">
                <Link
                  style={currentTab(location, "/signout")}
                  className="nav-link"
                  to="/signout"
                >
                  Signout
                </Link>
              </li>
            ) : (
              <li className="nav-item">
                <Link
                  style={currentTab(location, "/signin")}
                  className="nav-link"
                  to="/signin"
                >
                  Signin
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
