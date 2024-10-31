import { Component } from 'solid-js';
import { useRoom } from '../../hooks/useRoom';
import { Flex } from '~styled/jsx';
import { RoomIntro } from './RoomIntro';
import { createRoomInfo } from '../../hooks/createRoomInfo';
import { useNavigate } from '@solidjs/router';
import { RoomTimeline } from './RoomTimeline';
import { Editor } from '../../components/editor/Editor';

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
      <RoomTimeline room={room()!} />
      <Editor />
    </Flex>
  );
};
