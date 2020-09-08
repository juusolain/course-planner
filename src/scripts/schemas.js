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
  indexes: ['groupKey']
}

const courseSchema = {
  version: 0,
  keyCompression: true,
  title: 'Group schema',
  type: 'object',
  properties: {
    after: {
      type: 'string'
    },
    courseKey: {
      type: 'string',
      primary: true
    },
    courseBaseKey: {
      type: 'string'
    },
    courseNumber: {
      type: 'string'
    },
    courseType: {
      type: 'string'
    },
    wanted: {
      type: 'boolean',
      default: false
    },
    comment: {
      type: 'string'
    }
  },
  required: ['courseKey', 'courseBaseKey', 'courseNumber', 'courseType'],
  indexes: ['courseKey']
}

export { groupSchema, courseSchema }
