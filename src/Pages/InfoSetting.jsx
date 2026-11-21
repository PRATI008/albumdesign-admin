
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Spinner
} from 'react-bootstrap';

import Swal from 'sweetalert2';

import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaSave
} from 'react-icons/fa';

import DashboardLayout from '../Components/DashboardLayout';
import './CSS/InfoSetting.css';

const API_URL = 'http://localhost:4000/api';

const InfoSetting = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    mobile: '',
    email: '',
    address: '',
    facebook: '',
    instagram: '',
    linkedin: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Get Existing Settings
  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/site-settings`);

      if (response.data.success && response.data.settings) {
        setFormData({
          mobile: response.data.settings.mobile || '',
          email: response.data.settings.email || '',
          address: response.data.settings.address || '',
          facebook: response.data.settings.facebook || '',
          instagram: response.data.settings.instagram || '',
          linkedin: response.data.settings.linkedin || ''
        });
      }

    } catch (error) {
      if (error.response?.status !== 404) {
        console.error('Settings Fetch Error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Update Settings
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.mobile.trim() ||
      !formData.email.trim() ||
      !formData.address.trim()
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Required Fields',
        text: 'Please fill Mobile, Email and Address.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#172b4d'
      });

      return;
    }

    try {
      setSaving(true);

      const response = await axios.put(
        `${API_URL}/site-settings`,
        formData
      );

      if (response.data.success) {

        setFormData({
          mobile: response.data.settings.mobile || '',
          email: response.data.settings.email || '',
          address: response.data.settings.address || '',
          facebook: response.data.settings.facebook || '',
          instagram: response.data.settings.instagram || '',
          linkedin: response.data.settings.linkedin || ''
        });

        // Success Popup
        const result = await Swal.fire({
          icon: 'success',
          title: 'Settings Updated!',
          text: 'Your website settings have been updated successfully.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#172b4d',
          allowOutsideClick: false,
          allowEscapeKey: false
        });

        // Redirect after clicking OK
        if (result.isConfirmed) {
          navigate('/setting/profile');
        }
      }

    } catch (error) {
      console.error('Update Settings Error:', error);

      Swal.fire({
        icon: 'error',
        title: 'Update Failed!',
        text:
          error.response?.data?.message ||
          'Something went wrong. Please try again.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#172b4d'
      });

    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>

      <div className="site-settings-page">

        <Container fluid>

          {/* Page Heading */}
          <div className="site-settings-heading">
            <div>
              <h3>Site Settings</h3>
              <p>
                Manage your website contact details and social media links.
              </p>
            </div>
          </div>

          {loading ? (

            <div className="settings-loader">
              <Spinner animation="border" />
              <p>Loading Site Settings...</p>
            </div>

          ) : (

            <Card className="site-settings-card">

              <Card.Body>

                <Form onSubmit={handleSubmit}>

                  {/* Contact Information */}
                  <div className="settings-section-title">
                    <h5>Contact Information</h5>
                    <p>Update your website contact details.</p>
                  </div>

                  <Row>

                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <FaPhoneAlt /> Mobile Number
                        </Form.Label>

                        <Form.Control
                          type="tel"
                          name="mobile"
                          placeholder="Enter mobile number"
                          value={formData.mobile}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <FaEnvelope /> Email Address
                        </Form.Label>

                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Enter email address"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <FaMapMarkerAlt /> Office Address
                        </Form.Label>

                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="address"
                          placeholder="Enter complete office address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>

                  </Row>

                  <div className="settings-divider"></div>

                  {/* Social Media Links */}
                  <div className="settings-section-title">
                    <h5>Social Media Links</h5>
                    <p>Add your official social media profile links.</p>
                  </div>

                  <Row>

                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <FaFacebook className="facebook-icon" /> Facebook Link
                        </Form.Label>

                        <Form.Control
                          type="url"
                          name="facebook"
                          placeholder="https://www.facebook.com/yourpage"
                          value={formData.facebook}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <FaInstagram className="instagram-icon" /> Instagram Link
                        </Form.Label>

                        <Form.Control
                          type="url"
                          name="instagram"
                          placeholder="https://www.instagram.com/yourpage"
                          value={formData.instagram}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <FaLinkedin className="linkedin-icon" /> LinkedIn Link
                        </Form.Label>

                        <Form.Control
                          type="url"
                          name="linkedin"
                          placeholder="https://www.linkedin.com/company/yourpage"
                          value={formData.linkedin}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>

                  </Row>

                  {/* Submit Button */}
                  <div className="settings-submit-area">

                    <Button
                      type="submit"
                      className="settings-save-btn"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Spinner size="sm" animation="border" /> Saving...
                        </>
                      ) : (
                        <>
                          <FaSave /> Update Settings
                        </>
                      )}
                    </Button>

                  </div>

                </Form>

              </Card.Body>

            </Card>

          )}

        </Container>

      </div>

    </DashboardLayout>
  );
};

export default InfoSetting;
