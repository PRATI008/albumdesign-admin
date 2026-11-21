
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import DashboardLayout from '../Components/DashboardLayout';
import '../Pages/CSS/AllBooking.css';

import { FaEdit, FaEye, FaPlus } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/$/, '');

// EMPTY FORM
const emptyForm = {
  albumPackage: 'Wedding Album',
  albumSize: '12 x 18 inch',
  albumPages: '30',
  numberOfCopies: '1',
  albumCover: 'Leather Cover',
  paperQuality: 'Matte',
  designStyle: 'Premium / Luxury',
  customerName: '',
  mobile: '',
  email: '',
  eventType: 'Wedding',
  eventDate: '',
  city: '',
  fullAddress: '',
  specialInstructions: ''
};

// FORM FIELDS
const formFields = [
  {
    name: 'albumPackage',
    label: 'Album Package',
    type: 'select',
    options: ['Wedding Album', 'Pre-Wedding Album', 'Birthday Album', 'Engagement Album', 'Other'],
    required: true
  },
  {
    name: 'albumSize',
    label: 'Album Size',
    type: 'select',
    options: ['12 x 18 inch', '12 x 15 inch', '10 x 15 inch', '8 x 12 inch']
  },
  {
    name: 'albumPages',
    label: 'Approx. Pages',
    type: 'select',
    options: ['20', '30', '40', '50', '60']
  },
  {
    name: 'numberOfCopies',
    label: 'Number of Copies',
    type: 'select',
    options: ['1', '2', '3', '4', '5']
  },
  {
    name: 'albumCover',
    label: 'Album Cover',
    type: 'select',
    options: ['Leather Cover', 'Crystal Cover', 'Glossy Cover', 'Matte Cover', 'Acrylic Cover']
  },
  {
    name: 'paperQuality',
    label: 'Paper Quality',
    type: 'select',
    options: ['Matte', 'Glossy', 'Silk', 'Lustre']
  },
  {
    name: 'designStyle',
    label: 'Design Style',
    type: 'select',
    options: ['Premium / Luxury', 'Traditional', 'Modern', 'Minimal', 'Creative']
  },
  {
    name: 'customerName',
    label: 'Customer Name',
    type: 'text',
    placeholder: 'Enter full name',
    required: true
  },
  {
    name: 'mobile',
    label: 'Mobile Number',
    type: 'tel',
    placeholder: 'e.g. 9695774046',
    required: true
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'name@example.com'
  },
  {
    name: 'eventType',
    label: 'Event Type',
    type: 'select',
    options: ['Wedding', 'Pre-Wedding', 'Birthday', 'Engagement', 'Anniversary', 'Other'],
    required: true
  },
  {
    name: 'eventDate',
    label: 'Event Date',
    type: 'date',
    required: true
  },
  {
    name: 'city',
    label: 'City / Village',
    type: 'text',
    placeholder: 'e.g. Raebareli',
    required: true
  },
  {
    name: 'fullAddress',
    label: 'Full Address',
    type: 'text',
    placeholder: 'House / Street, Landmark, Area...',
    fullWidth: true
  },
  {
    name: 'specialInstructions',
    label: 'Special Instructions',
    type: 'textarea',
    placeholder: 'Specific design ideas, couple names, date format, song/quote preferences...',
    fullWidth: true
  }
];

// FORMAT DATE FOR INPUT
const formatDate = (date) => {
  if (!date) return '';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return '';

  return parsedDate.toISOString().split('T')[0];
};

// CREATE API PAYLOAD
const createPayload = (form) => ({
  albumPackage: form.albumPackage.trim(),
  albumPages: form.albumPages ? Number(form.albumPages) : undefined,
  numberOfCopies: form.numberOfCopies ? Number(form.numberOfCopies) : 1,
  albumSize: form.albumSize.trim(),
  albumCover: form.albumCover.trim(),
  designStyle: form.designStyle.trim(),
  paperQuality: form.paperQuality.trim(),
  customerName: form.customerName.trim(),
  mobile: form.mobile.trim(),
  email: form.email.trim(),
  eventType: form.eventType.trim(),
  eventDate: form.eventDate,
  city: form.city.trim(),
  fullAddress: form.fullAddress.trim(),
  specialInstructions: form.specialInstructions.trim()
});

const AllBooking = () => {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [addForm, setAddForm] = useState({ ...emptyForm });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editBooking, setEditBooking] = useState({});

  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  // FETCH ALL BOOKINGS
  const fetchBookings = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/bookings`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch bookings');
      }

      const list = Array.isArray(data)
        ? data
        : data.bookings || data.data || [];

      setBookings(list);

    } catch (err) {
      toast.error(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ADD BOOKING
  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      setAdding(true);

      const payload = createPayload(addForm);

      const res = await fetch(`${API_URL}/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || 'Failed to add booking');
      }

      const newBooking = data.booking;

      setBookings((prev) => [newBooking, ...prev]);
      setShowAdd(false);
      setAddForm({ ...emptyForm });

      toast.success('Album Booking Added Successfully!');

    } catch (err) {
      console.error('Add Error:', err);
      toast.error(err.message || 'Failed to add booking');
    } finally {
      setAdding(false);
    }
  };

  // VIEW BOOKING
  const handleView = (item) => {
    setSelectedBooking(item);
    setShowView(true);
  };

  // EDIT BOOKING
  const handleEdit = (item) => {
    setEditBooking({
      _id: item._id || '',
      albumPackage: item.albumPackage || item.albumType || '',
      albumPages: item.albumPages ?? '',
      numberOfCopies: item.numberOfCopies ?? 1,
      albumSize: item.albumSize || '',
      albumCover: item.albumCover || '',
      designStyle: item.designStyle || '',
      paperQuality: item.paperQuality || '',
      customerName: item.customerName || '',
      mobile: item.mobile || '',
      email: item.email || '',
      eventType: item.eventType || '',
      eventDate: formatDate(item.eventDate),
      city: item.city || '',
      fullAddress: item.fullAddress || '',
      specialInstructions: item.specialInstructions || ''
    });

    setSelectedBooking(item);
    setShowEdit(true);
  };

  // CLOSE MODALS
  const closeAddModal = () => {
    if (adding) return;

    setShowAdd(false);
    setAddForm({ ...emptyForm });
  };

  const closeViewModal = () => {
    setShowView(false);
    setSelectedBooking(null);
  };

  const closeEditModal = () => {
    if (saving) return;

    setShowEdit(false);
    setSelectedBooking(null);
    setEditBooking({});
  };

  // INPUT HANDLERS
  const handleAddInput = (e) => {
    const { name, value } = e.target;

    setAddForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditInput = (e) => {
    const { name, value } = e.target;

    setEditBooking((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // UPDATE BOOKING
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editBooking._id) {
      toast.warning('Booking ID not found!');
      return;
    }

    try {
      setSaving(true);

      const payload = createPayload(editBooking);

      const res = await fetch(`${API_URL}/booking/${editBooking._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || 'Failed to update booking');
      }

      const updated = data.booking;

      setBookings((prev) =>
        prev.map((item) =>
          item._id === editBooking._id ? updated : item
        )
      );

      setShowEdit(false);
      setSelectedBooking(null);
      setEditBooking({});

      toast.success('Album Booking Updated Successfully!');

    } catch (err) {
      console.error('Update Error:', err);
      toast.error(err.message || 'Failed to update booking');
    } finally {
      setSaving(false);
    }
  };

  // DELETE BOOKING
  const handleDelete = (id) => {
    toast(
      ({ closeToast }) => (
        <div className="ab-toast-confirm">
          <p>Are you sure you want to delete this booking?</p>

          <div className="ab-toast-confirm-btns">
            <button
              className="ab-toast-btn ab-toast-btn-yes"
              onClick={async () => {
                closeToast();

                try {
                  const res = await fetch(`${API_URL}/booking/${id}`, {
                    method: 'DELETE'
                  });

                  const data = await res.json();

                  if (!res.ok || data.success === false) {
                    throw new Error(data.message || 'Unable to delete booking');
                  }

                  setBookings((prev) =>
                    prev.filter((item) => item._id !== id)
                  );

                  toast.success('Album Booking Deleted!');

                } catch (err) {
                  toast.error(err.message || 'Failed to delete booking');
                }
              }}
            >
              Yes, Delete
            </button>

            <button
              className="ab-toast-btn ab-toast-btn-no"
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
        className: 'ab-toast-confirm-wrapper'
      }
    );
  };

  // SEARCH FILTER
  const filteredData = bookings.filter((item) => {
    const q = search.toLowerCase().trim();

    return (
      item.customerName?.toLowerCase().includes(q) ||
      item.mobile?.toString().includes(q) ||
      item.email?.toLowerCase().includes(q) ||
      (item.albumPackage || item.albumType || '').toLowerCase().includes(q) ||
      item.eventType?.toLowerCase().includes(q) ||
      item.city?.toLowerCase().includes(q)
    );
  });

  // VIEW FIELDS
  const viewFields = selectedBooking ? [
    ['Album Package', selectedBooking.albumPackage || selectedBooking.albumType],
    ['Album Size', selectedBooking.albumSize],
    ['Approx. Pages', selectedBooking.albumPages],
    ['Number of Copies', selectedBooking.numberOfCopies],
    ['Album Cover', selectedBooking.albumCover],
    ['Paper Quality', selectedBooking.paperQuality],
    ['Design Style', selectedBooking.designStyle],
    ['Customer Name', selectedBooking.customerName],
    ['Mobile Number', selectedBooking.mobile],
    ['Email Address', selectedBooking.email],
    ['Event Type', selectedBooking.eventType],
    ['Event Date', formatDate(selectedBooking.eventDate)],
    ['City / Village', selectedBooking.city],
    ['Full Address', selectedBooking.fullAddress],
    ['Special Instructions', selectedBooking.specialInstructions],
    ['Booking Status', selectedBooking.status]
  ] : [];

  // RENDER FORM FIELD
  const renderField = (field, formData, handleInput) => (
    <div
      className={`ab-form-group ${field.fullWidth ? 'ab-full-width' : ''}`}
      key={field.name}
    >
      <label className="ab-label">
        {field.label}
        {field.required && <span style={{ color: '#dc3545' }}> *</span>}
      </label>

      {field.type === 'select' ? (
        <select
          className="ab-input"
          name={field.name}
          value={formData[field.name] ?? ''}
          onChange={handleInput}
          required={field.required || false}
        >
          <option value="">Select {field.label}</option>

          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : field.type === 'textarea' ? (
        <textarea
          className="ab-input"
          name={field.name}
          placeholder={field.placeholder}
          value={formData[field.name] ?? ''}
          onChange={handleInput}
          rows="4"
        />
      ) : (
        <input
          className="ab-input"
          type={field.type}
          name={field.name}
          placeholder={field.placeholder || ''}
          value={formData[field.name] ?? ''}
          onChange={handleInput}
          required={field.required || false}
          min={field.name === 'albumPages' ? 1 : undefined}
          maxLength={field.name === 'mobile' ? 10 : undefined}
        />
      )}
    </div>
  );

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <DashboardLayout title="All Album Bookings">

        <div className="ab-card">

          {/* HEADER */}
          <div className="ab-card-header">
            <h5 className="ab-title">
              All Album Bookings ({filteredData.length})
            </h5>

            <div className="ab-header-right">
              <input
                className="ab-search"
                type="text"
                placeholder="Search name, mobile, album..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button
                className="ab-add-btn"
                onClick={() => setShowAdd(true)}
              >
                <FaPlus className="ab-add-icon" />
                Add Booking
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="ab-table-wrapper">
            <table className="ab-table">
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Album Package</th>
                  <th>Customer Name</th>
                  <th>Mobile Number</th>
                  <th>Event Type</th>
                  <th>Event Date</th>
                  <th>City</th>
                  <th>Album Size</th>
                  <th>Copies</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="11" className="ab-center-cell">
                      <span className="ab-spinner" /> Loading bookings...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="ab-center-cell">
                      No album bookings found
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, idx) => (
                    <tr key={item._id}>
                      <td>{idx + 1}</td>
                      <td>{item.albumPackage || item.albumType || '-'}</td>
                      <td className="ab-name">{item.customerName || '-'}</td>
                      <td>{item.mobile || '-'}</td>
                      <td>{item.eventType || '-'}</td>
                      <td>{formatDate(item.eventDate) || '-'}</td>
                      <td>{item.city || '-'}</td>
                      <td>{item.albumSize || '-'}</td>
                      <td>{item.numberOfCopies ?? '-'}</td>
                      <td>{item.status || 'Pending'}</td>

                      <td>
                        <div className="ab-actions">
                          <button
                            className="ab-btn ab-btn-view"
                            title="View"
                            onClick={() => handleView(item)}
                          >
                            <FaEye />
                          </button>

                          <button
                            className="ab-btn ab-btn-edit"
                            title="Edit"
                            onClick={() => handleEdit(item)}
                          >
                            <FaEdit />
                          </button>

                          <button
                            className="ab-btn ab-btn-delete"
                            title="Delete"
                            onClick={() => handleDelete(item._id)}
                          >
                            <MdDelete />
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

        {/* ADD BOOKING MODAL */}
        {showAdd && (
          <div className="ab-overlay">
            <div className="ab-modal">

              <div className="ab-modal-header">
                <h5 className="ab-modal-title">Add New Booking</h5>

                {!adding && (
                  <button className="ab-close-btn" onClick={closeAddModal}>
                    ✕
                  </button>
                )}
              </div>

              <form className="ab-modal-form" onSubmit={handleAdd}>
                <div className="ab-modal-body">
                  <div className="ab-form-grid">
                    {formFields.map((field) =>
                      renderField(field, addForm, handleAddInput)
                    )}
                  </div>
                </div>

                <div className="ab-modal-footer">
                  <button
                    type="button"
                    className="ab-btn-modal ab-btn-secondary"
                    onClick={closeAddModal}
                    disabled={adding}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="ab-btn-modal ab-btn-success"
                    disabled={adding}
                  >
                    {adding ? (
                      <><span className="ab-spinner ab-spinner-sm" /> Adding...</>
                    ) : (
                      <><FaPlus style={{ marginRight: 6 }} /> Add Booking</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* VIEW BOOKING MODAL */}
        {showView && (
          <div className="ab-overlay" onClick={closeViewModal}>
            <div className="ab-modal" onClick={(e) => e.stopPropagation()}>

              <div className="ab-modal-header">
                <h5 className="ab-modal-title">Album Booking Details</h5>

                <button className="ab-close-btn" onClick={closeViewModal}>
                  ✕
                </button>
              </div>

              <div className="ab-modal-body">
                <div className="ab-view-grid">
                  {viewFields.map(([label, value]) => (
                    <div className="ab-view-box" key={label}>
                      <small className="ab-view-label">{label}</small>
                      <div className="ab-view-value">{value || '-'}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ab-modal-footer">
                <button
                  className="ab-btn-modal ab-btn-secondary"
                  onClick={closeViewModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT BOOKING MODAL */}
        {showEdit && (
          <div className="ab-overlay">
            <div className="ab-modal">

              <div className="ab-modal-header">
                <h5 className="ab-modal-title">Edit Album Booking</h5>

                {!saving && (
                  <button className="ab-close-btn" onClick={closeEditModal}>
                    ✕
                  </button>
                )}
              </div>

              <form className="ab-modal-form" onSubmit={handleUpdate}>
                <div className="ab-modal-body">
                  <div className="ab-form-grid">
                    {formFields.map((field) =>
                      renderField(field, editBooking, handleEditInput)
                    )}
                  </div>
                </div>

                <div className="ab-modal-footer">
                  <button
                    type="button"
                    className="ab-btn-modal ab-btn-secondary"
                    onClick={closeEditModal}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="ab-btn-modal ab-btn-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <><span className="ab-spinner ab-spinner-sm" /> Updating...</>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </DashboardLayout>
    </>
  );
};

export default AllBooking;
