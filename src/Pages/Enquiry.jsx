
import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Badge,
  Modal,
  Form,
  Card,
  InputGroup,
  Spinner
} from 'react-bootstrap';
import { MdDelete } from "react-icons/md";
import { FaEye, FaMagnifyingGlass } from "react-icons/fa6";

import DashboardLayout from '../Components/DashboardLayout';
import './CSS/Enquiry.css';
import { FaEdit } from 'react-icons/fa';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/$/, '');

const readResponse = async (res) => {
  const text = await res.text();
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error('Server se invalid response mila.');
  }

  if (!res.ok || data.success === false) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
};

const Enquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [viewInq, setViewInq] = useState(null);
  const [editInq, setEditInq] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // FETCH ENQUIRIES
  const fetchEnquiries = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const res = await fetch(`${API_URL}/enquiries`);
      const data = await readResponse(res);

      const records = Array.isArray(data)
        ? data
        : data.enquiries || data.data || [];

      if (!Array.isArray(records)) {
        throw new Error('Invalid enquiries data received.');
      }

      setEnquiries(records);
    } catch (err) {
      console.error('Fetch Error:', err);
      setError(err.message || 'Server is not connected.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  // DELETE ENQUIRY
  const handleDelete = async (id) => {
    if (!window.confirm('Are you delete this enquiry')) {
      return;
    }

    try {
      setDeletingId(id);

      const res = await fetch(`${API_URL}/enquiry/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });

      await readResponse(res);

      setEnquiries(prev =>
        prev.filter(item => item._id !== id)
      );

      if (viewInq?._id === id) {
        setViewInq(null);
      }

      if (editInq?._id === id) {
        setEditInq(null);
      }

    } catch (err) {
      console.error('Delete Error:', err);
      alert(err.message || 'error occured in deleted.');
    } finally {
      setDeletingId(null);
    }
  };

  // EDIT ENQUIRY
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editInq?._id) return;

    try {
      setSaving(true);

      const res = await fetch(
        `${API_URL}/enquiry/${encodeURIComponent(editInq._id)}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: editInq.name,
            phone: editInq.phone,
            email: editInq.email,
            message: editInq.message,
            status: editInq.status
          })
        }
      );

      const data = await readResponse(res);

      const updatedEnquiry =
        data.enquiry ||
        data.updatedEnquiry ||
        data.data ||
        editInq;

      setEnquiries(prev =>
        prev.map(item =>
          item._id === editInq._id
            ? { ...item, ...updatedEnquiry }
            : item
        )
      );

      setViewInq(prev =>
        prev?._id === editInq._id
          ? { ...prev, ...updatedEnquiry }
          : prev
      );

      setEditInq(null);

    } catch (err) {
      console.error('Update Error:', err);
      alert(err.message || 'Not updated.');
    } finally {
      setSaving(false);
    }
  };

  // SEARCH FILTER

  // SEARCH FILTER
  const filteredData = enquiries.filter((item) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    const searchableFields = [
      item.name,
      item.phone,
      item.email,
      item.services,
      item.message,
      item.status
    ];

    return searchableFields.some((field) =>
      String(field || '').toLowerCase().includes(query)
    );
  });


  // STATISTICS
  const newCount = enquiries.filter(
    item => !item.status || item.status === 'New'
  ).length;

  const repliedCount = enquiries.filter(
    item => item.status === 'Replied'
  ).length;

  const updateField = (field, value) => {
    setEditInq(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
 <>
    <DashboardLayout title="Customer Enquiries">

      <div className="enquiry-page">

        {/* PAGE HEADING */}
        <div className="enquiry-heading">
          <div>
            <h4>Customer Enquiries</h4>
            <p>Manage and track all customer enquiries here.</p>
          </div>

          <Button
            className="enquiry-refresh-btn"
            onClick={fetchEnquiries}
            disabled={loading}
          >
            {loading ? (
              <Spinner size="sm" animation="border" />
            ) : (
              '↻'
            )}
            <span>Refresh</span>
          </Button>
        </div>

        {/* STATISTICS */}
        <div className="enquiry-stats">

          <Card className="enquiry-stat-card">
            <Card.Body>
              <div className="stat-icon total-icon">✉</div>
              <div>
                <p>Total Enquiries</p>
                <h3>{enquiries.length}</h3>
              </div>
            </Card.Body>
          </Card>

          <Card className="enquiry-stat-card">
            <Card.Body>
              <div className="stat-icon new-icon">◷</div>
              <div>
                <p>New Enquiries</p>
                <h3>{newCount}</h3>
              </div>
            </Card.Body>
          </Card>

          <Card className="enquiry-stat-card">
            <Card.Body>
              <div className="stat-icon replied-icon">✓</div>
              <div>
                <p>Replied Enquiries</p>
                <h3>{repliedCount}</h3>
              </div>
            </Card.Body>
          </Card>

        </div>

        {/* TABLE CARD */}
        
        <Card className="enquiry-table-card">

          <Card.Header className="enquiry-card-header">
            <div>
              <h5>Enquiry List</h5>
              <p>All customer messages and requests</p>
            </div>

          <div className="main-enquiry-search">
  <div className="enquiry-search">
  <InputGroup className="enquiry-search-group">
    {/* <InputGroup.Text>
      <span><FaMagnifyingGlass /></span>
    </InputGroup.Text> */}

    <Form.Control
      type="text"
      placeholder="Search by name, mobile, email..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      autoComplete="off"
    />

    {search && (
      <Button
        className="enquiry-search-clear"
        onClick={() => setSearch('')}
        type="button"
        title="Clear Search"
      >
        ✕
      </Button>
    )}
  </InputGroup>
</div>
</div>


          </Card.Header>

          <Card.Body className="p-0">

            <div className="enquiry-table-wrapper">
              <Table hover className="enquiry-table mb-0">

                <thead>
                  <tr>
                    <th>Sr No.</th>
                    <th>CLIENT NAME</th>
                    <th>MOBILE</th>
                    <th>EMAIL ADDRESS</th>
                    <th>Service</th>
                    <th>MESSAGE</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>

                  {loading ? (
                    <tr>
                      <td colSpan="7" className="enquiry-message-cell">
                        <Spinner animation="border" size="sm" />
                        <span>Loading enquiries...</span>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="7" className="enquiry-message-cell">
                        <div className="enquiry-error">
                          <p>{error}</p>
                          <Button size="sm" onClick={fetchEnquiries}>
                            Try Again
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="enquiry-message-cell">
                        <div className="enquiry-empty">
                          <span>✉</span>
                          <h6>No Enquiries Found</h6>
                          <p>
                            {search
                              ? 'Try another search keyword.'
                              : 'No available is customer enquiry now.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item, idx) => (
                      <tr key={item._id || idx}>

                        <td>{idx + 1}</td>

                        <td>
                          <div className="client-name">
                            <div className="client-avatar">
                              {item.name?.charAt(0)?.toUpperCase() || 'C'}
                            </div>
                            <strong>{item.name || 'N/A'}</strong>
                          </div>
                        </td>

                        <td className="client-phone">
                          {item.phone || 'N/A'}
                        </td>

                        <td className="client-email">
                          {item.email || 'N/A'}
                        </td>
                        <td>
                          {item.service || 'N/A'}
                        </td>

                        <td>
                          <div className="message-preview">
                            {item.message?.length > 35
                              ? item.message.slice(0, 35) + '...'
                              : item.message || 'N/A'}
                          </div>
                        </td>

                        <td>
                          <Badge
                            className={`enquiry-status ${
                              item.status === 'Replied'
                                ? 'status-replied'
                                : 'status-new'
                            }`}
                          >
                            {item.status || 'New'}
                          </Badge>
                        </td>

                        <td>
                          <div className="enquiry-actions">

                            <button
                              type="button"
                              className="action-btn action-view"
                              title="View Enquiry"
                              onClick={() => setViewInq(item)}
                            >
                              <FaEye />
                            </button>

                            <button
                              type="button"
                              className="action-btn action-edit"
                              title="Edit Enquiry"
                              onClick={() => setEditInq({ ...item })}
                            >
                              <FaEdit />
                            </button>

                            <button
                              type="button"
                              className="action-btn action-delete"
                              title="Delete Enquiry"
                              disabled={deletingId === item._id}
                              onClick={() => handleDelete(item._id)}
                            >
                              {deletingId === item._id ? (
                                <Spinner size="sm" animation="border" />
                              ) : (
                                <MdDelete />
                              )}
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))
                  )}

                </tbody>
              </Table>
            </div>

          </Card.Body>

          <Card.Footer className="enquiry-card-footer">
            Showing {filteredData.length} of {enquiries.length} enquiries
          </Card.Footer>

        </Card>

      </div>

      {/* VIEW MODAL */}
      <Modal
        show={!!viewInq}
        onHide={() => setViewInq(null)}
        centered
        className="enquiry-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Enquiry Details</Modal.Title>
        </Modal.Header>

        {viewInq && (
          <Modal.Body>

            <div className="view-client">
              <div className="view-client-avatar">
                {viewInq.name?.charAt(0)?.toUpperCase() || 'C'}
              </div>

              <div>
                <h5>{viewInq.name || 'N/A'}</h5>
                <Badge
                  className={`enquiry-status ${
                    viewInq.status === 'Replied'
                      ? 'status-replied'
                      : 'status-new'
                  }`}
                >
                  {viewInq.status || 'New'}
                </Badge>
              </div>
            </div>

            <div className="enquiry-details">

              <div className="detail-item">
                <span>Mobile Number</span>
                <strong>{viewInq.phone || 'N/A'}</strong>
              </div>

              <div className="detail-item">
                <span>Email Address</span>
                <strong>{viewInq.email || 'N/A'}</strong>
              </div>

              <div className="detail-item detail-message">
                <span>Customer Message</span>
                <p>{viewInq.message || 'No message available.'}</p>
              </div>

            </div>

          </Modal.Body>
        )}

        <Modal.Footer>
          <Button
            className="modal-close-btn"
            onClick={() => setViewInq(null)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        show={!!editInq}
        onHide={() => !saving && setEditInq(null)}
        centered
        className="enquiry-modal"
      >

        <Modal.Header closeButton={!saving}>
          <Modal.Title>Edit Enquiry</Modal.Title>
        </Modal.Header>

        {editInq && (
          <Form onSubmit={handleUpdate}>

            <Modal.Body className="enquiry-edit-body">

              <Form.Group>
                <Form.Label>Client Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editInq.name || ''}
                  onChange={e => updateField('name', e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  type="tel"
                  value={editInq.phone || ''}
                  onChange={e => updateField('phone', e.target.value)}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  value={editInq.email || ''}
                  onChange={e => updateField('email', e.target.value)}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Customer Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={editInq.message || ''}
                  onChange={e => updateField('message', e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Enquiry Status</Form.Label>
                <Form.Select
                  value={editInq.status || 'New'}
                  onChange={e => updateField('status', e.target.value)}
                >
                  <option value="New">New</option>
                  <option value="Replied">Replied</option>
                </Form.Select>
              </Form.Group>

            </Modal.Body>

            <Modal.Footer>

              <Button
                className="modal-close-btn"
                disabled={saving}
                onClick={() => setEditInq(null)}
              >
                Cancel
              </Button>

              <Button
                className="modal-save-btn"
                type="submit"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Spinner size="sm" animation="border" /> Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>

            </Modal.Footer>

          </Form>
        )}

      </Modal>

    </DashboardLayout>
 </>
  );
};

export default Enquiry;
