import React, { useEffect, useState, useRef } from "react";
import apiClient from "../utils/apiClient";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import { LOCAL_STORAGE_KEY } from "../utils/constants";

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const socket = useRef();

  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  // Validate user on mount & auto-invalidate if deleted
  useEffect(() => {
    const validateUser = async () => {
      const userItem = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!userItem) {
        if (location.pathname !== "/login") {
          navigate("/login", { replace: true });
        }
        return;
      }
      const user = JSON.parse(userItem);
      try {
        await apiClient.get(`${allUsersRoute}/${user._id}`);
        setCurrentUser(user);
      } catch (err) {
        console.warn("User validation failed:", err);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        if (location.pathname !== "/login") {
          navigate("/login", { replace: true });
        }
      }
    };

    validateUser();
  }, [navigate, location.pathname]);

  // Socket.IO setup
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

  // Fetch contacts; auto-logout if backend no longer recognizes user
  useEffect(() => {
    if (!currentUser) {
      setContacts([]);
      return;
    }

    const fetchContacts = async () => {
      if (!currentUser.isAvatarImageSet) {
        navigate("/setavatar", { replace: true });
        return;
      }

      try {
        const { data } = await apiClient.get(
          `${allUsersRoute}/${currentUser._id}`
        );

        if (Array.isArray(data)) {
          setContacts(data);
        } else {
          console.warn("Unexpected contacts response:", data);
          setContacts([]);
        }
      } catch (err) {
        console.warn("Contact fetch failed:", err);
        setContacts([]);
      }
    };

    fetchContacts();
  }, [currentUser, navigate, location.pathname]);

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

