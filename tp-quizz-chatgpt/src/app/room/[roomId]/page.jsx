"use client";
import styled from "@emotion/styled";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Quiz from "react-quiz-component";
import { io } from "socket.io-client";
import { CustomSelect } from "../../../../components/SelectMultiple";

const socket = io("http://localhost:4000");

const options = [
  { value: "musique", label: "Musique" },
  { value: "sport", label: "Sport" },
  { value: "cuisine", label: "Cuisine" },
];

export default function Test() {
  const params = useParams();

  const [questions, setQuestions] = useState();
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(false);

  const [numberOfQuestions, setNumberOfQuestions] = useState(2);
  const [difficulty, setDifficulty] = useState({
    value: "facile",
    label: "Facile",
  });
  const [isMultiple, setIsMultiple] = useState({ value: false, label: "Non" });
  const [selectedTopics, setSelectedTopics] = useState(options);
  const [startTime, setStartTime] = useState();

  useEffect(() => {
    socket.connect();

    socket.on("quiz-loading", () => setIsQuestionsLoading(true));
    socket.on("quiz-generated", (data) => {
      console.log(questions);
      setQuestions(data);
      setIsQuestionsLoading(false);
      setNumberOfQuestions(data.length);
      setStartTime(Date.now());
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (isQuestionsLoading && !questions)
    return <Container>Quiz en cours de création, veillez patienter.</Container>;

  let quiz;
  if (questions)
    quiz = {
      quizTitle: "Quiz",
      quizSynopsis: "Répond aux questions correctement avant tes adversaires.",
      nrOfQuestions: numberOfQuestions,
      questions: questions.map((q) => ({
        question: q.question,
        questionType: "text",
        answerSelectionType: "single",
        answers: q.reponses,
        correctAnswer:
          q.reponses.findIndex((rep) => rep === q.bonne_reponse) + 1 + "",
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
        pickNumberOfSelection: difficulty.label,
        marksOfQuestion: "(<marks> Points)",
      },
    };

  return (
    <>
      {!isQuestionsLoading && !questions ? (
        <Container>
          <Filter>
            <InputWrapper>
              <StyledLabel>Thèmes :</StyledLabel>
              <StyledSelectMultiple
                className="select"
                options={options}
                value={selectedTopics}
                onChange={(value) => setSelectedTopics(value)}
                isSearchable
                isSelectAll
              />
            </InputWrapper>
            <InputWrapper>
              <StyledLabel>Nombre de questions :</StyledLabel>
              <Form.Control
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(e.target.value)}
              />
            </InputWrapper>
            <InputWrapper>
              <StyledLabel>Niveau de difficulté :</StyledLabel>
              <StyledSelectMultiple
                className="select"
                options={[
                  { value: "facile", label: "Facile" },
                  { value: "difficile", label: "Difficile" },
                ]}
                value={difficulty}
                onChange={(value) => setDifficulty(value)}
              />
            </InputWrapper>
            <InputWrapper>
              <StyledLabel>Mélanger aléatoirement les thèmes :</StyledLabel>
              <StyledSelectMultiple
                className="select"
                options={[
                  { value: true, label: "Oui" },
                  { value: false, label: "Non" },
                ]}
                value={isMultiple}
                onChange={(value) => setIsMultiple(value)}
              />
            </InputWrapper>
          </Filter>

          <ButtonCreateRoom
            onClick={() => {
              setIsQuestionsLoading(true);
              socket.emit("generate-quizz", {
                topics: selectedTopics.map((v) => v.value),
                difficulty: difficulty.value,
                isMultiple: isMultiple.value,
                numberOfQuestions: numberOfQuestions,
              });

              socket.emit("quiz-loading");
            }}
          >
            Créer un quiz
          </ButtonCreateRoom>
        </Container>
      ) : (
        <FormContainer>
          {questions && (
            <Quiz
              quiz={quiz}
              timer={numberOfQuestions * 60}
              onComplete={(e) => {
                console.log(e.totalPoints / Math.trunc(Date.now() - startTime));
              }}
            />
          )}
        </FormContainer>
      )}
    </>
  );
}

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Container = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 50px;
`;

const Filter = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  justify-content: flex-start;
`;

const StyledSelectMultiple = styled(CustomSelect)`
  width: 250px;
  max-width: 20rem;
`;

const ButtonCreateRoom = styled(Button)`
  width: 150px;
  height: 50px;
  cursor: pointer;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const StyledLabel = styled.label`
  width: 100px;
  text-align: right;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 25px;
  text-transform: uppercase;
  margin-right: 30px;
`;
