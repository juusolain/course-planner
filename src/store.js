import courses from "./scripts/courses.js";

function formatCourseArray(arr) {
  let newArr = [];
  arr.forEach(element => {
    newArr.push({ name: element });
  });
  return newArr;
}

class Store {
  constructor() {
    this.courseList = formatCourseArray(courses.allCourses);
    this.trays = courses.trays;
  }
}

export default new Store();
