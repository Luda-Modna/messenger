const { Server } = require('socket.io');
const { Message } = require('./models');
const {
  SOCKET_EVENTS: {
    NEW_MESSAGE,
    NEW_MESSAGE_SUCCESS,
    NEW_MESSAGE_ERROR,
    EDIT_MESSAGE,
    EDIT_MESSAGE_ERROR,
    EDIT_MESSAGE_SUCCESS,
    DELETE_MESSAGE,
    DELETE_MESSAGE_SUCCESS,
    DELETE_MESSAGE_ERROR,
  },
} = require('./constants');

const initSocket = httpServer => {
  const io = new Server(httpServer, { cors: { origin: '*' } });

  io.on('connection', socket => {
    socket.on(NEW_MESSAGE, async payload => {
      try {
        const createdMessage = await Message.create(payload);
        io.emit(NEW_MESSAGE_SUCCESS, createdMessage);
      } catch (err) {
        socket.emit(NEW_MESSAGE_ERROR, {
          error: err.message ?? 'Error',
        });
      }
    });

    socket.on(EDIT_MESSAGE, async ({ messageId, body }) => {
      try {
        const updatedMessage = await Message.findByIdAndUpdate(
          messageId,
          { body },
          { new: true }
        );

        if (!updatedMessage) {
          return socket.emit(EDIT_MESSAGE_ERROR, {
            error: 'Message not found',
          });
        }

        io.emit(EDIT_MESSAGE_SUCCESS, updatedMessage);
      } catch (err) {
        socket.emit(EDIT_MESSAGE_ERROR, {
          error: err.message ?? 'Error',
        });
      }
    });
    socket.on(DELETE_MESSAGE, async ({ messageId }) => {
      try {
        const deletedMessage = await Message.findByIdAndDelete(messageId);

        if (!deletedMessage) {
          return socket.emit(DELETE_MESSAGE_ERROR, {
            error: 'Message not found',
          });
        }

        io.emit(DELETE_MESSAGE_SUCCESS, { messageId });
      } catch (err) {
        socket.emit(DELETE_MESSAGE_ERROR, {
          error: err.message ?? 'Error',
        });
      }
    });
  });
};

module.exports = initSocket;
