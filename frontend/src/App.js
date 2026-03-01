import "./App.css";
import Login from "./pages/admin/Login";
import Register from "./pages/admin/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import {
  createBrowserRouter,
  Navigate,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import UpdateStudent from "./components/layout/students/UpdateStudent";
import DetailsStudent from "./components/layout/students/DetailsStudent";
import UnitStudents from "./pages/admin/UnitStudents";
import UnitTeachers from "./pages/admin/UnitTeachers";
import UnitClassrooms from "./pages/admin/UnitClassrooms";
import PageLayout from "./components/layout/PageLayout";
import UpdateTeacher from "./components/layout/teacher/UpdateTeacher";
import DetailsTeacher from "./components/layout/teacher/DetailsTeacher";
import UpdateClassroom from "./components/layout/classrooms/UpdateClassrooms";
import DetailsClassroom from "./components/layout/classrooms/DetailsClassrooms";
import UnitStudent from "./pages/admin/UnitStudents";
import UnitSubjects from "./pages/admin/UnitSubjects";
import UnitCourses from "./pages/admin/UnitCourses";
import DetailsCourse from "./components/layout/courses/DetailsCourse";
import UpdateCourse from "./components/layout/courses/UpdateCourse";
import DetailsSubject from "./components/layout/subjects/DetailsSubject";
import UpdateSubject from "./components/layout/subjects/UpdateSubject";
import UnitEnrollment from "./pages/admin/UnitEnrollment";
import UnitGrads from "./pages/admin/UnitGrades";
import UnitTimeTable from "./pages/admin/UnitTimeTabel";
import LandingPage from "./pages/LandingPage";
import ForgotPassword from "./pages/admin/ForgotPassword";
import ResetPassword from "./pages/admin/ResetPassword";
import LinkSend from "./pages/admin/LinkSend";

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <LandingPage /> },
    { path: "/login", element: <Login /> },
    { path: "/forgotPassword", element: <ForgotPassword /> },
    { path: "/ResetPassword/:user_id/:token", element: <ResetPassword /> },
    { path: "/LinkSend", element: <LinkSend /> },

    {
      path: "/",
      element: <PageLayout />,
      children: [
        { path: "/adminDashboard", element: <AdminDashboard /> },
        { path: "/adminDashboard/students", element: <UnitStudents /> },
        { path: "/adminDashboard/teachers", element: <UnitTeachers /> },
        { path: "/adminDashboard/classrooms", element: <UnitClassrooms /> },
        { path: "/adminDashboard/subjects", element: <UnitSubjects /> },
        { path: "/adminDashboard/courses", element: <UnitCourses /> },
        { path: "/adminDashboard/enrollment", element: <UnitEnrollment /> },
        { path: "/adminDashboard/grades", element: <UnitGrads /> },
        { path: "/adminDashboard/timetable", element: <UnitTimeTable /> },
      ],
    },

    { path: "/adminDashboard/classrooms", element: <UnitClassrooms /> },
    {
      path: "/adminDashboard/updateClassroom/:id",
      element: <UpdateClassroom />,
    },
    { path: "/adminDashboard/updateStudent/:id", element: <UpdateStudent /> },
    { path: "/adminDashboard/updateTeacher/:id", element: <UpdateTeacher /> },
    { path: "/adminDashboard/updateCourse/:id", element: <UpdateCourse /> },
    { path: "/adminDashboard/updateSubject/:id", element: <UpdateSubject /> },

    { path: "/adminDashboard/detailsStudent/:id", element: <DetailsStudent /> },
    { path: "/adminDashboard/detailsTeacher/:id", element: <DetailsTeacher /> },
    { path: "/adminDashboard/detailsCourse/:id", element: <DetailsCourse /> },
    { path: "/adminDashboard/detailsSubject/:id", element: <DetailsSubject /> },

    {
      path: "/adminDashboard/detailsClassroom/:id",
      element: <DetailsClassroom />,
    },

    { path: "/register", element: <Register /> },
  ]);
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
