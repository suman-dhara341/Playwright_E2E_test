// Redux Slice
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  commentCount: 0,
};

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    incrementCommentCount: (state) => {
      state.commentCount += 1;
    },
    setCommentCount: (state, action) => {
      state.commentCount = action.payload;
    },
  },
});

export const { incrementCommentCount, setCommentCount } = commentSlice.actions;
export default commentSlice.reducer;
