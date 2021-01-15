const groupSchema = {
  version: 0,
  keyCompression: true,
  title: 'Group schema',
  type: 'object',
  properties: {
    courseKey: {
      type: 'string'
    },
    courseBaseKey: {
      type: 'string'
    },
    groupKey: {
      type: 'string',
      primary: true
    },
    courseNumber: {
      type: 'string'
    },
    bar: {
      type: 'string'
    },
    tray: {
      type: 'string'
    },
    teacher: {
      type: 'string'
    },
    selected: {
      type: 'boolean',
      default: false
    }
  },
  required: ['courseKey', 'courseBaseKey', 'groupKey', 'courseNumber', 'bar', 'tray'],
  indexes: ['groupKey', 'bar', 'tray', 'courseKey']
}

const subjectSchema = {
  version: 0,
  keyCompression: true,
  title: 'Subject schema',
  type: 'object',
  properties: {
    subjectKey: { // subject key like MAA for math
      type: 'string'
    },
    courses: { // array of courses of this subject
      type: 'array',
      items: {
        type: 'object',
        properties: {
          after: {
            type: 'string'
          },
          courseKey: {
            type: 'string',
            primary: true
          },
          courseNumber: {
            type: 'string'
          },
          courseType: {
            type: 'string'
          },
          selectionYear: {
            type: 'integer'
          },
          comment: {
            type: 'string'
          }
        }
      }
    }
  },
  required: ['subjectKey'],
  indexes: ['courses.[].courseKey', 'subjectKey']
}

export { groupSchema, subjectSchema }
