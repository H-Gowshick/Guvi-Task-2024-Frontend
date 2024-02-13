import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios"; // Add this line
import { useNavigate } from "react-router-dom";
axios.defaults.withCredentials = true;

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    dob: "",
    mobile: "",
    address: "",
  });
  // Add the following line to declare originalProfileData state
  const [originalProfileData, setOriginalProfileData] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [ageError, setAgeError] = useState("");
  const [dobError, setDOBError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [dataSaved, setDataSaved] = useState(false); // Track if data is initially saved

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("email")) {

      navigate("/login");
    }

    // Fetch profile data when component mounts
    fetchProfileData();
  }, []);

  const fetchProfileData = () => {
    const myValue = {
      email: localStorage.getItem("email"),
    };



    fetch("http://13.60.22.32:5000/profileHome", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(myValue),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((profileData) => {
      
        if (
          profileData.age === 0 &&
          profileData.gender === "Unknown" &&
          profileData.mobile === "N/A" &&
          profileData.address === "N/A"
        ) {
          // Handle the case when profile data meets certain criteria
        } else {
          
          setFormData(profileData);
          setOriginalProfileData(profileData); // Store the original data
          setDataSaved(true); // Data is initially saved
        }
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    // Client-side validation
    if (
      !formData.age ||
      !formData.gender ||
      !formData.dob ||
      !formData.mobile ||
      !formData.address
    ) {
      // Check if any required field is empty
      setErrorMessage("All fields need to be filled.");
      return;
    } else {
      setErrorMessage("");
    }

    if (formData.age < 18) {
      setAgeError("Age must be 18 or above.");
      return;
    } else {
      setAgeError("");
    }

    const currentDate = new Date();
    const dobDate = new Date(formData.dob);
    const maxDOBDate = new Date("2005-12-31");

    if (dobDate > currentDate || dobDate > maxDOBDate) {
      setDOBError("Date of Birth must be valid.");
      return;
    } else {
      setDOBError("");
    }

    if (formData.mobile.length !== 10) {
      setMobileError("Mobile number must be 10 digits long.");
      return;
    } else {
      setMobileError("");
    }

    try {
      // Make a POST or PUT request based on whether data is initially saved
      if (dataSaved) {
        // Check if any form field is different from the original data
        const isDataModified = Object.keys(formData).some(
          (key) => formData[key] !== originalProfileData[key]
        );

        if (isDataModified) {
          const data = {
            email: localStorage.getItem("email"),
            formData: formData,
          };
          const response = await fetch("http://13.60.22.32:5000/profileUpdate", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          setSuccessMessage("Profile updated successfully");
        }
      } else {
        const data = {
          email: localStorage.getItem("email"),
          formData: formData,
        };
        const response = await fetch("http://13.60.22.32:5000/profilePost", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        setSuccessMessage("Profile saved successfully");
        setDataSaved(true); // Data is now initially saved
      }
    } catch (error) {
      console.error("Error saving profile data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2>Profile Form</h2>
          <Button
            variant="outline-secondary"
            onClick={handleLogout}
            className="mb-2"
          >
            Logout
          </Button>{" "}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicAge">
              <Form.Label className="fw-bold mt-3">Age</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter age"
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
              {ageError && (
                <Form.Text className="text-danger">{ageError}</Form.Text>
              )}
            </Form.Group>

            <Form.Group controlId="formBasicGender">
              <Form.Label className="fw-bold mt-3">Gender</Form.Label>
              <Form.Control
                as="select"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formBasicDOB">
              <Form.Label className="fw-bold mt-3">Date of Birth</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter date of birth"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
              {dobError && (
                <Form.Text className="text-danger">{dobError}</Form.Text>
              )}
            </Form.Group>

            <Form.Group controlId="formBasicMobile">
              <Form.Label className="fw-bold mt-3">Mobile Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter mobile number"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
              />
              {mobileError && (
                <Form.Text className="text-danger">{mobileError}</Form.Text>
              )}
            </Form.Group>

            <Form.Group controlId="formBasicAddress">
              <Form.Label className="fw-bold mt-3">Address</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-4">
              {dataSaved ? "Update" : "Save"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileForm;
