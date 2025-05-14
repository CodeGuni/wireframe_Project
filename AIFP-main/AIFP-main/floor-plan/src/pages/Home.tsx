import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #121212; /* Dark background */
  color: #ffffff; /* Light text color */
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  background-color: #1e88e5; /* Darker blue */
  color: #ffffff; /* Light text color */
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1565c0; /* Even darker blue */
  }
`;

const Home: React.FC = () => {
    const navigate = useNavigate();

    const handleCreateNew = () => {
        navigate("/editor");
    };

    const handleLoadProject = () => {
        // Logic to load a saved project
        console.log("Load Project");
    };

    return (
        <HomeContainer>
            <h1>Welcome to Floor Plan Designer</h1>
            <Button onClick={handleCreateNew}>Create New Project</Button>
            <Button onClick={handleLoadProject}>Load Existing Project</Button>
        </HomeContainer>
    );
};

export default Home;
