import React, { Dispatch, FC, SetStateAction } from 'react';
import { MessageInputContainer, MessageInput } from '../../utils/styles';
import { User } from '../../utils/types';
import styles from './index.module.scss';

type Props = {
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
  placeholderName: string;
  sendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  sendTypingStatus: () => void;
};

export const MessageInputField: FC<Props> = ({
  content,
  placeholderName,
  setContent,
  sendMessage,
  sendTypingStatus,
}) => {
  const updateContent = (e: React.ChangeEvent<HTMLInputElement>) =>
    setContent(e.target.value);
  return (
    <>
      <MessageInputContainer>
        <form onSubmit={sendMessage} className={styles.form}>
          <MessageInput
            value={content}
            onChange={updateContent}
            onKeyDown={sendTypingStatus}
            placeholder={`Send a message to ${placeholderName}`}
          />
        </form>
      </MessageInputContainer>
    </>
  );
};