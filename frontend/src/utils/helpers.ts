import { Crown, Minus, PersonCross } from 'akar-icons';
import { userContextMenuItems } from './constants';
import { Conversation, Group, User, UserContextMenuActionType } from './types';

export const getRecipientFromConversation = (
  conversation?: Conversation,
  user?: User
) => {
  return user?.id === conversation?.creator.id
    ? conversation?.recipient
    : conversation?.creator;
};

export const getUserContextMenuIcon = (type: UserContextMenuActionType) => {
  switch (type) {
    case 'kick':
      return { icon: PersonCross, color: '#ff0000' };
    case 'transfer_owner':
      return { icon: Crown, color: '#FFB800' };
    default:
      return { icon: Minus, color: '#7c7c7c' };
  }
};

export const isGroupOwner = (user?: User, group?: Group) =>
  user?.id === group?.creator.id;
