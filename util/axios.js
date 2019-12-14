const axios = require('axios')

const instance = axios.create({
  timeout: 30000,
  headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36'}
});


function request (url)　{
  return instance.get(url)
}

module.exports = {
  request
}