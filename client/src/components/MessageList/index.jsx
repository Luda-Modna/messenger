import React from 'react';
import MessageItem from '../MessageItem';
import styles from './MessageList.module.sass';

function MessageList ({ messages, onEdit, onDelete }) {
  return (
    <ol className={styles.messagelist}>
      {messages.map(m => (
        <MessageItem
          key={m._id}
          message={m}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ol>
  );
}

export default MessageList;
