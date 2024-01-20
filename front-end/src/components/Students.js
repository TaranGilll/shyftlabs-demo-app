import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Students() {
  const [firstName, setFirstName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [students, setStudents] = useState([]);

  // GET STUDENTS FROM DATABASE
  useEffect(() => {
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
        setStudents(data.students);
      })
      .catch((error) => {
        console.log("Error fetching students!");
      });
  }, []);

  // HANDLE CREATION OF STUDENT
  const handleSubmit = () => {
    if (firstName === "") {
      toast.error("First name cannot be empty!");
    } else if (familyName === "") {
      toast.error(`Family name cannot be empty!`);
    } else if (dateOfBirth === "") {
      toast.error(`Date of birth name cannot be empty!`);
    } else {
      const dateFormat = /^\d{4}-\d{2}-\d{2}$/;

      // check for invalid date format or invald dates like 2003-01-99
      if (!dateFormat.test(dateOfBirth)) {
        toast.error(
          `Please enter a valid date of birth following the YYYY-MM-DD pattern!`
        );
        return;
      }

      // check age >= 10 years - converted all times to UTC
      const enteredDate = new Date(`${dateOfBirth}T00:00:00Z`);
      if(isNaN(enteredDate)) {
        toast.error(
          `Please enter a valid date of birth!`
        );
        return;
      }

      const currentDate = new Date();
      const ageOfBirth = currentDate.getUTCFullYear() - enteredDate.getUTCFullYear();
      if (ageOfBirth < 10) {
        toast.error(`Student must be at least 10 years old!`);
        return;
      }
      if (
        ageOfBirth == 10 &&
        !(
          currentDate.getUTCMonth() > enteredDate.getUTCMonth() ||
          (currentDate.getUTCMonth() === enteredDate.getUTCMonth() &&
            currentDate.getUTCDate() >= enteredDate.getUTCDate())
        )
      ) {
        toast.error(`Student must be at least 10 years old!`);
        return;
      }

      // send student to backend
      fetch(
        "https://rpm45cf6jl.execute-api.us-east-1.amazonaws.com/Stage/students",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            mode: "no-cors",
          },
          body: JSON.stringify({
            firstName: firstName,
            familyName: familyName,
            dateOfBirth: dateOfBirth,
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          // if successful notify user
          toast.success(`${firstName} ${familyName} was saved successfully!`);
          setStudents([...students, data.student]);
          setFirstName("");
          setFamilyName("");
          setDateOfBirth("");
        })
        .catch((error) => console.log("Error posting student!"));
    }
  };

  return (
    <div className="content">
      <div>
        <Toaster />
      </div>
      <h2 className="title">Students</h2>
      <div style={{ display: "flex" }}>
        <div className="createStd">
          <b>Create New Student</b>
          <Form>
            <Form.Group className="formInput">
              <Form.Label className="formLabel">First Name</Form.Label>
              <Form.Control
                placeholder="Enter First Name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group className="formInput">
              <Form.Label className="formLabel">Family Name</Form.Label>
              <Form.Control
                placeholder="Enter Family Name"
                value={familyName}
                onChange={(e) => {
                  setFamilyName(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group className="formInput">
              <Form.Label className="formLabel">Date of Birth</Form.Label>
              <Form.Control
                placeholder="YYYY-MM-DD"
                value={dateOfBirth}
                onChange={(e) => {
                  setDateOfBirth(e.target.value);
                }}
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
          <b>List of Students</b>
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
                <th>First Name</th>
                <th>Family Name</th>
                <th>Date of Birth</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, index) => (
                <tr key={index} className="stdItem">
                  <td>{index + 1}</td>
                  <td>{s.firstName}</td>
                  <td>{s.familyName}</td>
                  <td>{s.dateOfBirth}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
