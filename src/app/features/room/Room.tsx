import { Flex } from '@hanekokoro-ui/styled-system/jsx';
import { useNavigate } from '@solidjs/router';
import type { Component } from 'solid-js';
import { Editor } from '../../components/editor/Editor';
import { createRoomInfo } from '../../hooks/createRoomInfo';
import { useRoom } from '../../hooks/useRoom';
import { RoomIntro } from './RoomIntro';
import { RoomTimeline } from './RoomTimeline';

export const Room: Component = () => {
  const room = useRoom();
  const navigate = useNavigate();
  const { name, topic, avatar, encrypted } = createRoomInfo(room);

  return (
    <Flex direction='column' h='dvh' minW='0' minH='0' grow='1'>
      <RoomIntro
        name={name() ?? room()?.roomId}
        topic={topic()}
        avatar={avatar()}
        encrypted={encrypted()}
        onBack={() => {
          navigate('/', { replace: true });
        }}
      />
      <RoomTimeline room={room()} />
      <Editor />
    </Flex>
  );
};
