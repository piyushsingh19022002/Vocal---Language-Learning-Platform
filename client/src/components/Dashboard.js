import React, { useState, useEffect } from 'react';
import { getCurrentUser, getCourses } from '../utils/api';
import DashboardHeader from './dashboard/DashboardHeader';
import DashboardCards from './dashboard/DashboardCards';
import DashboardStats from './dashboard/DashboardStats';
import DashboardCourses from './dashboard/DashboardCourses';
import DashboardSkeleton from './dashboard/DashboardSkeleton';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, coursesData] = await Promise.all([
          getCurrentUser(),
          getCourses(),
        ]);
        setUser(userData);
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  const fluency = user?.progress?.get('French')?.fluency || 0;

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <DashboardHeader user={user} />

        <DashboardCards fluency={fluency} />

        <DashboardStats user={user} />

        <DashboardCourses courses={courses} user={user} />
      </div>
    </div>
  );
};

export default Dashboard;

