import main from '../main.js'

const googleConfig = {
  apiKey: process.env.VUE_APP_GOOGLE_API_KEY,
  clientId: process.env.VUE_APP_GOOGLE_CLIENTID,
  scope: 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.install',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
  ux_mode: 'popup'
}

class SyncManager {
  constructor () {
    console.log('Start syncmanager')
    this.googleConfig = googleConfig
    this.syncing = window.localStorage.getItem('syncEnabled') || false
  }

  async enableSync () {
    if (await main.$gapi.isSignedIn()) {
      console.log('sync enabled')
    } else {
      this.syncing = false
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
    const fileMeta = await this.getFileMeta(fileName)
    const fileData = await this.getFile(fileName, fileMeta)
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
      updateFile(fileMeta.id, data)
    } else {
      createFile(fileName, data)
    }
  }

  async getFile (filename, fileMeta) {
    if (fileMeta === null) return null
    const gapi = await main.$gapi.getGapiClient()
    const res = await gapi.client.drive.files.get({
      fileId: fileMeta.id,
      alt: 'media'
    })
    return res.result
  }

  async getFileMeta (filename) {
    const gapi = await main.$gapi.getGapiClient()
    console.log('gapi gotten')
    const res = await gapi.client.drive.files.list({
      // spaces: 'appDataFolder',
      q: `trashed=false and name='${filename}'`,
      fields: 'files(id, name, modifiedTime)'
    })
    const result = res.result
    if (result.files.length > 0) {
      return result.files[0]
    } else {
      return null
    }
  }
}

async function updateFile (fileId, data) {
  const gapi = await main.$gapi.getGapiClient()
  const res = await gapi.client.request({
    path: `https://www.googleapis.com/upload/drive/v3/files/${fileId}`,
    method: 'PATCH',
    params: { uploadType: 'media' },
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  return res
}

async function createFile (fileName, data) {
  const gapi = await main.$gapi.getGapiClient()
  const fileMeta = {
    mimeType: 'application/json',
    name: fileName
  }
  const contentType = 'application/json'
  const boundary = 'ADBWON2242nfDjna2d!ds'

  const delimiter = '\r\n--' + boundary + '\r\n'
  const closeDelim = '\r\n--' + boundary + '--'
  var multipartRequestBody = delimiter + 'Content-Type: application/json; charset=UTF-8\r\n\r\n' + JSON.stringify(fileMeta) + delimiter + 'Content-Type: ' + contentType + '\r\n\r\n' + JSON.stringify(data) + '\r\n' + closeDelim
  const res = await gapi.client.request({
    path: 'https://www.googleapis.com/upload/drive/v3/files',
    method: 'POST',
    params: { uploadType: 'multipart' },
    headers: {
      'Content-Type': 'multipart/related; boundary=' + boundary + ''
    },
    body: multipartRequestBody
  })
  return res
}

export default new SyncManager()
