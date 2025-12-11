import { useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import { getMessagesThunk } from './store/slices/messagesSlice';
import './App.css';
import { ws } from './api';
import MessageList from './components/MessageList';
import MessageForm from './components/MessageForm';
import PlanetBackground from './components/PlanetBackground';

const OTHER_UNIVERSE = 'other_universe';

function App ({
  messages,
  isFetching,
  error,
  limit,
  get,
  room,
  roomNotification,
}) {
  useEffect(() => {
    get(limit);
  }, [limit, get]);

  useLayoutEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages.length, room]);

  const addMessage = (values, formikBag) => {
    ws.createMessage({ ...values, room });
    formikBag.resetForm();
  };

  const handleEditMessage = (id, body) => {
    ws.editMessage({ messageId: id, body, room });
  };

  const handleDeleteMessage = id => {
    ws.deleteMessage(id);
  };

  const handleToggleUniverse = () => {
    const targetRoom = room === 'general' ? OTHER_UNIVERSE : 'general';
    ws.joinRoom(targetRoom);
  };

  const visibleMessages = messages.filter(m => m.room === room);

  return (
    <div className='chat-app'>
      <div className='chat-wrapper'>
        <header className='chat-header'>
          <div className='chat-header-main'>
            <h1>Chat Space</h1>
            <p>Your galactic chat</p>
          </div>

          <button
            type='button'
            className='universe-btn'
            onClick={handleToggleUniverse}
          >
            {room === 'general' ? 'Join another universe' : 'Go back'}
          </button>
        </header>

        {roomNotification && (
          <div className='chat-status chat-status--success'>
            {roomNotification}
          </div>
        )}

        {error && (
          <div className='chat-status chat-status--error'>ERROR!!!</div>
        )}
        {isFetching && (
          <div className='chat-status'>
            Messages is loading. Please, wait...
          </div>
        )}
        {!isFetching && !error && (
          <main className='chat-main'>
            <section className='chat-messages'>
              <PlanetBackground />
              <div className='chat-messages-content'>
                <MessageList
                  messages={visibleMessages}
                  onEdit={handleEditMessage}
                  onDelete={handleDeleteMessage}
                />
              </div>
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
