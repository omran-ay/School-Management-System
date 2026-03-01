import React from "react";
import PageLayout from "../../components/layout/PageLayout";
import AddClassroom from "../../components/layout/classrooms/AddClassrooms";
import ClassroomList from "../../components/layout/classrooms/ClassroomList";

function UnitClassrooms() {
  return (
    <div>
      <AddClassroom />
      <ClassroomList />
    </div>
  );
}

export default UnitClassrooms;
