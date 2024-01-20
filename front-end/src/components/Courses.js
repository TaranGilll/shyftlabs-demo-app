import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Courses() {
  const [courseName, setCourseName] = useState("");
  const [courseStudents, setCourseStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  // GET STUDENTS & COURSES FROM DATABASE
  useEffect(() => {
    // fetching students
    fetch(
      "https://rpm45cf6jl.execute-api.us-east-1.amazonaws.com/Stage/students",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          mode: "no-cors",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        let studs = [];
        data.students.forEach((s) =>
          studs.push({ value: s, label: `${s.firstName} ${s.familyName}` })
        );
        setStudents(studs);
      })
      .catch((error) => {
        console.log("Error fetching students!" + error);
      });

    // fetching courses
    fetch(
      "https://rpm45cf6jl.execute-api.us-east-1.amazonaws.com/Stage/courses",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          mode: "no-cors",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses);
      })
      .catch((error) => {
        console.log("Error fetching courses!");
      });
  }, []);

  const handleSubmit = () => {
    if (courseName === "") {
      toast.error("Course name cannot be empty!");
      return;
    }

    // send course to backend
    let temp = [];
    courseStudents.forEach((c) => temp.push(c.value));
    fetch(
      "https://rpm45cf6jl.execute-api.us-east-1.amazonaws.com/Stage/courses",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          mode: "no-cors",
        },
        body: JSON.stringify({ courseName: courseName, courseStudents: temp }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        // if successful notify user
        toast.success(`${courseName} was saved successfully!`);
        setCourses([...courses, data.course]);
        setCourseStudents([]);
        setCourseName("");
      })
      .catch((error) => console.log("Error posting course!"));
  };

  return (
    <div className="content">
      <div>
        <Toaster />
      </div>
      <h2 className="title">Courses</h2>
      <div style={{ display: "flex" }}>
        <div className="createStd">
          <b>Create New Course</b>
          <Form>
            <Form.Group className="formInput">
              <Form.Label className="formLabel">Course Name</Form.Label>
              <Form.Control
                placeholder="Enter Course Name"
                value={courseName}
                onChange={(e) => {
                  setCourseName(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group className="formInput">
              <Form.Label className="formLabel">Add Students</Form.Label>
              <Select
                options={students}
                onChange={setCourseStudents}
                value={courseStudents}
                isMulti={true}
              />
            </Form.Group>

            <Button
              variant="primary"
              className="formInput"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Form>
        </div>
        <div style={{ display: "flex", flex: "1", flexDirection: "column" }}>
          <b>List of Courses</b>
          <Table
            striped
            bordered
            hover
            variant="dark"
            style={{ marginTop: "15px", textAlign: "center" }}
          >
            <thead>
              <tr>
                <th>#</th>
                <th>Course Name</th>
                <th>Course Students</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c, index) => (
                <tr key={index} className="stdItem">
                  <td>{index + 1}</td>
                  <td>{c.courseName}</td>
                  <td>
                    {JSON.stringify(
                      c.courseStudents.map(
                        (item) => `${item.firstName} ${item.familyName}`
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
