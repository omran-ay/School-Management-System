// src/components/layout/PageLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const PageLayout = () => {
  const menuItems = [
    { label: "adminDashboard", path: "/adminDashboard" },
    { label: "Students", path: "/adminDashboard/students" },
    { label: "Teachers", path: "/adminDashboard/teachers" },
    { label: "Classrooms", path: "/adminDashboard/classrooms" },
    { label: "Courses", path: "/adminDashboard/courses" },
    { label: "Subjects", path: "/adminDashboard/subjects" },
    { label: "Enrollment", path: "/adminDashboard/enrollment" },
    { label: "Grades", path: "/adminDashboard/grades" },
    { label: "Timetable", path: "/adminDashboard/timetable" },
  ];

  return (
    <div className="flex h-screen ">
      <Sidebar menuItems={menuItems} />
      <main className="flex-1 bg-gradient-to-b from-white to-green-200 p-6 overflow-y-auto ">
        <Outlet />
      </main>
    </div>
  );
};

export default PageLayout;
