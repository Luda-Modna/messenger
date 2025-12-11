import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { http as API } from '../../api';

const MESSAGES_SLICE_NAME = 'messages';

export const getMessagesThunk = createAsyncThunk(
  `${MESSAGES_SLICE_NAME}/get`,
  async (payload, thunkAPI) => {
    try {
      const response = await API.getMessages(payload);
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue({ message: err.message });
    }
  }
);

// export const createMessageThunk = createAsyncThunk(
//   `${MESSAGES_SLICE_NAME}/create`,
//   async (payload, thunkAPI) => {
//     try {
//       const response = await API.createMessage(payload);
//       return response.data.data;
//     } catch (err) {
//       return thunkAPI.rejectWithValue({ message: err.message });
//     }
//   }
// );

const initialState = {
  messages: [],
  isFetching: false,
  error: null,
  limit: 10,
  room: 'general',
  roomNotification: null,
};

const messagesSlice = createSlice({
  name: MESSAGES_SLICE_NAME,
  initialState,
  reducers: {
    newMessageSuccess: (state, { payload }) => {
      state.error = null;
      if (state.messages.length >= state.limit) {
        state.messages.splice(0, 1);
      }
      state.messages.push(payload);
    },
    newMessageError: (state, { payload }) => {
      state.error = payload;
    },
    editMessageSuccess: (state, { payload }) => {
      state.messages = state.messages.map(m =>
        m._id === payload._id ? payload : m
      );
    },
    editMessageError: (state, { payload }) => {
      state.error = payload;
    },
    deleteMessageSuccess: (state, { payload }) => {
      state.messages = state.messages.filter(m => m._id !== payload.messageId);
    },
    deleteMessageError: (state, { payload }) => {
      state.error = payload;
    },
    joinRoomSuccess: (state, { payload }) => {
      state.room = payload.room;
      state.roomNotification = `Welcome to the universe "${payload.room}"`;
      state.error = null;
    },
    joinRoomError: (state, { payload }) => {
      state.roomNotification = null;
      state.error = payload?.error || 'НError';
    },
  },
  extraReducers: builder => {
    // GET
    builder.addCase(getMessagesThunk.pending, state => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(getMessagesThunk.fulfilled, (state, { payload }) => {
      state.messages = [];
      state.isFetching = false;
      state.messages.push(...payload.reverse());
    });
    builder.addCase(getMessagesThunk.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.error = payload;
    });
    // CREATE
    // builder.addCase(createMessageThunk.pending, state => {
    //   state.isFetching = true;
    //   state.error = null;
    // });
    // builder.addCase(createMessageThunk.fulfilled, (state, { payload }) => {
    //   state.isFetching = false;
    //   if (state.messages.length >= state.limit) {
    //     state.messages.splice(0, 1);
    //   }
    //   state.messages.push(payload);
    // });
    // builder.addCase(createMessageThunk.rejected, (state, { payload }) => {
    //   state.isFetching = false;
    //   state.error = payload;
    // });
  },
});

const { reducer, actions } = messagesSlice;

export const {
  newMessageSuccess,
  newMessageError,
  editMessageError,
  editMessageSuccess,
  deleteMessageError,
  deleteMessageSuccess,
  joinRoomSuccess,
  joinRoomError,
} = actions;

export default reducer;
