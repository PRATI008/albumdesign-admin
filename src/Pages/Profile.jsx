
import React, { useEffect, useState } from 'react';
import { Container, Card, Spinner } from 'react-bootstrap';
import axios from 'axios';

import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaExternalLinkAlt
} from 'react-icons/fa';

import DashboardLayout from '../Components/DashboardLayout';
import './CSS/Profile.css';

const API_URL = 'http://localhost:4000/api';

const Profile = () => {

  const [admin, setAdmin] = useState({
    name: '',
    email: ''
  });

  const [settings, setSettings] = useState({
    mobile: '',
    email: '',
    address: '',
    facebook: '',
    instagram: '',
    linkedin: ''
  });

  const [loading, setLoading] = useState(true);

  // Get Logged-in Admin Details
  useEffect(() => {
    const savedAdmin = localStorage.getItem('adminInfo');

    if (savedAdmin) {
      try {
        const adminData = JSON.parse(savedAdmin);

        setAdmin({
          name: adminData.name || 'Admin',
          email: adminData.email || 'Email not available'
        });

      } catch (error) {
        console.error('Admin Profile Error:', error);
      }
    }

    fetchSettings();
  }, []);

  // Fetch Website Settings from Backend
  const fetchSettings = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/site-settings`
      );

      if (response.data.success && response.data.settings) {
        setSettings({
          mobile: response.data.settings.mobile || '',
          email: response.data.settings.email || '',
          address: response.data.settings.address || '',
          facebook: response.data.settings.facebook || '',
          instagram: response.data.settings.instagram || '',
          linkedin: response.data.settings.linkedin || ''
        });
      }

    } catch (error) {
      console.error('Profile Settings Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate Admin Initials
  const getInitials = () => {
    const name = admin.name || 'Admin';

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  };

  return (
    <DashboardLayout>

      <div className="admin-profile-page">
        <Container fluid>

          {/* Page Heading */}
          <div className="profile-page-heading">
            <div>
              <h3>My Profile</h3>
              <p>View your admin and website information.</p>
            </div>
          </div>

          {/* Admin Profile Section */}
          <Card className="profile-main-card">

            <Card.Body>

              <div className="profile-admin-header">

                <div className="profile-avatar">
                  {getInitials()}
                </div>

                <div className="profile-admin-details">
                  <h4>{admin.name || 'Admin'}</h4>

                  <p>
                    <FaEnvelope />
                    {admin.email || 'Email not available'}
                  </p>
                </div>

              </div>

              <div className="profile-divider"></div>

              <div className="profile-section-heading">
                <h5>Admin Information</h5>
                <p>Your logged-in account details.</p>
              </div>

              <div className="profile-info-grid">

                <div className="profile-info-item">
                  <div className="profile-info-icon">
                    <FaUser />
                  </div>

                  <div className="profile-info-content">
                    <span>Admin Name</span>
                    <h6>{admin.name || 'Not Available'}</h6>
                  </div>
                </div>

                <div className="profile-info-item">
                  <div className="profile-info-icon">
                    <FaEnvelope />
                  </div>

                  <div className="profile-info-content">
                    <span>Login Email</span>
                    <h6>{admin.email || 'Not Available'}</h6>
                  </div>
                </div>

              </div>

            </Card.Body>
          </Card>

          {/* Website Contact Section */}
          <Card className="profile-main-card website-info-card">

            <Card.Body>

              <div className="profile-section-heading">
                <h5>Website Contact Information</h5>
                <p>Contact details saved from Site Settings.</p>
              </div>

              {loading ? (

                <div className="profile-loader">
                  <Spinner animation="border" />
                  <p>Loading information...</p>
                </div>

              ) : (

                <div className="profile-info-grid">

                  {/* Mobile */}
                  <div className="profile-info-item">
                    <div className="profile-info-icon">
                      <FaPhoneAlt />
                    </div>

                    <div className="profile-info-content">
                      <span>Mobile Number</span>

                      {settings.mobile ? (
                        <a href={`tel:${settings.mobile}`}>
                          {settings.mobile}
                        </a>
                      ) : (
                        <h6 className="not-available">Not Added</h6>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="profile-info-item">
                    <div className="profile-info-icon">
                      <FaEnvelope />
                    </div>

                    <div className="profile-info-content">
                      <span>Contact Email</span>

                      {settings.email ? (
                        <a href={`mailto:${settings.email}`}>
                          {settings.email}
                        </a>
                      ) : (
                        <h6 className="not-available">Not Added</h6>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="profile-info-item profile-full-width">
                    <div className="profile-info-icon">
                      <FaMapMarkerAlt />
                    </div>

                    <div className="profile-info-content">
                      <span>Office Address</span>
                      <h6>
                        {settings.address || 'Not Added'}
                      </h6>
                    </div>
                  </div>

                </div>

              )}

            </Card.Body>
          </Card>

          {/* Social Media Section */}
          <Card className="profile-main-card social-info-card">

            <Card.Body>

              <div className="profile-section-heading">
                <h5>Social Media Links</h5>
                <p>Your connected social media profiles.</p>
              </div>

              {loading ? (

                <div className="profile-loader">
                  <Spinner animation="border" />
                  <p>Loading social links...</p>
                </div>

              ) : (

                <div className="profile-social-grid">

                  {/* Facebook */}
                  <div className="profile-social-item">
                    <div className="social-icon facebook">
                      <FaFacebookF />
                    </div>

                    <div className="social-content">
                      <h6>Facebook</h6>

                      {settings.facebook ? (
                        <a
                          href={settings.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit Profile <FaExternalLinkAlt />
                        </a>
                      ) : (
                        <span>Not Added</span>
                      )}
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="profile-social-item">
                    <div className="social-icon instagram">
                      <FaInstagram />
                    </div>

                    <div className="social-content">
                      <h6>Instagram</h6>

                      {settings.instagram ? (
                        <a
                          href={settings.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit Profile <FaExternalLinkAlt />
                        </a>
                      ) : (
                        <span>Not Added</span>
                      )}
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className="profile-social-item">
                    <div className="social-icon linkedin">
                      <FaLinkedinIn />
                    </div>

                    <div className="social-content">
                      <h6>LinkedIn</h6>

                      {settings.linkedin ? (
                        <a
                          href={settings.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit Profile <FaExternalLinkAlt />
                        </a>
                      ) : (
                        <span>Not Added</span>
                      )}
                    </div>
                  </div>

                </div>

              )}

            </Card.Body>
          </Card>

        </Container>
      </div>

    </DashboardLayout>
  );
};

export default Profile;
