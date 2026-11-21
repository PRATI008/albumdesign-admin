
import React, { useState } from 'react';
import './CSS/DashboardLayout.css';
import { NavLink, useNavigate } from 'react-router-dom';

const DashboardLayout = ({ children, title = 'Admin Control Panel' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openDropdown, setOpenDropdown] = useState('');
  const navigate = useNavigate();

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? '' : name);
  };

  const closeSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboardLayout-outer">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`dashboardLayout-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>

        <div className="sidebar-top">
          <p>
            <b>Singh</b> <span>Album Design</span>
          </p>
        </div>

        <nav className="sidebar-menu">

          <NavLink
            to="/dashboard"
            end
            onClick={closeSidebar}
            className={({ isActive }) => `navLink ${isActive ? 'active' : ''}`}
          >
            <span className="menu-icon">▦</span>
            Dashboard
          </NavLink>

          <NavLink
            to="/user"
            onClick={closeSidebar}
            className={({ isActive }) => `navLink ${isActive ? 'active' : ''}`}
          >
            <span className="menu-icon">♙</span>
            Users
          </NavLink>

          <NavLink
            to="/enquiry"
            onClick={closeSidebar}
            className={({ isActive }) => `navLink ${isActive ? 'active' : ''}`}
          >
            <span className="menu-icon">✉</span>
            Enquiry
          </NavLink>

          {/* BOOKING DROPDOWN */}
          <div className="menu-group">

            <button
              type="button"
              className={`navLink dropdown-btn ${openDropdown === 'booking' ? 'dropdown-active' : ''}`}
              onClick={() => toggleDropdown('booking')}
            >
              <span>
                <span className="menu-icon">▣</span>
                Booking
              </span>

              <span className="dropdown-arrow">
                {openDropdown === 'booking' ? '▴' : '▾'}
              </span>
            </button>

            {openDropdown === 'booking' && (
              <div className="submenu">

                <NavLink
                  to="/booking/allbooking"
                  end
                  onClick={closeSidebar}
                  className={({ isActive }) => `subLink ${isActive ? 'active' : ''}`}
                >
                  All Booking
                </NavLink>

                <NavLink
                  to="/booking/packages"
                  onClick={closeSidebar}
                  className={({ isActive }) => `subLink ${isActive ? 'active' : ''}`}
                >
                  Manage Package
                </NavLink>

                <NavLink
                  to="/booking/design-styles"
                  onClick={closeSidebar}
                  className={({ isActive }) => `subLink ${isActive ? 'active' : ''}`}
                >
                  Manage Design Style
                </NavLink>

              </div>
            )}

          </div>

          {/* SITE SETTING DROPDOWN */}
          <div className="menu-group">

            <button
              type="button"
              className={`navLink dropdown-btn ${openDropdown === 'setting' ? 'dropdown-active' : ''}`}
              onClick={() => toggleDropdown('setting')}
            >
              <span>
                <span className="menu-icon">⚙</span>
                Site Setting
              </span>

              <span className="dropdown-arrow">
                {openDropdown === 'setting' ? '▴' : '▾'}
              </span>
            </button>

            {openDropdown === 'setting' && (
              <div className="submenu">

                <NavLink
                  to="/setting/contact"
                  onClick={closeSidebar}
                  className={({ isActive }) => `subLink ${isActive ? 'active' : ''}`}
                >
                  Contact, Email, Address
                </NavLink>

                <NavLink
                  to="/setting/profile"
                  onClick={closeSidebar}
                  className={({ isActive }) => `subLink ${isActive ? 'active' : ''}`}
                >
                  Admin Profile
                </NavLink>

              </div>
            )}

          </div>

        </nav>

        {/* LOGOUT */}
        <div className="sidebar-bottom">

          <button
            type="button"
            className="logout-btn"
            onClick={handleLogout}
          >
            <span>⇥</span> Logout
          </button>

        </div>

      </aside>

      {/* MAIN SECTION */}
      <div className="dashboardLayout-main">

        {/* HEADER */}
        <header className="dashboardLayout-header">

          <div className="header-first">

            <button
              type="button"
              className="closebtn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title="Toggle Sidebar"
            >
              ☰
            </button>

            <h3>{title}</h3>

          </div>

          {/* ADMIN PROFILE */}
          <div className="header-profile">

            <div className="admin-info">
              <span>Singh Admin</span>
              <small>Administrator</small>
            </div>

            <div className="admin-avatar">
              SA
            </div>

          </div>

        </header>

        {/* PAGE CONTENT */}
        <main className="dashboardLayout-content">
          {children}
        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;
