
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../Components/DashboardLayout';
import './CSS/Dashboard.css';

import {
  FaUsers,
  FaBookOpen,
  FaBoxOpen,
  FaEnvelope
} from 'react-icons/fa';

const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
).replace(/\/$/, '');

const Dashboard = () => {
  const [counts, setCounts] = useState({
    users: 0,
    bookings: 0,
    packages: 0,
    enquiries: 0
  });

  const [loading, setLoading] = useState(true);

  // API response se list nikalne ke liye
  const getList = (data, keys = []) => {
    if (Array.isArray(data)) return data;

    for (const key of keys) {
      if (Array.isArray(data?.[key])) {
        return data[key];
      }
    }

    if (Array.isArray(data?.data)) return data.data;

    return [];
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const endpoints = [
          { key: 'users', url: '/users', responseKeys: ['users', 'user'] },
          { key: 'bookings', url: '/bookings', responseKeys: ['bookings'] },
          { key: 'packages', url: '/packages', responseKeys: ['packages'] },
          { key: 'enquiries', url: '/enquiries', responseKeys: ['enquiries'] }
        ];

        const results = await Promise.all(
          endpoints.map(async (item) => {
            try {
              const response = await fetch(`${API_URL}${item.url}`);

              if (!response.ok) {
                throw new Error(`${item.key} API failed: ${response.status}`);
              }

              const data = await response.json();
              const list = getList(data, item.responseKeys);

              return [item.key, list.length];
            } catch (error) {
              console.error(`${item.key} fetch error:`, error);
              return [item.key, 0];
            }
          })
        );

        setCounts(Object.fromEntries(results));
      } catch (error) {
        console.error('Dashboard Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const dashboardCards = [
    {
      title: 'Total Users',
      count: counts.users,
      icon: <FaUsers />,
      className: 'users-card'
    },
    {
      title: 'Total Bookings',
      count: counts.bookings,
      icon: <FaBookOpen />,
      className: 'bookings-card'
    },
    {
      title: 'Total Packages',
      count: counts.packages,
      icon: <FaBoxOpen />,
      className: 'packages-card'
    },
    {
      title: 'Total Enquiries',
      count: counts.enquiries,
      icon: <FaEnvelope />,
      className: 'enquiries-card'
    }
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="dashboard-container">

        <div className="dashboard-heading">
          <div>
            <h2>Dashboard</h2>
            <p>Welcome to your admin dashboard.</p>
          </div>
        </div>

        <div className="dashboard-stats-grid">
          {dashboardCards.map((card, index) => (
            <div className="dashboard-stat-card" key={index}>

              <div className={`dashboard-stat-icon ${card.className}`}>
                {card.icon}
              </div>

              <div className="dashboard-stat-info">
                <p>{card.title}</p>
                <h3>
                  {loading ? '...' : card.count}
                </h3>
              </div>

            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
