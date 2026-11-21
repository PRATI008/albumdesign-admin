import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Components/DashboardLayout';
import './CSS/AdminTable.css';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { Table } from 'react-bootstrap';

const API_URL = 'http://localhost:4000/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);

 
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  const handleDelete = async (id) => {
    if (!window.confirm('do you want to permanently delete this user')) return;
    const res = await fetch(`${API_URL}/user/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      setUsers(users.filter((u) => u._id !== id));
    }
  };

 
  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/user/${editUser._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editUser)
    });
    const data = await res.json();
    if (data.success) {
      setUsers(users.map((u) => (u._id === editUser._id ? data.user : u)));
      setEditUser(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search)
  );

  return (
    <DashboardLayout title="Registered Users">
      <div className="admin-card">
        <div className="card-top">
          <h2>Registered Users ({filtered.length})</h2>
          <input
            type="text"
            className="search-input"
            placeholder="Search Name, Email or Mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p style={{ padding: '20px', textAlign: 'center' }}>Loading users...</p>
        ) : filtered.length === 0 ? (
          <p style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
            not user as register tell now
          </p>
        ) : (
          <div className="table-responsive">
            <Table className="admin-table" striped='bordered' border='0'>
              <thead>
                <tr>
                  <th>#</th>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, idx) => (
                  <tr key={u._id}>
                    <td>{idx + 1}</td>
                    <td><b>{u.name}</b></td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td>
                      <span className={`badge ${u.status === 'Blocked' ? 'badge-pending' : 'badge-active'}`}>
                        {u.status || 'Active'}
                      </span>
                    </td>
                    <td>
                      <div className="action-group">
                        <button className="btn-action btn-show" onClick={() => setViewUser(u)}>👁 Show</button>
                        <button className="btn-action btn-edit" onClick={() => setEditUser(u)}><FaEdit/> Edit</button>
                        <button className="btn-action btn-delete" onClick={() => handleDelete(u._id)}> <MdDelete/> Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      {/* SHOW MODAL */}
      {viewUser && (
        <div className="modal-backdrop" onClick={() => setViewUser(null)}>
          <div className="modal-box modal-detail" onClick={(e) => e.stopPropagation()}>
            <h3>Customer Details</h3>
            <p><b>Name:</b> {viewUser.name}</p>
            <p><b>Email:</b> {viewUser.email}</p>
            <p><b>Mobile:</b> {viewUser.phone}</p>
            <p><b>Status:</b> {viewUser.status || 'Active'}</p>
            <p><b>Joined On:</b> {new Date(viewUser.createdAt).toLocaleDateString()}</p>
            <div className="modal-actions">
              <button className="btn-action btn-delete" onClick={() => setViewUser(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editUser && (
        <div className="modal-backdrop" onClick={() => setEditUser(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Customer</h3>
            <form className="modal-form" onSubmit={handleUpdate}>
              <input value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} required />
              <input value={editUser.phone} onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })} required />
              <select value={editUser.status || 'Active'} onChange={(e) => setEditUser({ ...editUser, status: e.target.value })}>
                <option value="Active">Active</option>
                <option value="Blocked">Blocked</option>
              </select>
              <div className="modal-actions">
                <button type="button" className="btn-action btn-delete" onClick={() => setEditUser(null)}>Cancel</button>
                <button type="submit" className="btn-action btn-show">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Users;
