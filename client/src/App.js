import { useEffect, useLayoutEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { connect } from 'react-redux';
import { getMessagesThunk } from './store/slices/messagesSlice';
import './App.css';
import { ws } from './api';
import MessageList from './components/MessageList';
import MessageForm from './components/MessageForm';

function App ({ messages, isFetching, error, limit, get }) {
  useEffect(() => {
    get(limit);
  }, [limit]);

  useLayoutEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages.length]);

  const addMessage = (values, formikBag) => {
    ws.createMessage(values);
    formikBag.resetForm();
  };

  const handleEditMessage = (id, body) => {
    ws.editMessage({ messageId: id, body });
  };

  const handleDeleteMessage = id => {
    ws.deleteMessage(id);
  };

  return (
    <>
      {error && <div style={{ color: 'red' }}>ERROR!!!</div>}
      {isFetching && <div>Messages is loading. Please, wait...</div>}
      {!isFetching && !error && (
        <MessageList
          messages={messages}
          onEdit={handleEditMessage}
          onDelete={handleDeleteMessage}
        />
      )}
      <MessageForm onSubmit={addMessage} />
    </>
  );
}

const mapStateToProps = ({ chat }) => chat;

const mapDispatchToProps = dispatch => ({
  get: limit => dispatch(getMessagesThunk(limit)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
