import { io } from 'socket.io-client';
import {
  deleteMessageError,
  deleteMessageSuccess,
  editMessageError,
  editMessageSuccess,
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
  },
} = CONSTANTS;

const socket = io('ws://localhost:3001');

export const createMessage = payload => socket.emit(NEW_MESSAGE, payload);

export const editMessage = payload => socket.emit(EDIT_MESSAGE, payload);

export const deleteMessage = payload => socket.emit(DELETE_MESSAGE, payload);

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
    store.dispatch(deleteMessageSuccess(payload));
  });
  socket.on(DELETE_MESSAGE_ERROR, error => {
    store.dispatch(deleteMessageError(error));
  });
};
