import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate(); // Initialize navigate function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous error messages
    setError("");
    setSuccess(false);

    // Validation checks
    if (!formData.email) {
      setError("Email is required.");
      return;
    }
    if (!formData.password) {
      setError("Password is required.");
      return;
    }

    try {
      // Make login request
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Handle response
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to log in");
      }

      console.log("Login successful:", data);

      setSuccess(true);

      // Redirect to profile page after 5 seconds
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (error) {
      console.error("Error logging in:", error.message);
      setError(error.message);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center ">
        <h2>Login</h2>
        <Col md={6} className="mt-5">
          {error && !success && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">Login successful, you will be redirected to your profile page</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label className="fw-bold mt-3">Email address</Form.Label>
              <Form.Control
                type="email"
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

            <div className="mt-3">
              <span>Don't have an account? </span>
              <Link to="/">Register</Link>
            </div>

            <Button variant="primary" className="mt-3" type="submit">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
