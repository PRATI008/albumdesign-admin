
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import DashboardLayout from '../Components/DashboardLayout';
import './CSS/ManageDesign.css';

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaPaintBrush,
  FaSave
} from 'react-icons/fa';

const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
).replace(/\/$/, '');

const initialForm = {
  designStyle: 'Royal Traditional',
  status: 'Active'
};

const ManageDesign = () => {

  // All States
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({ ...initialForm });

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // 1. Fetch All Designs
  const fetchDesigns = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/designs`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch designs');
      }

      const list = Array.isArray(data)
        ? data
        : data.designs || data.data || [];

      setDesigns(list);

    } catch (err) {
      console.error('Fetch Error:', err);
      toast.error(err.message || 'Unable to load designs');
    } finally {
      setLoading(false);
    }
  };

  // Load Designs
  useEffect(() => {
    fetchDesigns();
  }, []);

  // 2. Modal Body Scroll
  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  // 3. Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // 4. Open Add Modal
  const openAddModal = () => {
    setEditId(null);
    setFormData({ ...initialForm });
    setShowModal(true);
  };

  // 5. Open Edit Modal
  const openEditModal = (item) => {
    setEditId(item._id);

    setFormData({
      designStyle: item.designStyle || item.style || '',
      status: item.status || 'Active'
    });

    setShowModal(true);
  };

  // 6. Close Modal
  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditId(null);
    setFormData({ ...initialForm });
  };

  // 7. Add / Update Design
  const handleSubmit = async (e) => {
    e.preventDefault();

    const designStyle = formData.designStyle.trim();

    if (!designStyle) {
      toast.warning('Design Style is required!');
      return;
    }

    try {
      setSaving(true);

      const url = editId
        ? `${API_URL}/design/${editId}`
        : `${API_URL}/design`;

      const res = await fetch(url, {
        method: editId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          designStyle,
          status: formData.status
        })
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || 'Unable to save design');
      }

      toast.success(
        data.message ||
        (editId
          ? 'Design updated successfully!'
          : 'Design added successfully!')
      );

      setShowModal(false);
      setEditId(null);
      setFormData({ ...initialForm });

      await fetchDesigns();

    } catch (err) {
      console.error('Save Error:', err);
      toast.error(err.message || 'Failed to save design');
    } finally {
      setSaving(false);
    }
  };

  // 8. Delete Design
  const handleDelete = (id) => {

    toast(
      ({ closeToast }) => (
        <div className="md-toast-confirm">

          <p>Are you sure you want to delete this design?</p>

          <div className="md-toast-btns">

            <button
              type="button"
              className="md-toast-btn md-toast-yes"
              onClick={async () => {

                closeToast();

                try {
                  setDeletingId(id);

                  const res = await fetch(
                    `${API_URL}/design/${id}`,
                    {
                      method: 'DELETE'
                    }
                  );

                  const data = await res.json();

                  if (!res.ok || data.success === false) {
                    throw new Error(data.message || 'Delete failed');
                  }

                  toast.success(
                    data.message || 'Design deleted successfully!'
                  );

                  await fetchDesigns();

                } catch (err) {
                  console.error('Delete Error:', err);
                  toast.error(err.message || 'Delete failed');
                } finally {
                  setDeletingId(null);
                }
              }}
            >
              Yes, Delete
            </button>

            <button
              type="button"
              className="md-toast-btn md-toast-no"
              onClick={closeToast}
            >
              Cancel
            </button>

          </div>
        </div>
      ),
      {
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
        position: 'top-center',
        className: 'md-toast-wrapper'
      }
    );
  };

  // 9. Active / Inactive Toggle
  const handleToggleStatus = async (item) => {

    const newStatus = item.status === 'Active'
      ? 'Inactive'
      : 'Active';

    try {
      const res = await fetch(
        `${API_URL}/design/${item._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: newStatus
          })
        }
      );

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || 'Status update failed');
      }

      toast.success(`Design status set to ${newStatus}`);

      await fetchDesigns();

    } catch (err) {
      console.error('Status Error:', err);
      toast.error(err.message || 'Status update failed');
    }
  };

  // 10. Search
  const filteredDesigns = designs.filter((item) => {

    const designName = item.designStyle || item.style || '';

    return (
      designName.toLowerCase().includes(search.toLowerCase()) ||
      String(item.status || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  // 11. Counts
  const activeCount = designs.filter(
    item => item.status === 'Active'
  ).length;

  const inactiveCount = designs.filter(
    item => item.status === 'Inactive'
  ).length;

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
        newestOnTop
      />

      <DashboardLayout>

        <div className="md-page">

          {/* Page Header */}
          <div className="md-header">

            <div>
              <h2 className="md-title">Manage Design</h2>

              <p className="md-subtitle">
                Manage album design styles and their availability
              </p>
            </div>

            <button
              type="button"
              className="md-btn-primary"
              onClick={openAddModal}
            >
              <FaPlus /> Add Design
            </button>

          </div>

          {/* Statistics */}
          <div className="md-stats-grid">

            <div className="md-stat-card">

              <div className="md-stat-icon md-icon-blue">
                <FaPaintBrush />
              </div>

              <div>
                <span>Total Designs</span>
                <h3>{designs.length}</h3>
              </div>

            </div>

            <div className="md-stat-card">

              <div className="md-stat-icon md-icon-green">
                <FaCheckCircle />
              </div>

              <div>
                <span>Active Designs</span>
                <h3>{activeCount}</h3>
              </div>

            </div>

            <div className="md-stat-card">

              <div className="md-stat-icon md-icon-gold">
                <FaTimesCircle />
              </div>

              <div>
                <span>Inactive Designs</span>
                <h3>{inactiveCount}</h3>
              </div>

            </div>

          </div>

          {/* Search */}
          <div className="md-controls-card">

            <div className="md-controls-right">

              <div className="md-search-box">

                <FaSearch className="md-search-icon" />

                <input
                  type="text"
                  placeholder="Search design style..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

              </div>

            </div>

          </div>

          {/* Design Table */}
          <div className="md-table-card">

            <div className="md-table-wrapper">

              <table className="md-table">

                <thead>
                  <tr>
                    <th style={{ width: '100px' }}>SR. NO.</th>
                    <th>DESIGN STYLE</th>
                    <th style={{ width: '180px' }}>STATUS</th>
                    <th style={{ width: '180px' }}>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>

                  {loading ? (

                    <tr>
                      <td colSpan="4" className="md-empty">
                        <span className="md-spinner" />
                        Loading designs...
                      </td>
                    </tr>

                  ) : filteredDesigns.length === 0 ? (

                    <tr>
                      <td colSpan="4" className="md-empty">
                        No designs found
                      </td>
                    </tr>

                  ) : (

                    filteredDesigns.map((item, index) => (

                      <tr key={item._id || index}>

                        <td>{index + 1}</td>

                        <td>
                          <strong className="md-tbl-name">
                            {item.designStyle || item.style || '-'}
                          </strong>
                        </td>

                        <td>
                          <span
                            className={`md-badge-pill ${
                              item.status === 'Active'
                                ? 'active'
                                : 'inactive'
                            }`}
                          >
                            {item.status || 'Active'}
                          </span>
                        </td>

                        <td>

                          <div className="md-table-actions">

                            {/* Edit */}
                            <button
                              type="button"
                              className="md-icon-btn edit"
                              title="Edit Design"
                              onClick={() => openEditModal(item)}
                            >
                              <FaEdit />
                            </button>

                            {/* Toggle Status */}
                            <button
                              type="button"
                              className={`md-icon-btn ${
                                item.status === 'Active'
                                  ? 'delete'
                                  : 'view'
                              }`}
                              title={
                                item.status === 'Active'
                                  ? 'Deactivate'
                                  : 'Activate'
                              }
                              onClick={() => handleToggleStatus(item)}
                            >
                              {item.status === 'Active'
                                ? <FaTimesCircle />
                                : <FaCheckCircle />}
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              className="md-icon-btn delete"
                              title="Delete Design"
                              disabled={deletingId === item._id}
                              onClick={() => handleDelete(item._id)}
                            >
                              <FaTrash />
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </DashboardLayout>

      {/* Add / Edit Modal */}
      {showModal && createPortal(

        <div
          className="md-overlay"
          onClick={closeModal}
        >

          <div
            className="md-modal-container"
            onClick={(e) => e.stopPropagation()}
          >

            <form
              className="md-modal-form"
              onSubmit={handleSubmit}
            >

              {/* Modal Header */}
              <div className="md-modal-header">

                <div>
                  <h3 className="md-modal-title">
                    {editId ? 'Edit Design' : 'Add New Design'}
                  </h3>

                  <p className="md-modal-subtitle">
                    Enter design style and availability
                  </p>
                </div>

                {!saving && (
                  <button
                    type="button"
                    className="md-close-btn"
                    onClick={closeModal}
                  >
                    ✕
                  </button>
                )}

              </div>

              {/* Modal Body */}
              <div className="md-modal-body">

                <div className="md-form-grid">

                  {/* Design Style */}
                  <div className="md-form-group md-span-2">

                    <label className="md-label">
                      Design Style *
                    </label>

                    <select
                      className="md-input"
                      name="designStyle"
                      value={formData.designStyle}
                      onChange={handleChange}
                      required
                    >

                      <option value="">
                        Select Design Style
                      </option>

                      <option value="Royal Traditional">
                        Royal Traditional
                      </option>

                      <option value="Modern Minimalist">
                        Modern Minimalist
                      </option>

                      <option value="Cinematic Story">
                        Cinematic Story
                      </option>

                      <option value="Vintage Classic">
                        Vintage Classic
                      </option>

                      <option value="Luxury Magazine">
                        Luxury Magazine
                      </option>

                    </select>

                  </div>

                  {/* Status */}
                  <div className="md-form-group md-span-2">

                    <label className="md-label">
                      Status
                    </label>

                    <select
                      className="md-input"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >

                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>

                    </select>

                  </div>

                </div>

              </div>

              {/* Modal Footer */}
              <div className="md-modal-footer">

                <button
                  type="button"
                  className="md-btn-modal md-btn-secondary"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="md-btn-modal md-btn-primary-action"
                  disabled={saving}
                >

                  {saving ? (

                    <>
                      <span className="md-spinner-sm" />
                      Saving...
                    </>

                  ) : editId ? (

                    <>
                      <FaSave />
                      Update Design
                    </>

                  ) : (

                    <>
                      <FaPlus />
                      Save Design
                    </>

                  )}

                </button>

              </div>

            </form>

          </div>

        </div>,

        document.body

      )}

    </>
  );
};

export default ManageDesign;
