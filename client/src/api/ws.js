import { io } from 'socket.io-client';
import {
  deleteMessageError,
  deleteMessageSuccess,
  editMessageError,
  editMessageSuccess,
  getMessagesThunk,
  joinRoomError,
  joinRoomSuccess,
  newMessageError,
  newMessageSuccess,
} from '../store/slices/messagesSlice';
import CONSTANTS from './../constants';

const {
  SOCKET_EVENTS: {
    NEW_MESSAGE,
    NEW_MESSAGE_SUCCESS,
    NEW_MESSAGE_ERROR,
    EDIT_MESSAGE,
    EDIT_MESSAGE_SUCCESS,
    EDIT_MESSAGE_ERROR,
    DELETE_MESSAGE,
    DELETE_MESSAGE_ERROR,
    DELETE_MESSAGE_SUCCESS,
    JOIN_ROOM,
    JOIN_ROOM_SUCCESS,
    JOIN_ROOM_ERROR,
  },
} = CONSTANTS;

const socket = io('ws://localhost:3001');

export const createMessage = payload => socket.emit(NEW_MESSAGE, payload);

export const editMessage = payload => socket.emit(EDIT_MESSAGE, payload);

export const deleteMessage = id =>
  socket.emit(DELETE_MESSAGE, { messageId: id });

export const joinRoom = roomName => socket.emit(JOIN_ROOM, { room: roomName });

export const bringStoreToSocket = store => {
  socket.on(NEW_MESSAGE_SUCCESS, payload => {
    store.dispatch(newMessageSuccess(payload));
  });

  socket.on(NEW_MESSAGE_ERROR, error => {
    store.dispatch(newMessageError(error));
  });

  socket.on(EDIT_MESSAGE_SUCCESS, payload => {
    store.dispatch(editMessageSuccess(payload));
  });
  socket.on(EDIT_MESSAGE_ERROR, error => {
    store.dispatch(editMessageError(error));
  });

  socket.on(DELETE_MESSAGE_SUCCESS, payload => {
    console.log('DELETE_MESSAGE_SUCCESS payload:', payload);
    store.dispatch(deleteMessageSuccess(payload));
  });
  socket.on(DELETE_MESSAGE_ERROR, error => {
    console.log('DELETE_MESSAGE_ERROR', error);
    store.dispatch(deleteMessageError(error));
  });

  socket.on(JOIN_ROOM_SUCCESS, payload => {
    store.dispatch(joinRoomSuccess(payload));
    const state = store.getState();
    const limit = state.chat.limit || 10;

    store.dispatch(getMessagesThunk({ limit, room: payload.room }));
  });

  socket.on(JOIN_ROOM_ERROR, error => {
    store.dispatch(joinRoomError(error));
  });
};
