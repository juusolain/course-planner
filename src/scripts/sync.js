import main from '../main.js'

const googleConfig = {
  apiKey: process.env.VUE_APP_GOOGLE_API_KEY,
  clientId: process.env.VUE_APP_GOOGLE_CLIENTID,
  scope: 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.install',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
  ux_mode: 'redirect'
}

class SyncManager {
  constructor () {
    console.log('Start syncmanager')
    this.googleConfig = googleConfig
  }

  async enableSync () {
    if (main.$gapi.isSignedIn()) {
      this.syncing = true
    } else {
      this.syncing = false
    }
  }

  disableSync () {

  }

  async saveFile (fileName, data) {
    const gapi = await main.$gapi.getGapiClient()
    console.log(fileName)
    const fileMedia = {
      mimeType: 'application/json',
      body: JSON.stringify(data)
    }
    console.log(gapi.client.drive.files)
    const res = await gapi.client.drive.files.create({
      uploadType: 'multipart',
      mimeType: 'application/json',
      name: 'test-',
      parents: ['appDataFolder'],
      resource: fileMedia
    })
    console.log(res)
  }

  async getFiles () {
    const gapi = await main.$gapi.getGapiClient()
    const res = await gapi.client.drive.files.list({
      spaces: 'appDataFolder',
      fields: 'nextPageToken, files(id, name)',
      pageSize: 100
    })
    console.log(res)
    const result = res.result
    console.log(result)
  }
}

export default new SyncManager()
