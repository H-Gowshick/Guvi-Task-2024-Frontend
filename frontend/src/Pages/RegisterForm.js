import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if any field is empty
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields need to be filled.");
      return;
    }
    // Email validation

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      !emailRegex.test(formData.email) ||
      !formData.email.includes("@gmail.com")
    ) {
      setError("Please enter a valid Gmail address.");
      return;
    }

    // Password validation
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[^\w\d\s]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must contain at least 8 characters, including uppercase, lowercase, numbers, and symbols."
      );
      return;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to register user");
      }

      console.log("Registration successful:", formData);
      setError("");
      setSuccess(true); 
    } catch (error) {
      console.error("Error registering user:", error);
      setError("Failed to register user. Please try again later.");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center ">
        <h2>Register</h2>
        <Col md={6} className="mt-5">
          {error && <Alert variant="danger">{error}</Alert>}
          {success && (
            <Alert variant="success">Registration is successful. Go to the login!!</Alert>
          )}{" "}
   
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label className="fw-bold mt-3">Email address</Form.Label>
              <Form.Control
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label className="fw-bold mt-3">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicConfirmPassword">
              <Form.Label className="fw-bold mt-3">Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </Form.Group>
            <div className="mt-2">
         
              <span>Already have an account? </span>
              <Link to="/login">Login</Link>
            </div>
            <Button variant="primary" className="mt-3" type="submit">
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterForm;
