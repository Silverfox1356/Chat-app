import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";

const LOCAL_STORAGE_KEY = "chat-app-user";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import { LOCAL_STORAGE_KEY } from "../utils/constants";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();

  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  // check auth & redirect once if needed
  useEffect(() => {
    const userItem = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!userItem) {
      navigate("/login", { replace: true });
    } else {
      const user = JSON.parse(userItem);
      setCurrentUser(user);
    }
  }, [navigate]);

  // socket setup
  useEffect(() => {
    if (!currentUser) return;

    socket.current = io(host, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
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
      socket.current.disconnect();
    };
  }, [currentUser]);

  // fetch contacts
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      if (!currentUser.isAvatarImageSet) {
        navigate("/setavatar", { replace: true });
        return;
      }

      try {
        const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data);
      } catch (err) {
        console.error("Error fetching contacts:", err);
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

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
