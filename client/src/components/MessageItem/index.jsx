import React from 'react';
import { useState } from 'react';

function MessageItem ({ message, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftBody, setDraftBody] = useState(message.body || '');

  const handleStartEdit = () => {
    setDraftBody(message.body || '');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setDraftBody(message.body || '');
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    const trimmed = draftBody.trim();
    if (!trimmed) return;
    onEdit(message._id, trimmed);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(message._id);
  };
  return (
    <li>
      {!isEditing ? (
        <p>{message.body ?? JSON.stringify(message)}</p>
      ) : (
        <input
          type='text'
          value={draftBody}
          onChange={e => setDraftBody(e.target.value)}
        />
      )}
      <div>
        {isEditing ? (
          <>
            <button type='button' onClick={handleSaveEdit}>
              Save
            </button>
            <button type='button' onClick={handleCancelEdit}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button type='button' onClick={handleStartEdit}>
              Edit
            </button>
            <button type='button' onClick={handleDelete}>
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  );
}

export default MessageItem;
