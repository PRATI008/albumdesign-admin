import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import DashboardLayout from '../Components/DashboardLayout';
import './CSS/ManagePackages.css';

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaBoxOpen,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaSave
} from 'react-icons/fa';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/$/, '');

const initialForm = {
  packageName: '',
  status: 'Active',
};

const ManagePackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ ...initialForm });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  /* ─── Fetch Packages ─── */
  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/packages`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Unable to fetch packages');
      setPackages(data.packages || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  /* Lock body scroll when modal opens */
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  /* ─── Form Input Change ─── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ─── Open / Close Modals ─── */
  const openAddModal = (e) => {
    if (e) e.preventDefault();
    setEditId(null);
    setFormData({ ...initialForm });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditId(item._id);
    setFormData({
      packageName: item.packageName || '',
      status: item.status || 'Active',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;
    setShowModal(false);
    setEditId(null);
    setFormData({ ...initialForm });
  };

  /* ─── Submit Form (Add / Edit) ─── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.packageName.trim()) {
      toast.warning('Package Name is required!');
      return;
    }

    try {
      setSaving(true);
      const url = editId ? `${API_URL}/package/${editId}` : `${API_URL}/package`;
      const res = await fetch(url, {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageName: formData.packageName.trim(),
          status: formData.status,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Unable to save package');

      toast.success(data.message || (editId ? 'Package updated successfully! ✅' : 'Package added successfully! 🎉'));
      closeModal();
      await fetchPackages();
    } catch (err) {
      console.error('Submit Error:', err);
      toast.error(err.message || 'Failed to save package');
    } finally {
      setSaving(false);
    }
  };

  /* ─── Delete Package ─── */
  const handleDelete = (id) => {
    toast(
      ({ closeToast }) => (
        <div className="mp-toast-confirm">
          <p>Are you sure you want to delete this package?</p>
          <div className="mp-toast-btns">
            <button
              type="button"
              className="mp-toast-btn mp-toast-yes"
              onClick={async () => {
                closeToast();
                try {
                  setDeletingId(id);
                  const res = await fetch(`${API_URL}/package/${id}`, { method: 'DELETE' });
                  const data = await res.json();
                  if (!res.ok || !data.success) throw new Error(data.message || 'Unable to delete');
                  toast.success(data.message || 'Package deleted! 🗑️');
                  await fetchPackages();
                } catch (err) {
                  toast.error(err.message || 'Delete failed');
                } finally {
                  setDeletingId(null);
                }
              }}
            >
              Yes, Delete
            </button>
            <button type="button" className="mp-toast-btn mp-toast-no" onClick={closeToast}>
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
        className: 'mp-toast-wrapper',
      }
    );
  };

  /* ─── Toggle Status ─── */
  const handleStatus = async (item) => {
    const newStatus = item.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await fetch(`${API_URL}/package/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Unable to update status');
      toast.success(`Package status set to ${newStatus}`);
      await fetchPackages();
    } catch (err) {
      toast.error(err.message || 'Status update failed');
    }
  };

  /* Filter */
  const filtered = packages.filter((item) =>
    [item.packageName, item.status].some((v) =>
      String(v || '').toLowerCase().includes(search.toLowerCase())
    )
  );

  const activeCount = packages.filter((p) => p.status === 'Active').length;
  const inactiveCount = packages.filter((p) => p.status === 'Inactive').length;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" newestOnTop />

      <DashboardLayout title="Manage Packages">
        <div className="mp-page">

          {/* Heading */}
          <div className="mp-heading">
            <div>
              <h2>Manage Packages</h2>
              <p>Manage photography package names and availability status</p>
            </div>
            <button type="button" className="mp-add-btn" onClick={openAddModal}>
              <FaPlus /> + Add Package
            </button>
          </div>

          {/* Stats */}
          <div className="mp-stats">
            <div className="mp-stat-card">
              <div className="mp-stat-icon mp-icon-total"><FaBoxOpen /></div>
              <div>
                <span>Total Packages</span>
                <h3>{packages.length}</h3>
              </div>
            </div>
            <div className="mp-stat-card">
              <div className="mp-stat-icon mp-icon-active"><FaCheckCircle /></div>
              <div>
                <span>Active Packages</span>
                <h3>{activeCount}</h3>
              </div>
            </div>
            <div className="mp-stat-card">
              <div className="mp-stat-icon mp-icon-inactive"><FaTimesCircle /></div>
              <div>
                <span>Inactive Packages</span>
                <h3>{inactiveCount}</h3>
              </div>
            </div>
          </div>

          {/* Table Card (Only Name, Status, Actions) */}
          <div className="mp-table-card">
            <div className="mp-table-header">
              <div>
                <h5>All Packages ({filtered.length})</h5>
              </div>
              <div className="mp-search-box">
                <FaSearch className="mp-search-icon" />
                <input
                  className="mp-search"
                  type="text"
                  placeholder="Search package name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="mp-table-wrapper">
              <table className="mp-table">
                <thead>
                  <tr>
                    <th style={{ width: '90px' }}>Sr. No.</th>
                    <th>PACKAGE NAME</th>
                    <th style={{ width: '180px' }}>STATUS</th>
                    <th style={{ width: '160px' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="mp-empty">
                        <span className="mp-spinner" /> Loading packages...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="mp-empty">No packages found</td>
                    </tr>
                  ) : (
                    filtered.map((item, idx) => (
                      <tr key={item._id || idx}>
                        <td>{idx + 1}</td>
                        <td>
                          <strong className="mp-pkg-name">{item.packageName}</strong>
                        </td>
                        <td>
                          <span
                            className={`mp-badge ${
                              item.status === 'Active' ? 'mp-badge-active' : 'mp-badge-inactive'
                            }`}
                          >
                            {item.status || 'Active'}
                          </span>
                        </td>
                        <td>
                          <div className="mp-actions">
                            <button
                              type="button"
                              className="mp-action-btn mp-edit-btn"
                              title="Edit Package"
                              onClick={() => openEditModal(item)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              type="button"
                              className={`mp-action-btn ${
                                item.status === 'Active' ? 'mp-deactivate-btn' : 'mp-activate-btn'
                              }`}
                              title={item.status === 'Active' ? 'Deactivate' : 'Activate'}
                              onClick={() => handleStatus(item)}
                            >
                              {item.status === 'Active' ? <FaTimesCircle /> : <FaCheckCircle />}
                            </button>
                            <button
                              type="button"
                              className="mp-action-btn mp-delete-btn"
                              title="Delete Package"
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

      {/* ─── MODAL VIA PORTAL (Only Name & Status) ─── */}
      {showModal &&
        createPortal(
          <div className="mp-overlay" onClick={closeModal}>
            <div
              className="mp-modal-container"
              style={{ maxWidth: '500px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <form className="mp-modal-form" onSubmit={handleSubmit}>
                <div className="mp-modal-header">
                  <h3 className="mp-modal-title">
                    {editId ? 'Edit Package' : 'Add New Package'}
                  </h3>
                  {!saving && (
                    <button
                      type="button"
                      className="mp-close-btn"
                      onClick={closeModal}
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="mp-modal-body">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    
                    <div className="mp-form-group">
                      <label className="mp-label">Package Name *</label>
                      <input
                        className="mp-input"
                        type="text"
                        name="packageName"
                        value={formData.packageName}
                        onChange={handleChange}
                        placeholder="Enter package name (e.g. Royal Wedding)"
                        required
                        autoFocus
                      />
                    </div>

                    <div className="mp-form-group">
                      <label className="mp-label">Status</label>
                      <select
                        className="mp-input"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="Active">Active (Available)</option>
                        <option value="Inactive">Inactive (Disabled)</option>
                      </select>
                    </div>

                  </div>
                </div>

                <div className="mp-modal-footer">
                  <button
                    type="button"
                    className="mp-btn mp-btn-cancel"
                    onClick={closeModal}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="mp-btn mp-btn-save"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="mp-spinner mp-spinner-sm" /> Saving...
                      </>
                    ) : editId ? (
                      <>
                        <FaSave /> Update Package
                      </>
                    ) : (
                      <>
                        <FaPlus /> Save Package
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

export default ManagePackages;