import React from "react";
import AddTimetable from "../../components/layout/timetable/AddTimetable";
import StudentTimetable from "../../components/layout/timetable/StudentTimetable";
import TeacherTimetable from "../../components/layout/timetable/TeacherTimetable";
import TimetableList from "../../components/layout/timetable/TimetableList";

function UnitTimeTabel() {
  return (
    <div>
      <AddTimetable />
      <StudentTimetable />
      <TeacherTimetable />
      <TimetableList />
    </div>
  );
}

export default UnitTimeTabel;
