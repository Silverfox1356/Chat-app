import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
export default function Welcome() {
  const [userName, setUserName] = useState("");

  //fetching the username from local storage  
  useEffect(() => {
    const fetchData = async ()=>{
        const data=await JSON.parse(
            localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
          ).username  ;
    setUserName(data);
}
fetchData();
  }, []);


  return (
    <Container>
      <img src={Robot} alt="" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: #20232a;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #5b8690;
  }
`;