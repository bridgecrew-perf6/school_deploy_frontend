import React, { useEffect, useState } from "react";
import { API, fetchData, getToken } from "../helper";
import Base from "./Base";

export default function AllTeachers() {
  const [teachers, setTeachers] = useState([]);

  async function fetchTeachers() {
    const URL = API + "/allTeachers";
    const token = getToken();
    const data = await fetchData(URL, token);
    setTeachers(data);
  }

  useEffect(() => {
    fetchTeachers();
  }, []);

  function contructTableBody() {
    return teachers.map((teacher, idx) => {
      // const updateLink = "/teacher/" + teacher._id;
      return (
        <tr key={idx}>
          <th scope="row">{idx + 1}</th>
          <td>{teacher._id}</td>
          <td>{teacher.uname}</td>
          <td>{teacher.email}</td>
          <td>{teacher.contactNumber}</td>
          <td>{teacher.aadharNum}</td>
        </tr>
      );
    });
  }

  const createTeacherList = () => (
    <table className="table text-white">
      <thead>
        <tr>
          <th scope="col">Row</th>
          <th scope="col">ID</th>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Contact</th>
          <th scope="col">Aadhar Number</th>
        </tr>
      </thead>
      <tbody>{contructTableBody()}</tbody>
    </table>
  );

  return <Base title="Teachers List">{createTeacherList()}</Base>;
}
