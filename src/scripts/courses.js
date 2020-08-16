import courseJSON from "../assets/courses.json";
import courseTrayJSON from "../assets/coursetray.json";

class Courses {
  constructor() {
    this.allCourses = courseJSON;
    this.courseTrayJSON = courseTrayJSON;
  }
}

export default new Courses();
