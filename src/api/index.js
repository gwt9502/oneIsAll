import axios from 'axios'

const Axios = axios.create({
  baseURL: 'http://v3.wufazhuce.com:8000/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

const API = (method, url, options = {}) => {
  return new Promise((resolve, reject) => {
    const config = {
      method: method,
      url: url,
      ...options
    }
    Axios(config)
    .then(res => {
      if (res.data.res == 0) {
        resolve(res.data.data)
        return
      }
      if (res.data.category >= 0) {
        resolve(res.data)
        return
      }
      reject(res)
      // res.data.res == 0 ? resolve(res.data.data) : reject(res)
    })
    .catch(err => {
      reject(err)
      console.log('网络出现小差')
    })
  })
}

export default API