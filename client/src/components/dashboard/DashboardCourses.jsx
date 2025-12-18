import React from 'react';
import CourseCard from '../CourseCard';

const DashboardCourses = ({ courses, user }) => {
  return (
    <div className="courses-section">
      <h2 className="section-title">Available Courses</h2>
      <div className="courses-grid">
        {courses
          .filter(course => course.status !== 'draft')
          .map((course) => {
            // Check if user has access (admin or enrolled)
            const isEnrolled = user?.role === 'admin' || 
              (user?.enrolledCourses && user.enrolledCourses.some(
                (ec) => (ec._id || ec).toString() === course._id.toString()
              ));
            return (
              <CourseCard 
                key={course._id} 
                course={course} 
                isEnrolled={isEnrolled}
              />
            );
          })}
      </div>
    </div>
  );
};

export default DashboardCourses;
