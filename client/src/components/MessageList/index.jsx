import React from 'react';
import MessageItem from '../MessageItem';

function MessageList ({ messages, onEdit, onDelete }) {
  return (
    <ol>
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
