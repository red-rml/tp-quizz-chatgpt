"use client";
import styled from "@emotion/styled";
import { useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

export default function App() {
  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container>
      <Button
        onClick={() => {
          socket.emit("generate-quizz", {
            topics: ["sport", "musique"],
            difficulty: "facile",
            isMultiple: false,
          });
        }}
      >
        Créer le quizz
      </Button>
      <Question>Question ?</Question>
      <FormContainer>
        <AnswerForm>
          <Form.Check type="radio" id="answer-1" name="answer" label="AA" />
          <Form.Check type="radio" id="answer-2" name="answer" label="B" />
          <Form.Check type="radio" id="answer-3" name="answer" label="CCCCCC" />
          <Form.Check type="radio" id="answer-4" name="answer" label="D" />
        </AnswerForm>
      </FormContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;

const Question = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const AnswerForm = styled(Form)`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  & .form-check {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    & * {
      cursor: pointer;
      height: 40px;
    }
  }

  & label {
    display: flex;
    align-items: center;
    margin-left: 8px;
  }
`;
