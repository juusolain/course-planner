import courseJSON from '../assets/courses.json'
import courseTrayJSON from '../assets/coursetray.json'

class Courses {
  constructor () {
    this.allCourses = courseJSON
    this.courseTrayJSON = courseTrayJSON
    this.wantedCourses = {
      1: ['MAA1']
    }
    this.lockedCourses = {
      2: ['TEA13.1']
    }
  }

  getCompletedBeforeTray = trayNumber => {
    console.log(trayNumber)
  };
}

export default new Courses()
