import { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { ConversationPanel } from '../../components/conversations/ConversationPanel';
import { ConversationSidebar } from '../../components/sidebars/ConversationSidebar';
import { AppDispatch } from '../../store';
import { addGroupMessage } from '../../store/groupMessageSlice';
import {
  addGroup,
  fetchGroupsThunk,
  updateGroup,
} from '../../store/groupSlice';
import { updateType } from '../../store/selectedSlice';
import { AuthContext } from '../../utils/context/AuthContext';
import { SocketContext } from '../../utils/context/SocketContext';
import {
  Group,
  AddGroupUserMessagePayload,
  GroupMessageEventPayload,
  RemoveGroupUserMessagePayload,
} from '../../utils/types';

export const GroupPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch<AppDispatch>();
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(updateType('group'));
    dispatch(fetchGroupsThunk());
  }, []);

  useEffect(() => {
    socket.on('onGroupMessage', (payload: GroupMessageEventPayload) => {
      console.log('Group Message Received');
      const { group, message } = payload;
      console.log(group, message);
      dispatch(addGroupMessage(payload));
    });

    socket.on('onGroupCreate', (payload: Group) => {
      console.log('Group Created...');
      dispatch(addGroup(payload));
    });

    /**
     * Adds the group for the user being added
     * to the group.
     */
    socket.on('onGroupUserAdd', (payload: AddGroupUserMessagePayload) => {
      console.log('onGroupUserAdd');
      console.log(payload);
      dispatch(addGroup(payload.group));
    });

    /**
     * Update all other clients in the room
     * so that they can also see the participant
     */
    socket.on(
      'onGroupReceivedNewUser',
      (payload: AddGroupUserMessagePayload) => {
        console.log('Received onGroupReceivedNewUser');
        dispatch(updateGroup(payload.group));
      }
    );

    socket.on(
      'onGroupRemovedUser',
      (payload: RemoveGroupUserMessagePayload) => {
        console.log('onGroupRemovedUser');
        console.log(payload);
        dispatch(updateGroup(payload.group));
        if (payload.user.id === user?.id) {
          console.log('user is logged in was removed from the group');
          console.log('navigating...');
          navigate('/groups');
        }
      }
    );

    return () => {
      socket.off('onGroupMessage');
      socket.off('onGroupCreate');
      socket.off('onGroupUserAdd');
      socket.off('onGroupReceivedNewUser');
      socket.off('onGroupRemovedUser');
    };
  }, [id]);

  return (
    <>
      <ConversationSidebar />
      {!id && <ConversationPanel />}
      <Outlet />
    </>
  );
};
