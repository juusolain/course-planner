class CoursesError extends Error {
  constructor (message, key) {
    super(message)
    this.key = key
  }
}

class QueryError extends CoursesError {
  constructor (message, key) {
    super(message, key)
    this.type = 'QueryError'
  }
}

export { QueryError }
