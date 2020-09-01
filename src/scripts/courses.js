import courseJSON from '../assets/courses.json'
import courseTrayJSON from '../assets/coursetray.json'

import Vue from 'vue'

import SyncManager from './sync.js'

class Courses {
  constructor () {
    this.allCourses = courseJSON
    this.originalTrays = courseTrayJSON

    // selected and completed courses by year - can be accessed with [n] or ['n']
    this.wantedCourses = JSON.parse(window.localStorage.getItem('wantedCourses')) || {
      0: [],
      1: [],
      2: [],
      3: []
    }
    this.wantedModifyTimestamp = window.localStorage.getItem('wantedCoursesTime') || 0
    this.hiddenCourseBaseKeys = JSON.parse(window.localStorage.getItem('hiddenCourseBaseKeys')) || []
    this.hiddenModifyTimestamp = window.localStorage.getItem('hiddenCourseBaseKeysTime') || 0
    this.currentYear = 1
    // group trays
    this.trays = {}
    // group selections
    this.selections = JSON.parse(window.localStorage.getItem('selections')) || {}
    this.selectionsModifyTimestamp = window.localStorage.getItem('selectionsTime') || 0
    if (SyncManager.syncing) {
      this.syncAll()
    }
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
          this.trays[trayNum][barNum].push({ selected: this.isGroupSelected(group), courseSelected: this.isCourseSelected(group.courseKey), areDependenciesMet: this.areCourseDependenciesMet(group.courseKey, group.tray, this.currentYear), ...group })
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

  getCourseData = courseKey => {
    try {
      const courseBaseKey = courseKey.match(/[A-Ö]{1,5}/)[0]
      const courseArray = this.allCourses[courseBaseKey]
      const courseData = courseArray.find(elem => elem.courseKey === courseKey)
      return courseData
    } catch (error) {
      console.error(error)
      return null
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
    if (this.getSelection(group.tray, group.bar) === null || allowOverlap) { // is some other course selected currently
      if (!this.isCourseWantedBeforeYear(group.courseKey, this.currentYear)) { // if course is not completed before
        return true
      }
    }
    return false
  }

  isCourseWantedBeforeYear = (courseKey, year) => {
    for (var i = 0; i < Number(year); i++) {
      if (this.isCourseWanted(courseKey, String(i))) {
        return true
      }
    }
    return false
  }

  getCourseDependencies = (courseKey, dependencyArray = []) => {
    const courseData = this.getCourseData(courseKey)
    if (courseData && courseData.after) {
      const afterKey = courseData.courseBaseKey + courseData.after
      dependencyArray.push(afterKey)
      return this.getCourseDependencies(afterKey, dependencyArray)
    } else {
      return dependencyArray
    }
  }

  areCourseDependenciesMet = (courseKey, tray, year = this.currentYear) => {
    const dependencies = this.getCourseDependencies(courseKey)
    let result = true
    if (!dependencies) return result
    dependencies.forEach(dependency => {
      if (!this.isCourseWantedBeforeYear(dependency, year)) {
        if (!this.isCourseSelected(dependency, tray)) {
          result = false
        }
      }
    })
    return result
  }

  isCourseWanted = (courseKey, wantedYear) => {
    if (wantedYear === undefined) {
      return this.getCourseWantedYear(courseKey) !== null
    } else {
      return this.getCourseWantedYear(courseKey) === wantedYear
    }
  }

  getCourseWantedYear = courseKey => {
    let result = null
    for (const year in this.wantedCourses) {
      const courses = this.wantedCourses[year]
      courses.forEach(course => {
        if (course === courseKey) {
          result = year
        }
      })
    }
    return result
  }

  addWantedCourse = (courseKey, year = this.currentYear) => {
    if (this.wantedCourses[year] === undefined) {
      Vue.set(this.wantedCourses, year, [])
    }
    Vue.set(this.wantedCourses[year], this.wantedCourses[year].length, courseKey)
    this.saveCourses(this.wantedCourses)
  }

  removeWantedCourse = courseKey => {
    for (const year in this.wantedCourses) {
      const courses = this.wantedCourses[year]
      courses.forEach((course, index, arr) => {
        if (course === courseKey) {
          arr.splice(index, 1)
        }
      })
      Vue.set(this.wantedCourses, year, courses)
    }
    this.saveCourses(this.wantedCourses)
  }

  getSelection = (tray, bar) => {
    this.selections[tray] = this.selections[tray] || {}
    this.selections[tray][bar] = this.selections[tray][bar] || null
    return this.selections[tray][bar]
  }

  // set null if set to none - returns oldselection coursekey if needed
  setSelection = (tray, bar, newGroup) => {
    var oldSelection = this.getSelection(tray, bar)
    this.selections[tray] = this.selections[tray] || {}

    if (oldSelection) {
      const oldIndex = this.trays[tray][bar].findIndex((elem) => elem.groupKey === oldSelection.groupKey)
      oldSelection.selected = false
      Vue.set(this.trays[tray][bar], oldIndex, oldSelection)
    }

    if (newGroup) {
      newGroup.selected = true
      const newIndex = this.trays[tray][bar].findIndex((elem) => elem.groupKey === newGroup.groupKey)
      Vue.set(this.trays[tray][bar], newIndex, newGroup)
    }

    Vue.set(this.selections[tray], bar, newGroup)

    if (oldSelection) {
      return oldSelection.courseKey
    }
  }

  selectGroup = group => {
    if (this.canSelect(group, true) !== 'notmet') { // allow selection even if completed before
      if (!this.isCourseWanted(group.courseKey)) {
        this.addWantedCourse(group.courseKey)
      }
      const returnedKey = this.setSelection(group.tray, group.bar, group)
      if (returnedKey) {
        this.setSelectedCoursesAndDependencies(returnedKey)
      }
      this.setSelectedCoursesAndDependencies(group.courseKey)
    }
  }

  removeGroup = group => {
    this.setSelection(group.tray, group.bar, null)
    this.setSelectedCoursesAndDependencies(group.courseKey)
  }

  isGroupSelected = group => {
    if (group.tray && group.bar && this.selections[group.tray] && this.selections[group.tray][group.bar]) {
      return this.selections[group.tray][group.bar].groupKey === group.groupKey
    }
    return false
  }

  isCourseSelected = (courseKey, before) => {
    let res = false
    loopSelections(this.selections, before, group => {
      if (group.courseKey === courseKey) res = true
    })
    return res
  }

  setSelectedCoursesAndDependencies = (courseKey) => {
    const newValue = this.isCourseSelected(courseKey)
    loopTrays(this.trays, (elem, index, arr) => {
      if (elem) {
        if (elem.courseKey === courseKey) {
          Vue.set(arr[index], 'courseSelected', newValue)
        }
        const courseBaseKey = courseKey.match(/[A-Ö]{1,5}/)[0]
        if (elem.courseBaseKey === courseBaseKey) {
          Vue.set(arr[index], 'areDependenciesMet', this.areCourseDependenciesMet(elem.courseKey, elem.tray, this.currentYear))
        }
      }
    })
    this.saveSelections(this.selections)
  }

  hideCourses = courseBaseKey => {
    Vue.set(this.hiddenCourseBaseKeys, this.hiddenCourseBaseKeys.length, courseBaseKey)
    this.saveHiddenCourses(this.hiddenCourseBaseKeys)
  }

  unHideCourses = courseBaseKey => {
    const index = this.hiddenCourseBaseKeys.indexOf(courseBaseKey)
    if (index !== -1) {
      this.hiddenCourseBaseKeys.splice(index, 1)
    }
    this.saveHiddenCourses(this.hiddenCourseBaseKeys)
  }

  saveCourses = (newCourses) => {
    this.wantedModifyTimestamp = Date.now()
    localStorage.setItem('wantedCourses', JSON.stringify(newCourses))
    localStorage.setItem('wantedCoursesTime', this.wantedModifyTimestamp)
    SyncManager.syncWanted(newCourses, this.wantedModifyTimestamp)
  }

  saveSelections = (newSelections) => {
    this.selectionsModifyTimestamp = Date.now()
    localStorage.setItem('selections', JSON.stringify(newSelections))
    localStorage.setItem('selectionsTime', this.selectionsModifyTimestamp)
    SyncManager.syncSelections(newSelections, this.selectionsModifyTimestamp)
  }

  saveHiddenCourses = (newHiddenCourses) => {
    localStorage.setItem('hiddenCourseBaseKeys', JSON.stringify(newHiddenCourses))
  }

  syncAll = async () => {
    this.selections = await SyncManager.syncSelections(this.selections, this.selectionsModifyTimestamp)
    this.wantedCourses = await SyncManager.syncWanted(this.wantedCourses, this.wantedModifyTimestamp)
    localStorage.setItem('wantedCourses', JSON.stringify(this.wantedCourses))
    localStorage.setItem('selections', JSON.stringify(this.selections))
  }
}

function loopTrays (trays, cb) {
  for (const trayNum in trays) {
    const tray = trays[trayNum]
    for (const barNum in tray) {
      var arr = trays[trayNum][barNum]
      arr.forEach(cb)
      Vue.set(trays[trayNum], barNum, arr)
    }
  }
}

function loopSelections (selections, before, cb) {
  for (const trayNum in selections) {
    if (trayNum === before) return
    const tray = selections[trayNum]
    for (const courseNum in tray) {
      const group = tray[courseNum]
      if (group) cb(group)
    }
  }
}

export default new Courses()
