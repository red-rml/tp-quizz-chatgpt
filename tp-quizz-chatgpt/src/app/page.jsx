"use client";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Quiz from "react-quiz-component";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

export default function App() {
  const [questions, setQuestions] = useState();
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [selectedTopics, setSelectedTopics] = useState([
    "aviation",
    "cuisine",
    "art",
  ]);
  const [difficulty, setDifficulty] = useState("facile");
  const [isMultiple, setIsMultiple] = useState(false);

  const [isQuizzLoading, setIsQuizzLoading] = useState(false);

  useEffect(() => {
    socket.connect();
    socket.on("quizz", (questions) => {
      setQuestions(JSON.parse(questions).questions);
      setIsQuizzLoading(false);
    });

    socket.on("quiz-loading", () => setIsQuizzLoading(true));
    return () => {
      socket.disconnect();
    };
  }, []);

  if (isQuizzLoading && !questions)
    return <Container>Quiz en cours de création, veillez patienter.</Container>;
  let quiz;

  if (questions)
    quiz = {
      quizTitle: "Quiz",
      quizSynopsis: "",
      nrOfQuestions: numberOfQuestions,
      questions: questions.map((q) => ({
        question: q.question,
        questionType: "text",
        answerSelectionType: "single",
        answers: q.reponses,
        correctAnswer:
          console.log(
            q.reponses.findIndex((rep) => rep === q.bonne_reponse) + 1 + ""
          ) ?? q.reponses.findIndex((rep) => rep === q.bonne_reponse) + 1 + "",
        messageForCorrectAnswer: "Bonne réponse !",
        messageForIncorrectAnswer: "Mauvaise réponse !",
        explanation: q.explication,
        point: "10",
      })),
      appLocale: {
        landingHeaderText: "<questionLength> Questions",
        question: "Question",
        startQuizBtn: "Commencer le quiz",
        resultFilterAll: "Tout",
        resultFilterCorrect: "Correcte",
        resultFilterIncorrect: "Incorrecte",
        resultFilterUnanswered: "Non répondu",
        prevQuestionBtn: "Précédant",
        nextQuestionBtn: "Suivant",
        resultPageHeaderText:
          "Tu as terminé le quiz. Tu as <correctIndexLength>/<questionLength> bonnes réponses.",
        resultPagePoint: "Ton score est de <correctPoints>/<totalPoints>.",
        pauseScreenDisplay:
          "Le quiz est en pause. Clique sur continuer pour continuer.",
        timerTimeRemaining: "Temps restant",
        timerTimeTaken: "Temps écoulé ",
        pauseScreenPause: "Pause",
        pauseScreenResume: "Continuer",
        singleSelectionTagText: "Réponse unique",
        multipleSelectionTagText: "Réponse Multiple",
        pickNumberOfSelection: difficulty,
        marksOfQuestion: "(<marks> Points)",
      },
    };

  return (
    <>
      {!isQuizzLoading && !questions ? (
        <Container>
          <ButtonCreateQuizz
            onClick={() => {
              setIsQuizzLoading(true);
              socket.emit("generate-quizz", {
                topics: selectedTopics,
                difficulty,
                isMultiple,
                numberOfQuestions,
              });
              socket.emit("quiz-loading");
            }}
          >
            Créer le quiz
          </ButtonCreateQuizz>
        </Container>
      ) : (
        <FormContainer>
          {questions && <Quiz quiz={quiz} timer={180} />}
        </FormContainer>
      )}
    </>
  );
}

const ButtonCreateQuizz = styled(Button)`
  width: 150px;
  height: 50px;
  cursor: pointer;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
