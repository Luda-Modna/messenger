import { useEffect, useLayoutEffect } from 'react';
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
    <div className='chat-app'>
      <div className='chat-wrapper'>
        <header className='chat-header'>
          <h1>Chat Space</h1>
          <p>Your galactic chat</p>
        </header>

        {error && (
          <div className='chat-status chat-status--error'>ERROR!!!</div>
        )}
        {isFetching && <div className='chat-status'>Messages is loading. Please, wait...</div>}
        {!isFetching && !error && (
          <main className='chat-main'>
            <section className='chat-messages'>
              <MessageList
                messages={messages}
                onEdit={handleEditMessage}
                onDelete={handleDeleteMessage}
              />
            </section>
            <section className='chat-input'>
              <MessageForm onSubmit={addMessage} />
            </section>
          </main>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = ({ chat }) => chat;

const mapDispatchToProps = dispatch => ({
  get: limit => dispatch(getMessagesThunk(limit)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
