import { createRxDatabase, addRxPlugin, removeRxDatabase } from 'rxdb'
import { groupSchema, subjectSchema } from './schemas'
import PouchAdapterMemory from 'pouchdb-adapter-memory'
import PouchAdapterIdb from 'pouchdb-adapter-idb'
addRxPlugin(PouchAdapterMemory)
addRxPlugin(PouchAdapterIdb)

async function loadDatabase () {
  performance.mark('database-load-start')
  var database = {}
  const db = await createRxDatabase({
    name: 'courseplannerdb',
    adapter: 'idb'
  })
  performance.measure('time to database creation', 'database-load-start')
  const subjects = await db.collection({
    name: 'subjects',
    schema: subjectSchema
  })
  const groups = await db.collection({
    name: 'groups',
    schema: groupSchema
  })
  performance.measure('time to collection creation', 'database-load-start')
  // Load DBs to memory
  database.groups = await groups.inMemory()
  database.subjects = await subjects.inMemory()
  performance.measure('time to inmemory', 'database-load-start')
  console.log(performance.getEntriesByType('measure'))

  return database
}

const databasePromise = loadDatabase()

export default databasePromise
