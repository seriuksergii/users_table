import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../store/store';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
}

interface UsersState {
  users: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filter: string;
}

const initialState: UsersState = {
  users: [],
  status: 'idle',
  error: null,
  filter: '',
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get(
    'https://jsonplaceholder.typicode.com/users'
  );
  return response.data as User[];
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setFilter(state, action) {
      state.filter = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const { setFilter } = usersSlice.actions;

export const selectFilteredUsers = (state: RootState) => {
  const { users, filter } = state.users;
  const lowercasedFilter = filter.toLowerCase();

  return users.filter((user) =>
    ['name', 'username', 'email', 'phone'].some((key) =>
      user[key as keyof User]
        ?.toString()
        .toLowerCase()
        .includes(lowercasedFilter)
    )
  );
};

export default usersSlice.reducer;
