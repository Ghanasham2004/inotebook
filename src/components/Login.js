import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const Login = (props) => {
  const host = "http://localhost:3005";
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  let navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
    // api call
    const response = await fetch(`${host}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const json = await response.json();
    if (json.success) {
      // Save the auth token and redirect
      localStorage.setItem("token", json.authToken);
      props.showAlert("Login Done Successful", "success");
      navigate("/");
    } else {
      props.showAlert("Please login with valid credentials", "danger");
    }
  }catch(err){
    props.showAlert("Internal Server Error", "danger");
  }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="container login">
      <form onSubmit={handleSubmit}>
        <h4 className="mb-3">Hey, Welcome Back!</h4>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            name="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            value={credentials.email}
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="form-control"
            id="exampleInputPassword1"
            value={credentials.password}
            onChange={onChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
