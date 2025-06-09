import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import styled from "styled-components";
import apiClient from "../utils/apiClient";
import { logoutRoute } from "../utils/APIRoutes";
import { LOCAL_STORAGE_KEY } from "../utils/constants";
export default function Logout() {
  const navigate = useNavigate();

  
  const handleClick = async () => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) {
      navigate("/login");
      return;
    }
    const { _id } = JSON.parse(stored);
    const data = await apiClient.get(`${logoutRoute}/${_id}`);
    if (data.status === 200) {
      localStorage.clear();
      navigate("/login");
    }
  };
  return (
    <Button onClick={handleClick}>
      <BiPowerOff />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #5b8690;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.5rem;
    // color: #ebe7ff;
  }
`;