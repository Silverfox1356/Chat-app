import React, { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";
import { LOCAL_STORAGE_KEY } from "../utils/constants";

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",

  };
  useEffect(() => {
    if (localStorage.getItem(LOCAL_STORAGE_KEY)) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      const { data } = await apiClient.post(loginRoute, {
        username,
        password,
      });
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify(data.user)
        );

        navigate("/");
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>nexchat</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
            min="3"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Log In</button>
          <span>
            Don't have an account ? <Link to="/register">Create One.</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer class="toasted"/>
    </>
  );
}const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #282c34;
  
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 6rem;
    }
    h1 {
      color: #5b8690;
      text-transform: uppercase;
      font-size: 2.5rem;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background-color: #20232a;
    border-radius: 1.5rem;
    padding: 2.5rem 3.5rem;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
    transition: transform 0.3s ease-in-out;

    &:hover {
      transform: scale(1.03);
    }
  }

  input {
    background-color: #3a3f47;
    padding: 1rem;
    border: 0.1rem solid #5b8690;
    border-radius: 0.5rem;
    color: white;
    width: 100%;
    font-size: 1.2rem;
    transition: border-color 0.3s ease-in-out;

    &:focus {
      border: 0.1rem solid #21a1f1;
      outline: none;
    }
  }

  button {
    background-color: #5b8690;
    color: #20232a;
    padding: 1rem 2.5rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.5rem;
    font-size: 1.2rem;
    text-transform: uppercase;
    transition: background-color 0.3s ease-in-out;

    &:hover {
      background-color: #21a1f1;
    }
  }

  span {
    color: #5b8690;
    text-transform: uppercase;

    a {
      color: #21a1f1;
      text-decoration: none;
      font-weight: bold;
      transition: color 0.3s ease-in-out;

      &:hover {
        color: #61dafb;
      }
    }

  }
    .toasted{
    background-color:#61dafb;
    }
`;