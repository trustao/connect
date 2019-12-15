const { JSDOM } = require("jsdom");
const jq = require('jquery')

class Parse {
  constructor () {

  }

  init (html, type = 'list') {
    const {window} = new JSDOM(html)
    this.window = window
    this.$ = jq(window)
    this.type = type
    return this
  }

  parseData () {
    switch (this.type) {
      case 'video':
        return {
          type: this.type,
          title: this.getPageTitle(),
          info: this.getDescription(),
          links: this.getList(),
          magnetic: this.getMagneticList(),
          others: this.getOthers()
        }
      case "list":
      default:
        return {
          type: this.type,
          title: this.getPageTitle(),
          links: this.getList(),
          others: this.getOthers()
        }
    }
  }

  getList() {
    const res = [], $ = this.$;
    $('.thumbnail').find('a').map((i, v) => {
      try {
        const $a = $(v)
        const url = $a.attr('href')
        const title = $a.text()
        const img = $a.find('img').attr('src')
        res.push({url, title, img})
      } catch (e) {
      }
    })
    return  res
  }

  getOthers () {
    const $ = this.$;
    const res = []
    $('.panel-heading>a:first-child').map((i, e) => {
      res.push({title:  $(e).text(), url: $(e).attr('href')})
    })
    return res
  }

  getDescription() {
    const $ = this.$
    const $info = $('.panel:first-child .panel-body')
    const imgUrl = $info.find('.col-md-3 img').attr('src')
    const infoArr = Array.from($info.find('.col-md-9').contents())
    return {
      cover_img: imgUrl,
      desc: this.getTags(infoArr),
      images: this.getDetailImages()
    }
  }

  getPageTitle () {
    return this.window.document.title
  }

  getDetailImages () {
    const res = []
    this.$('.col-md-3 .col-xs-12.col-md-12 img').map((i, img) => {
      const url = img.getAttribute('src')
      if (url) res.push(url)
    })
    return res
  }

  getTags(nodeList) {
    const res = {};
    let pointer = ''
    while (nodeList.length) {
      const node = nodeList.shift()
      switch (node.tagName) {
        case 'A':
          if (pointer && node.text) {
            res[pointer] = res[pointer] || []
            res[pointer].push({
              text: node.text.trim(),
              url: node.getAttribute('href')
            })
          }
          break;
        case 'B':
          pointer = node.textContent
          break;
        case 'BR':
          pointer = ''
          break;
      }
      if (node.nodeType === 3) {
        if (pointer && node.textContent.trim().length > 1) {
          res[pointer] = res[pointer] || []
          res[pointer].push({
            text: node.textContent.trim(),
            url: ''
          })
        }
      }
    }
    return Object.keys(res).map(key => ({title: key, data: res[key]}))
  }

  getMagneticList () {
    const res = []
    const $ = this.$
    $('.table:contains(磁力链)').find('tr:not(:first-child)').map((i, tr) => {
      const $tr = $(tr)
      const name = $tr.find('td:nth-child(1)').text()
      const size = $tr.find('td:nth-child(2)').text()
      const hot = $tr.find('td:nth-child(3)').text()
      const url = $tr.find('td:nth-child(4) a').attr('href')
      if (url) {
        res.push({name, size, hot, url})
      }
    })
    return res.sort((a, b) => parseFloat(b.size) - parseFloat(a.size))
  }
}

module.exports = {
  Parse,
  parse: function (html, type) {
    return JSON.stringify(new Parse().init(html, type).parseData())
  }
}