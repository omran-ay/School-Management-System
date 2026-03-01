import api from "../api/axios";

const studentService = {
  getStudentById: (id) => api.get(`/students/${id}`),
  addNewStudent: (data) => api.post("/students/addNewStudent", data),
  // getAllStudents: () => api.get("/students"),
};
// console.log(studentService.addNewStudent);

export default studentService;
