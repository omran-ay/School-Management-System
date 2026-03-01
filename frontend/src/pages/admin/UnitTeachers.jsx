import React from "react";
import PageLayout from "../../components/layout/PageLayout";
import AddTeacher from "../../components/layout/teacher/AddTeacher";
import TeacherList from "../../components/layout/teacher/TeacherList";

function UnitTeacher() {
  return (
    <div>
      <AddTeacher />
      <TeacherList />
    </div>
  );
}

export default UnitTeacher;
