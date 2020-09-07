import GoogleApi from './googleapi'

class SyncManager {
  constructor () {
    console.log('Start syncmanager')
    this.syncing = Boolean(window.localStorage.getItem('syncEnabled')) || false
  }

  async enableSync () {
    if (await GoogleApi.isAuthorized()) {
      console.log('sync enabled')
      this.syncing = true
    } else {
      this.syncing = false
      throw new Error('Not authorized to enable sync')
    }
    window.localStorage.setItem('syncEnabled', this.syncing)
  }

  disableSync () {
    this.syncing = false
    window.localStorage.setItem('syncEnabled', this.syncing)
  }

  async syncSelections (localData, localTimestamp) {
    return this.sync(localData, localTimestamp, 'selections.json')
  }

  async syncHidden (localData, localTimestamp) {
    return this.sync(localData, localTimestamp, 'hidden.json')
  }

  async syncWanted (localData, localTimestamp) {
    return this.sync(localData, localTimestamp, 'wanted.json')
  }

  async sync (localData, localTimestamp, fileName) {
    const fileMeta = await GoogleApi.getFileMeta(fileName)
    const fileData = await GoogleApi.getFile(fileMeta)
    var remoteTimestamp = 0
    if (fileMeta !== null) {
      remoteTimestamp = Date.parse(fileMeta.modifiedTime)
    }

    const remoteData = fileData

    const newData = this.merge(localData, localTimestamp, remoteData, remoteTimestamp)

    await this.saveFile(fileName, newData, fileMeta)
    console.log('returning: ', newData)
    return newData
  }

  merge (localData, localTimestamp, remoteData, remoteTimestamp = 0) {
    console.log(localTimestamp, remoteTimestamp)
    if (localTimestamp >= remoteTimestamp) {
      console.log('selecting local data')
      return localData
    } else {
      console.log('selecting remote data')
      return remoteData
    }
  }

  async saveFile (fileName, data, fileMeta) {
    if (fileMeta !== null) {
      GoogleApi.updateFile(fileMeta.id, data)
    } else {
      GoogleApi.createFile(fileName, data)
    }
  }
}

export default new SyncManager()
