import React from "react";
import AddStudent from "../../components/layout/students/AddStudent";
import StudentList from "../../components/layout/students/StudentList";
import PageLayout from "../../components/layout/PageLayout";

function UnitStudent() {
  return (
    <div>
      <AddStudent />
      <StudentList />
    </div>
  );
}

export default UnitStudent;
