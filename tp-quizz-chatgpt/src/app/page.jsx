"use client";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

export default function App() {
  const [rooms, setRooms] = useState([]);
  const [isRoomLoading, setIsRoomLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.connect();
    socket.on("room-created", (room) => {
      setRooms(room);
      setIsRoomLoading(false);
      if (room.hostUserId === socket.id) {
        const url = `room/${room.hostUserId}`;
        router.push(url);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (isRoomLoading)
    return (
      <Container>Salon en cours de création, veillez patienter ...</Container>
    );
  let quiz;

  return (
    <Container>
      <ButtonCreateRoom
        onClick={() => {
          setIsRoomLoading(true);
          socket.emit("create-room", {
            hostUserId: socket.id,
          });
        }}
      >
        Créer un salon
      </ButtonCreateRoom>
    </Container>
  );
}

const Container = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 50px;
`;

const ButtonCreateRoom = styled(Button)`
  width: 150px;
  height: 50px;
  cursor: pointer;
`;
