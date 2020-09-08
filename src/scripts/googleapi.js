import axios from 'axios'
import SyncManager from './sync'

console.log(process.env)

const googleConfig = {
  auth: {
    client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID,
    client_secret: process.env.VUE_APP_GOOGLE_CLIENT_SECRET,
    scope: 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.install',
    ux_mode: 'popup'
  },
  drive: {
    api_key: process.env.VUE_APP_GOOGLE_API_KEY,
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
  }
}

class GoogleApi {
  constructor () {
    this.accessToken = localStorage.getItem('accessToken') || null
    this.tokenExpiration = localStorage.getItem('accessTokenExpiration') || null
    this.googleConfig = googleConfig
    this.refreshToken = localStorage.getItem('refreshToken') || null
  }

  init = async () => {
    const isAuthorized = await this.isAuthorized()
    if (!isAuthorized) {
      this.doRefreshToken()
    } else {
      clearTimeout(this.refreshTokenTimeout)
      var time = this.tokenExpiration - 5 * 60 * 1000
      if (time < Date.now()) {
        this.doRefreshToken()
      } else {
        this.refreshTokenTimeout = setTimeout(this.doRefreshToken, time) // add 5 minute buffer
      }
    }
  }

  logout = async () => {
    this.setRefreshToken(null)
    this.setAccessToken(null)
  }

  returnedCode = async code => {
    console.log(code)
    console.log('Apparently logged in')
    const res = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: this.googleConfig.auth.client_id,
      client_secret: this.googleConfig.auth.client_secret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.NODE_ENV === 'production' ? 'https://courses.jusola.xyz/' : 'http://localhost:8080/'
    })
    console.log(res)
    this.setAccessToken(res.data.access_token, Date.now() + res.data.expires_in)
    this.setRefreshToken(res.data.refresh_token)
  }

  setRefreshToken = refreshToken => {
    this.refreshToken = refreshToken
    localStorage.setItem('refreshToken', this.refreshToken)
  }

  setAccessToken = (accessToken, expiration) => {
    this.accessToken = accessToken
    localStorage.setItem('accessToken', accessToken)
    clearTimeout(this.refreshTokenTimeout)
    if (accessToken === null) return
    this.tokenExpiration = expiration
    localStorage.setItem('accessTokenExpiration', expiration)
    this.refreshTokenTimeout = setTimeout(this.doRefreshToken, expiration - 5 * 60 * 1000) // add 5 minute buffer
  }

  doRefreshToken = async () => {
    // refresh token
    try {
      const res = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: this.googleConfig.auth.client_id,
        client_secret: this.googleConfig.auth.client_secret,
        refresh_token: this.refreshToken,
        grant_type: 'refresh_token'
      })
      console.log(res)
      this.setAccessToken(res.data.access_token, Date.now() + res.data.expires_in)
      return true
    } catch (error) {
      console.error('Error while refreshing token', error)
      SyncManager.disableSync()
      return false
    }
  }

  isAuthorized = async () => {
    try {
      if (!this.getAccessToken()) throw new Error('didn\'t get accesstoken')
      const res = await axios.get('https://www.googleapis.com/drive/v3/files', {
        params: {
          spaces: 'appDataFolder'
        },
        headers: {
          Authorization: `Bearer ${await this.getAccessToken()}`
        }
      })
      console.log('authorized')
      return true
    } catch (error) {
      if (error.response.status === 401) {
        console.log('Unauthorized')
        const isSuccess = await this.doRefreshToken()
        return isSuccess
      } else {
        console.log(error)
        return false
      }
    }
  }

  doAuthorize = async () => {
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth'
    var form = document.createElement('form')
    form.setAttribute('method', 'GET') // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint)

    // Parameters to pass to OAuth 2.0 endpoint.
    var params = {
      client_id: this.googleConfig.auth.client_id,
      redirect_uri: process.env.NODE_ENV === 'production' ? 'https://courses.jusola.xyz/' : 'http://localhost:8080/',
      response_type: 'code',
      access_type: 'offline',
      scope: this.googleConfig.auth.scope,
      include_granted_scopes: 'true',
      state: 'return_from_google' // hack to go back to settings
    }

    // use form as
    for (var p in params) {
      var input = document.createElement('input')
      input.setAttribute('type', 'hidden')
      input.setAttribute('name', p)
      input.setAttribute('value', params[p])
      form.appendChild(input)
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form)
    form.submit()
  }

  getAccessToken = async () => {
    if (!this.accessToken || Date.now() > this.accessTokenExpiration) {
      await this.doRefreshToken()
    }
    return this.accessToken
  }

  getFile = async (fileMeta) => {
    if (fileMeta === null) return null
    const res = await axios.get(`https://www.googleapis.com/drive/v3/files/${fileMeta.id}`, {
      params: {
        alt: 'media'
      },
      headers: {
        Authorization: `Bearer ${await this.getAccessToken()}`
      }
    })
    console.log(res)
    return res.data
  }

  getFileMeta = async (filename) => {
    const res = await axios.get('https://www.googleapis.com/drive/v3/files', {
      params: {
        q: `trashed=false and name='${filename}'`,
        fields: 'files(id, name, modifiedTime)'
      },
      headers: {
        Authorization: `Bearer ${await this.getAccessToken()}`
      }
    })
    const result = res.data
    if (result.files.length > 0) {
      return result.files[0]
    } else {
      return null
    }
  }

  updateFile = async (fileId, data) => {
    const res = await axios.patch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}`, data,
      {
        params: { uploadType: 'media' },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.getAccessToken()}`
        }
      })
    return res
  }

  createFile = async (fileName, data) => {
    const fileMeta = {
      mimeType: 'application/json',
      name: fileName
    }
    const contentType = 'application/json'
    const boundary = 'ADBWON2242nfDjna2d!ds'

    const delimiter = '\r\n--' + boundary + '\r\n'
    const closeDelim = '\r\n--' + boundary + '--'
    var multipartRequestBody = delimiter + 'Content-Type: application/json; charset=UTF-8\r\n\r\n' + JSON.stringify(fileMeta) + delimiter + 'Content-Type: ' + contentType + '\r\n\r\n' + JSON.stringify(data) + '\r\n' + closeDelim
    const res = await axios.post('https://www.googleapis.com/upload/drive/v3/files', multipartRequestBody,
      {
        params: { uploadType: 'multipart' },
        headers: {
          'Content-Type': 'multipart/related; boundary=' + boundary + '',
          Authorization: `Bearer ${await this.getAccessToken()}`
        }
      })
    return res
  }
}

export default new GoogleApi()
