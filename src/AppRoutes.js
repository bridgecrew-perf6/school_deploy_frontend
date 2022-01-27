import React from "react";
import About from "./components/About";
import AllStudents from "./components/AllStudents";
import AllGrades from "./components/AllGrades";
import Admin from "./components/Admin";
import AdmitStudent from "./components/AdmitStudent";
import AddGrade from "./components/AddGrade";
import StudentUpdate from "./components/StudentUpdate";
import GradeUpdate from "./components/GradeUpdate";
import FeeStructure from "./components/FeeStructure";
import Signin from "./components/Signin";
import Signout from "./components/Signout";
import App from "./App";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Teacher from "./components/Teacher";
import HireTeacher from "./components/HireTeacher";
import AllTeachers from "./components/AllTeachers";
import Attendance from "./components/Attendance";
import AttendanceView from "./components/AttendanceView";
import { getToken, isSignedIn, ROLES } from "./helper";
// import Home from "./components/Home";
import Auth from "./context/auth";
import Test from "./components/Test";
import TeacherUpdate from "./components/TeacherUpdate";

function PrivateRoute({ children }) {
  const auth = getToken();
  return auth ? children : <Navigate to="/signin" />;
}

function AdminRoute({ children }) {
  const { user } = isSignedIn();
  return user && user.role === ROLES.ADMIN ? (
    children
  ) : (
    <Navigate to="/signin" />
  );
}

export default function AppRoutes() {
  return (
    <Auth>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route
            path="/teacher"
            element={
              <PrivateRoute>
                <Teacher />
              </PrivateRoute>
            }
          />
          <Route
            path="/allStudents"
            element={
              <PrivateRoute>
                <AllStudents />
              </PrivateRoute>
            }
          />
          <Route
            path="/allGrades"
            element={
              <PrivateRoute>
                <AllGrades />
              </PrivateRoute>
            }
          />
          <Route
            path="/admitStudent"
            element={
              <PrivateRoute>
                <AdmitStudent />
              </PrivateRoute>
            }
          />
          <Route
            path="/hireTeacher"
            element={
              <PrivateRoute>
                <HireTeacher />
              </PrivateRoute>
            }
          />
          <Route
            path="/allTeachers"
            element={
              <PrivateRoute>
                <AllTeachers />
              </PrivateRoute>
            }
          />
          <Route
            path="/teacher/:teacherId"
            element={
              <PrivateRoute>
                <TeacherUpdate />
              </PrivateRoute>
            }
          />
          <Route
            path="/addGrade"
            element={
              <PrivateRoute>
                <AddGrade />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/:registrationNumber"
            element={
              <PrivateRoute>
                <StudentUpdate />
              </PrivateRoute>
            }
          />
          <Route
            path="/grade/:gradeName"
            element={
              <PrivateRoute>
                <GradeUpdate />
              </PrivateRoute>
            }
          />
          <Route
            path="/feeStructure"
            element={
              <PrivateRoute>
                <FeeStructure />
              </PrivateRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <PrivateRoute>
                <Attendance />
              </PrivateRoute>
            }
          />
          <Route
            path="/attendanceView"
            element={
              <PrivateRoute>
                <AttendanceView />
              </PrivateRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signout" element={<Signout />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </Router>
    </Auth>
  );
}
