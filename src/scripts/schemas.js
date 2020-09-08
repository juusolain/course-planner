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
      type: 'string'
    },
    courseNumber: {
      type: 'integer'
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
      type: 'boolean'
    }
  },
  required: ['courseKey', 'courseBaseKey', 'groupKey', 'courseNumber', 'bar', 'tray']
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
      type: 'string'
    },
    courseBaseKey: {
      type: 'string'
    },
    courseNumber: {
      type: 'integer'
    },
    courseType: {
      type: 'string'
    },
    wanted: {
      type: 'boolean'
    }
  },
  required: ['courseKey', 'courseBaseKey', 'courseNumber', 'courseType']
}

export { groupSchema, courseSchema }
