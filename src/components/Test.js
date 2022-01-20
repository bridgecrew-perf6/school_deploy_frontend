import React, { useEffect, useState } from "react";
import { fetchGrades, API, getToken, postData } from "../helper";
import Base from "./Base";
import Loading from "./Loading";

export default function AttendanceView() {
  const [grades, setGrades] = useState([]);
  const [gradeName, setGradeName] = useState("");
  const [sections, setSections] = useState([]);
  const [sectionName, setSectionName] = useState("");
  const [attendances, setAttendances] = useState([]);
  const todayDate = new Date();
  const [values, setValues] = useState({
    startDate: todayDate.toISOString().split("T")[0],
    endDate: todayDate.toISOString().split("T")[0],
    dayCnt: 0,
  });

  const handleChange = (propName) => (event) => {
    if (event.target.files === null) {
      const value =
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value;
      // console.log(value);
      setValues((values) => {
        const oneDay = 1000 * 24 * 60 * 60;
        let d1, d2;
        if (propName === "startDate") {
          d1 = new Date(value);
          d2 = new Date(values.endDate);
        } else {
          d1 = new Date(values.startDate);
          d2 = new Date(value);
        }
        if (d2 > d1) {
          const dateDiff = d2 - d1;
          const dayCnt = Math.floor(dateDiff / oneDay);
          return { ...values, [propName]: value, dayCnt };
        } else {
          return { ...values, [propName]: value };
        }
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMetaData({ ...metaData, loading: true });
    try {
      const formBody = { ...values };

      const multipartBody = new FormData();
      for (const fieldName in formBody) {
        if (formBody[fieldName]) {
          multipartBody.set(fieldName, formBody[fieldName]);
        }
      }

      multipartBody.set("grade", gradeName);
      multipartBody.set("section", sectionName);

      const URL = API + `/attendanceView`;
      const token = getToken();

      const result = await postData(URL, token, multipartBody);
      setAttendances(result.data);
      setMetaData({ ...metaData, didRedirect: true, loading: false });
    } catch (error) {
      setMetaData({ ...metaData, error: error, loading: false });
      console.log(error);
    }
  };

  const [metaData, setMetaData] = useState({
    didRedirect: false,
    loading: false,
    error: "",
  });

  async function populateGrades() {
    setMetaData({ ...metaData, loading: true });
    const grades = await fetchGrades();
    setGrades([...grades]);
    setMetaData({ ...metaData, loading: false });
  }

  useEffect(() => {
    populateGrades();
  }, []);

  useEffect(() => {
    if (grades && grades.length > 0) {
      setGradeName(grades[0].gradeName);
    }
  }, [grades]);

  useEffect(() => {
    const choosenGrade = grades.find((grade) => grade.gradeName === gradeName);
    if (choosenGrade) {
      setSections(choosenGrade.sections);
    }
  }, [gradeName]);

  useEffect(() => {
    if (sections && sections.length > 0) {
      setSectionName(sections[0]);
    }
  }, [sections]);

  const handleGradeChange = (event) => {
    event.preventDefault();
    setGradeName(event.target.value);
  };

  const handleSectionChange = (event) => {
    event.preventDefault();
    setSectionName(event.target.value);
  };

  const getGradeOptionList = (grades) => {
    return (
      grades &&
      grades.map((grade, idx) => (
        <option key={idx} value={grade.gradeName}>
          {grade.gradeName}
        </option>
      ))
    );
  };

  const getSectionOptionList = (sections) => {
    return (
      sections &&
      sections.map((section, idx) => (
        <option key={idx} value={section}>
          {section}
        </option>
      ))
    );
  };

  const getStudentAttendanceList = (attendances) => {
    const regNums = new Set(attendances.map((a) => a.registrationNumber));
    let studentAttendanceList = [];
    for (const reg of regNums) {
      studentAttendanceList.push(
        attendances.filter((a) => a.registrationNumber === reg)
      );
    }
    return studentAttendanceList;
  };

  const getRowData = (attendance, headerList) => {
    attendance.sort((A, B) => A.date <= B.date);
    const datePresentMap = {};
    for (const adata of attendance) {
      datePresentMap[adata.date.split("T")[0]] = adata.present;
    }

    const rowData = [
      attendance[0].registrationNumber,
      attendance[0].studentName,
    ];

    for (let i = 3; i < headerList.length; i++) {
      if (datePresentMap[headerList[i]] === undefined) {
        rowData.push("---");
      } else if (typeof datePresentMap[headerList[i]] === "boolean") {
        rowData.push(datePresentMap[headerList[i]] ? "YES" : "NO");
      }
    }
    return rowData;
  };

  const constructTableBody = (attendances, headerList) => {
    const studentAttendanceList = getStudentAttendanceList(attendances);

    return studentAttendanceList.map((attendance, idx) => {
      const rowData = getRowData(attendance, headerList);

      // console.log(rowData);

      return (
        <tr key={attendance[0]._id}>
          <th scope="row">{idx + 1}</th>
          {rowData.map((x, idx) => (
            <td key={idx}>{x}</td>
          ))}
        </tr>
      );
    });
  };

  const getHeaderList = () => {
    const headerList = ["Row", "Reg No.", "Name"];
    const startDate = new Date(values.startDate);

    for (let i = 0; i <= values.dayCnt; i++) {
      const currDate = new Date(startDate);
      currDate.setDate(startDate.getDate() + i);
      headerList.push(currDate.toISOString().split("T")[0]);
    }
    return headerList;
  };

  const createAttendanceList = (attendances) => {
    const headerList = getHeaderList();

    return (
      <div className="m-3 border border-warning border-2 rounded">
        <table className="table text-white" id="attendanceTable">
          <thead>
            <tr>
              {headerList.map((headerName) => (
                <th scope="col" key={headerName}>
                  {headerName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{constructTableBody(attendances, headerList)}</tbody>
        </table>
      </div>
    );
  };

  const attendanceViewPage = () => (
    <Base
      title="Attendance Page"
      className="container d-flex flex-column align-items-center"
    >
      <div className="border border-success border-5 my-5 p-5 w-50 rounded">
        <div className="container d-flex flex-column">
          <div className="row mb-3">
            <label htmlFor="gradeName" className="col-sm-3 col-form-label">
              Grade
            </label>
            <div className="col-sm-7">
              <select
                className="form-control"
                id="gradeName"
                name="gradeName"
                value={gradeName}
                onChange={handleGradeChange}
              >
                {getGradeOptionList(grades)}
              </select>
            </div>
          </div>

          <div className="row mb-3">
            <label htmlFor="sectionName" className="col-sm-3 col-form-label">
              Section
            </label>
            <div className="col-sm-7">
              <select
                className="form-control"
                id="sectionName"
                name="sectionName"
                value={sectionName}
                onChange={handleSectionChange}
              >
                {getSectionOptionList(sections)}
              </select>
            </div>
          </div>

          <form>
            <div className="row mb-3">
              <label htmlFor="startDate" className="col-sm-3 col-form-label">
                Start Date
              </label>
              <div className="col-sm-7">
                <input
                  className="form-control"
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={values.startDate}
                  onChange={handleChange("startDate")}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="endDate" className="col-sm-3 col-form-label">
                End Date
              </label>
              <div className="col-sm-7">
                <input
                  className="form-control"
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={values.endDate}
                  onChange={handleChange("endDate")}
                />
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <button
                type="button"
                onClick={handleSubmit}
                className="btn btn-success"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      {attendances.length === 0 ? (
        ""
      ) : (
        <div className="d-flex flex-column justify-content-center align-items-center border border-success border-5 my-5 rounded">
          {createAttendanceList(attendances)}
        </div>
      )}
    </Base>
  );

  return metaData.loading ? Loading() : attendanceViewPage();
}
