import { jsPDF as JsPDF } from 'jspdf'
import CourseManager from './courses.js'

class Exporter {
    exportPDF = (year = CourseManager.currentYear) => {
      const selections = CourseManager.selections
      const doc = new JsPDF({
        orientation: 'landscape',
        unit: 'mm'
      })
      var writtenbars = []
      var x = 40
      const xDiff = 50
      var y = 10
      const yDiff = 10
      for (const trayNum in selections) {
        const tray = selections[trayNum]
        y = 10
        doc.text(trayNum, x, y)
        for (const barNum in tray) {
          y += yDiff
          if (!writtenbars.includes(barNum)) {
            doc.text(barNum, 10, y)
            writtenbars.push(barNum)
          }
          const group = tray[barNum]
          var text = ''
          if (group !== null) text = group.groupKey
          doc.text(text, x, y)
          console.log(group)
        }
        x += xDiff
      }
      doc.save('selections.pdf')
    }
}

export default new Exporter()
