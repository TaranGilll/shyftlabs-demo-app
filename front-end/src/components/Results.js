import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Results() {
  const [courseName, setCourseName] = useState({});
  const [student, setStudent] = useState({});
  const [score, setScore] = useState({});
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
        let crs = [];
        data.courses.forEach((c) =>
          crs.push({ value: c, label: c.courseName })
        );
        setCourses(crs);
      })
      .catch((error) => {
        console.log("Error fetching courses!");
      });
  }, []);

  const handleSubmit = () => {
    if (!courseName.label) {
      toast.error("Course name cannot be empty!");
      return;
    }
    if (!student.label) {
      toast.error("Please select a student!");
      return;
    }
    if (!score.label) {
      toast.error("Please select a score!");
      return;
    }

    // send data to backend for saving
    let temp = student.value;
    temp.results = Object.fromEntries([[courseName.label, score.label]]);
    fetch(
      "https://rpm45cf6jl.execute-api.us-east-1.amazonaws.com/Stage/students",
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          mode: "no-cors",
        },
        body: JSON.stringify(temp),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        // if successful notify user
        toast.success(`Result was saved successfully!`);
        setCourseName({});
        setStudent({});
        setScore({});
      })
      .catch((error) => console.log("Error posting course!"));
  };

  return (
    <div className="content">
      <div>
        <Toaster />
      </div>
      <h2 className="title">Results</h2>
      <div style={{ display: "flex" }}>
        <div className="createStd">
          <b>Create New Result</b>
          <Form>
            <Form.Group className="formInput">
              <Form.Label className="formLabel">Course Name</Form.Label>
              <Select
                options={courses}
                onChange={setCourseName}
                value={courseName}
                isMulti={false}
              />
            </Form.Group>

            <Form.Group className="formInput">
              <Form.Label className="formLabel">Student Name</Form.Label>
              <Select
                options={students}
                onChange={setStudent}
                value={student}
                isMulti={false}
              />
            </Form.Group>

            <Form.Group className="formInput">
              <Form.Label className="formLabel">Score</Form.Label>
              <Select
                options={[
                  { value: "A", label: "A" },
                  { value: "B", label: "B" },
                  { value: "C", label: "C" },
                  { value: "D", label: "D" },
                  { value: "E", label: "E" },
                  { value: "F", label: "F" },
                ]}
                onChange={setScore}
                value={score}
                isMulti={false}
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
          <b>List of Results</b>
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
                <th>Course</th>
                <th>Student</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {students
                .filter((s) => s.value.results && Object.keys(s.value.results).length > 0)
                .map((s, index) => {
                  const key = Object.keys(s.value.results)[0];

                  return (
                    <tr key={index} className="stdItem">
                      <td>{index + 1}</td>
                      <td>{key}</td>
                      <td>{s.value.firstName + " " + s.value.familyName}</td>
                      <td>{s.value.results[key]}</td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
