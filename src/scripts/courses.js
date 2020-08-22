import courseJSON from '../assets/courses.json'
import courseTrayJSON from '../assets/coursetray.json'

class Courses {
  constructor () {
    this.allCourses = courseJSON
    this.trays = courseTrayJSON
    this.wantedCourses = {
      1: ['MAY1.D1']
    }
    this.selections = {}
  }

  getCompletedBeforeTray = trayNumber => {
    console.log(trayNumber)
  };

  getGroupData = groupKey => {
    for (const trayNum in this.trays) {
      const tray = this.trays[trayNum]
      for (const barNum in tray) {
        const bar = tray[barNum]
        for (const group of bar) {
          if (group.groupKey === groupKey) {
            return {
              tray,
              bar,
              ...group
            }
          }
        }
      }
    }
    return null
  }

  canSelect = (groupKey, allowOverlap = false) => {
    const groupData = this.getGroupData(groupKey)
    if (this.getSelection(groupData.tray, groupData.bar) === undefined || allowOverlap) { // is some other course selected currently
      return true
    } else {
      return false
    }
  }

  getSelection = (tray, bar) => {
    this.selections[tray] = this.selections[tray] || {}
    this.selections[tray][bar] = this.selections[tray][bar] || null
    return this.selections[tray][bar]
  }

  setSelection = (tray, bar, newGroup) => {
    this.selections[tray] = this.selections[tray] || {}
    this.selections[tray][bar] = newGroup
  }

  selectGroup = groupKey => {
    if (this.canSelect(groupKey, true)) {
      const groupData = this.getGroupData(groupKey)
      this.setSelection(groupData.tray, groupData.bar, groupKey)
      console.log(this.isSelected(groupKey))
    }
  }

  removeGroup = groupKey => {
    const groupData = this.getGroupData(groupKey)
    this.selections[groupData.tray][groupData.bar] = null
  }

  isSelected = groupKey => {
    const groupData = this.getGroupData(groupKey)
    console.log(groupKey)
    console.log(this.getSelection(groupData.tray, groupData.bar))
    return this.getSelection(groupData.tray, groupData.bar) === groupKey
  }
}

export default new Courses()
