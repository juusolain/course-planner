import courseJSON from '../assets/courses.json'
import courseTrayJSON from '../assets/coursetray.json'

import Vue from 'vue'

class Courses {
  constructor () {
    this.allCourses = courseJSON
    this.originalTrays = courseTrayJSON
    // selected and completed courses by year
    this.courseSelections = {
      0: ['MAY01'],
      1: ['MAA02', 'MAA03', 'HI01', 'ENA01']
    }
    this.currentYear = 1
    this.trays = {}
    this.selections = {} // group selections
    this.loadTrays()
  }

  loadTrays = () => {
    for (const trayNum in this.originalTrays) {
      const tray = this.originalTrays[trayNum]
      for (const barNum in tray) {
        const bar = tray[barNum]
        for (const group of bar) {
          this.trays[trayNum] = this.trays[trayNum] || {}
          this.trays[trayNum][barNum] = this.trays[trayNum][barNum] || []
          this.trays[trayNum][barNum].push({ selected: this.isGroupSelected(group), courseSelected: this.isCourseSelected(group.courseKey), ...group })
        }
      }
    }
  }

  getCompletedBeforeTray = trayNumber => {
    const res = []
    for (const trayNum in this.selections) {
      for (const barName in this.selections[trayNum]) {
        if (trayNum < trayNumber) {
          res.push(this.selections[trayNum][barName])
        }
      }
    }
  }

  getGroupData = groupKey => {
    for (const trayNum in this.trays) {
      const tray = this.trays[trayNum]
      for (const barNum in tray) {
        const bar = tray[barNum]
        for (const group of bar) {
          if (group.groupKey === groupKey) {
            return group
          }
        }
      }
    }
    return null
  }

  canSelect = (group, allowOverlap = false) => {
    if (this.getSelection(group.tray, group.bar) === undefined || allowOverlap) { // is some other course selected currently
      if (!this.isCourseCompleted(group.courseKey)) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  isCourseCompleted = courseKey => {
    let result = false
    for (let i = 0; i++; i < this.currentYear) {
      if (this.courseSelections[i]) {
        const courses = this.courseSelections[i]
        courses.forEach(course => {
          if (course === courseKey) {
            result = true
          }
        })
      }
    }
    return result
  }

  isCourseWanted = courseKey => {
    let result = false
    if (this.courseSelections[this.currentYear]) {
      const courses = this.courseSelections[this.currentYear]
      courses.forEach(course => {
        if (course === courseKey) {
          result = true
        }
      })
    }
    return result
  }

  addWantedCourse = courseKey => {
    this.courseSelections[this.currentYear] = this.courseSelections[this.currentYear] || []
    this.courseSelections[this.currentYear].push(courseKey)
  }

  getSelection = (tray, bar) => {
    this.selections[tray] = this.selections[tray] || {}
    this.selections[tray][bar] = this.selections[tray][bar] || null
    return this.selections[tray][bar]
  }

  // set null if set to none
  setSelection = (tray, bar, newGroup) => {
    var oldSelection = this.getSelection(tray, bar)
    this.selections[tray] = this.selections[tray] || {}

    if (oldSelection) {
      console.log(oldSelection)
      const oldIndex = this.trays[tray][bar].findIndex((elem) => elem.groupKey === oldSelection.groupKey)
      oldSelection.selected = false
      console.log(oldIndex)
      Vue.set(this.trays[tray][bar], oldIndex, oldSelection)
      console.log(this.trays[tray][bar][oldIndex])
    }

    if (newGroup) {
      newGroup.selected = true
      const newIndex = this.trays[tray][bar].findIndex((elem) => elem.groupKey === newGroup.groupKey)
      Vue.set(this.trays[tray][bar], newIndex, newGroup)
    }

    Vue.set(this.selections[tray], bar, newGroup)
  }

  selectGroup = group => {
    if (this.canSelect(group, true)) {
      this.setSelection(group.tray, group.bar, group)
      this.setCourseSelections(group.courseKey)
      if (!this.isCourseWanted(group.courseKey)) {
        this.addWantedCourse(group.courseKey)
      }
    }
  }

  removeGroup = group => {
    this.setSelection(group.tray, group.bar, null)
    this.setCourseSelections(group.courseKey)
  }

  isGroupSelected = group => {
    return this.getSelection(group.tray, group.bar) === group
  }

  isCourseSelected = courseKey => {
    let res = false
    loopSelections(this.selections, group => {
      console.log(group.courseKey, courseKey)
      if (group.courseKey === courseKey) res = true
    })
    return res
  }

  setCourseSelections = (courseKey) => {
    const newValue = this.isCourseSelected(courseKey)
    loopTrays(this.trays, (elem, index, arr) => {
      if (elem) {
        if (elem.courseKey === courseKey) {
          console.log('setting courseselected', newValue)
          Vue.set(arr[index], 'courseSelected', newValue)
        }
      }
    })
  }
}

function loopTrays (trays, cb) {
  for (const trayNum in trays) {
    const tray = trays[trayNum]
    for (const barNum in tray) {
      console.log('BEGIN')
      var arr = trays[trayNum][barNum]
      arr.forEach(cb)
      Vue.set(trays[trayNum], barNum, arr)
    }
  }
}

function loopSelections (selections, cb) {
  for (const trayNum in selections) {
    const tray = selections[trayNum]
    for (const courseNum in tray) {
      const group = tray[courseNum]
      if (group) cb(group)
    }
  }
}

export default new Courses()
