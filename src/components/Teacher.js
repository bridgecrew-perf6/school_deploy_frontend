import React, { useState } from "react";
import { Link } from "react-router-dom";
import Base from "./Base";
import { isSignedIn } from "../helper";

export default function Teacher() {
  const [auth, setAuth] = useState(isSignedIn());
  const teacherLeftSide = () => (
    <div className="card">
      <h4 className="card-header bg-dark text-white">Teacher Navigation</h4>
      <ul className="list-group">
        <li className="list-group-item">
          <Link className="nav-link text-success" to="/attendance">
            Take Attendance
          </Link>
        </li>
        <li className="list-group-item">
          <Link className="nav-link text-success" to="/allStudents">
            Student List
          </Link>
        </li>

        <li className="list-group-item">
          <Link className="nav-link text-success" to="/allGrades">
            Grade List
          </Link>
        </li>

        <li className="list-group-item">
          <Link className="nav-link text-success" to="/feeStructure">
            Fee Structure
          </Link>
        </li>
      </ul>
    </div>
  );
  const teacherRightSide = () => (
    <div className="card">
      <h4 className="card-header bg-dark text-white">Teacher Info</h4>
      <ul className="list-group">
        <li className="list-group-item">
          <p className="text-dark m-2">
            <span className="badge bg-success">Name:</span>
            {auth && auth.user.uname}
          </p>
          <p className="text-dark m-2">
            <span className="badge bg-success">Email:</span>
            {auth && auth.user.email}
          </p>
        </li>
      </ul>
    </div>
  );

  const teacherPage = () => (
    <div style={{ backgroundColor: "#2ecc72" }} className="container row p-3">
      <div className="col-3">{teacherLeftSide()}</div>
      <div className="col-9">{teacherRightSide()}</div>
    </div>
  );
  return (
    <Base
      title="Teacher"
      className="d-flex align-items-center justify-content-center flex-column"
    >
      {teacherPage()}
    </Base>
  );
}
