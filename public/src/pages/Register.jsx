import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import Logo from "../assets/logo.svg";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";

export default function Register() {

 //properties object that we want to show on website
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

     //object that we will get after hitting the submit button using usestate hook 
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

     const handleChange = (event) => {
    //this destructurises the input vaue and set the value to usestate hook
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  

     //this function is for input validation  
  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    //check for the same password entered 
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      //username length should be greater than 3
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      //passworrd should be greater than 8 
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      //email shoudn't be empty 
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };


  const handleSubmit = async (event) => {
    //without this we cant submit the form or navigate also without this only browser only refreshes the same page 
    event.preventDefault();

    //checking for handle validation function 
    if (handleValidation()) {
      const { email, username, password } = values;
      //fetching data from register route 
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      //checking the data status 
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        //storing our data in local storage 
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          //data converting into json string bcz browser storage only stores strings 
          JSON.stringify(data.user)
        );
        //this nevigates to the chat container 
        // navigate("/");
      }
    }
  };



  return (
    <>
    <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            {/* //change the name of app */}
            <h1>nexchat</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            //for every change in event this fires this handlechange function 
            onChange={(e) => handleChange(e)}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            //for every change in event this fires this handlechange function
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            //for every change in event this fires this handlechange function
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            //for every change in event this fires this handlechange function
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Create User</button>
          <span>
            Already have an account ? <Link to="/login">Login.</Link>
          </span>
        </form>
      </FormContainer>
      {/* without toast container this won't show error  */}
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div` height: 100vh;
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
  }`;


