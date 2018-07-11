import { observable, action } from "mobx";
import API from '../../api'

class KindDetail {
  @observable detail = {}

  @action.bound
  getKindDetail = async (type) => {
    await API('get', `all/list/${type}`)
    .then(res => {
      res.html_content = res.html_content.replace(/openRelateDetail\(article\)/g, 'window.postMessage(JSON.stringify(article))')
      this.detail = res
    })
  }
}

export default new KindDetail()