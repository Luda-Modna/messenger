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
    JOIN_ROOM,
    JOIN_ROOM_ERROR,
    JOIN_ROOM_SUCCESS,
  },
} = require('./constants');

const initSocket = httpServer => {
  const io = new Server(httpServer, { cors: { origin: '*' } });

  io.on('connection', socket => {
    let currentRoom = 'general';
    socket.join(currentRoom);

    socket.on(JOIN_ROOM, ({ room }) => {
      try {
        if (!room) {
          throw new Error('Room is required');
        }

        for (const r of socket.rooms) {
          if (r !== socket.id) {
            socket.leave(r);
          }
        }

        currentRoom = room;
        socket.join(room);

        socket.emit(JOIN_ROOM_SUCCESS, { room });
      } catch (err) {
        socket.emit(JOIN_ROOM_ERROR, {
          error: err.message ?? 'Error while joining room',
        });
      }
    });

    socket.on(NEW_MESSAGE, async payload => {
      try {
        const room = payload.room || currentRoom;

        const createdMessage = await Message.create({ ...payload, room });
        io.to(room).emit(NEW_MESSAGE_SUCCESS, createdMessage);
      } catch (err) {
        socket.emit(NEW_MESSAGE_ERROR, {
          error: err.message ?? 'Error',
        });
      }
    });

    socket.on(EDIT_MESSAGE, async ({ messageId, body, room }) => {
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
        const targetRoom = room || updatedMessage.room;

        io.to(targetRoom).emit(EDIT_MESSAGE_SUCCESS, updatedMessage);
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
        const targetRoom = deletedMessage.room;

        io.to(targetRoom).emit(DELETE_MESSAGE_SUCCESS, { messageId });
      } catch (err) {
        socket.emit(DELETE_MESSAGE_ERROR, {
          error: err.message ?? 'Error',
        });
      }
    });
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

module.exports = initSocket;
