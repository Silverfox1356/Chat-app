import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
  const navigate = useNavigate();
  //we use useref hook for sockets 
  //The object returned by useRef will not change between renders so he can store socket connection instances
  const socket = useRef();
  //all react usestate hooks
  //stores all the contacts which are online or login
  const [contacts, setContacts] = useState([]);
  //stores selected chat that we have to how on the right side 
  const [currentChat, setCurrentChat] = useState(undefined);
  //for footer we have to name current user 
  const [currentUser, setCurrentUser] = useState(undefined);


  //for fetching the user from local storage   
  useEffect(() => {
    const checkLocalStorage = async () => {
      const userItem = localStorage.getItem("chat-app-user");

      if (!userItem) {
        //if user not found then navigate to the login page
        navigate("/login");
      } else {
        //else set the current user in usestate
        const user = await JSON.parse(userItem);
        setCurrentUser(user);
      }
    };
    //first form a function and call it dont write it in one go 
    checkLocalStorage();
  }, [navigate]);


  //dealing with socket server
  useEffect(() => {
    //if we fetched currentuser then we 
    if (currentUser) {
      socket.current = io(host, {
        reconnectionAttempts: 5, // number of reconnection attempts before giving up
        reconnectionDelay: 1000, // delay between reconnection attempts in ms
      });
      
      socket.current.on("connect", () => {
        console.log("Socket connected:", socket.current.id);
        socket.current.emit("add-user", currentUser._id);
      });

      socket.current.on("disconnect", () => {
        console.log("Socket disconnected:", socket.current.id);
      });

      socket.current.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });

      return () => {
        //socket.current is used to maintain a single instance of the Socket.IO client across the component's lifecycle
        if (socket.current) {
          socket.current.disconnect();
        }
      };
    }
  }, [currentUser]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!currentUser) return;

        if (!currentUser.isAvatarImageSet) {
          navigate("/setavatar");
          return;
        }

        const response = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentUser, navigate]);



  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <Container>
      <div className="container">
        <Contacts contacts={contacts} changeChat={handleChatChange} />
        {currentChat === undefined ? (
          <Welcome />
        ) : (
          <ChatContainer currentChat={currentChat} socket={socket} />
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #282c34;
  .container {
    height: 85vh;
    width: 65vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    // media query 
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;