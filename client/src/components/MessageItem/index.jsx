import React from 'react';
import { useState } from 'react';
import styles from './MessageItem.module.sass';

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
    <li
      className={
        isEditing
          ? `${styles.messageItem} ${styles.messageItemEditing}`
          : styles.messageItem
      }
    >
      <div className={styles.messageBubble}>
        {!isEditing ? (
          <p className={styles.messageBody}>
            {message.body ?? JSON.stringify(message)}
          </p>
        ) : (
          <input
            className={styles.editInput}
            type='text'
            value={draftBody}
            onChange={e => setDraftBody(e.target.value)}
          />
        )}
      </div>

      <div className={styles.messageActions}>
        {isEditing ? (
          <>
            <button
              className={styles.btnSave}
              type='button'
              onClick={handleSaveEdit}
            >
              Save
            </button>
            <button
              className={styles.btnCancel}
              type='button'
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className={styles.btnEdit}
              type='button'
              onClick={handleStartEdit}
            >
              Edit
            </button>
            <button
              className={styles.btnDelete}
              type='button'
              onClick={handleDelete}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  );
}

export default MessageItem;
