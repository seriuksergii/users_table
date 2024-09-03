import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchUsers,
  selectFilteredUsers,
  setFilter,
} from '../../features/users/usersSlice';
import { RootState, AppDispatch } from '../../store/store';

export const UsersTable = () => {
  const dispatch: AppDispatch = useDispatch();
  const users = useSelector(selectFilteredUsers);
  const status = useSelector((state: RootState) => state.users.status);
  const filter = useSelector((state: RootState) => state.users.filter);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const currentUsers = users.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilter(e.target.value));
  };

  return (
    <>
      <h1 className="title">Users Table</h1>
      <div className="block">
        <div className="input-group">
          <input
            id="filter"
            type="text"
            placeholder="Search"
            className="filter-input"
            value={filter}
            onChange={handleFilterChange}
          />
        </div>

        <table className="table is-striped is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th>№</th>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{(currentPage - 1) * usersPerPage + index + 1}</td>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <nav>
          <ul className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index}
                className={`page-item ${
                  currentPage === index + 1 ? 'active' : ''
                }`}
              >
                <button
                  onClick={() => setCurrentPage(index + 1)}
                  className="page-link"
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};
