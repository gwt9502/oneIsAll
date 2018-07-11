import { observable, action } from "mobx";
import API from '../../api'

class BookDetail {
  @observable bookDetail = {}
  @observable isEmptyLoading = false // 数据是否请求完
  @observable commentListIds = [] // 评论id
  @observable commentLists = [] // 评论列表

  /**
   * type
   * 0 图文
   * 1 阅读
   * 2 连载
   * 3 问答
   * 4 音乐
   * 5 影视
   * 6
   * 7
   * 8 电台
   * 9 专题
   */
  @action.bound
  getHtmlContent = async (item_id, type) => {
    const typeUrl = ['', 'essay', 'serialcontent', 'question', 'music', 'movie', '', '', 'radio', 'topic']
    await API('get', `${typeUrl[type]}/htmlcontent/${item_id}`)
    .then(res => {
      console.log(res)
      res.html_content = res.html_content.replace(/openRelate\(article\)/g, 'window.postMessage(JSON.stringify(article))')
      this.bookDetail = res
    })
  }

  @action.bound
  getCommentLists = async (item_id, type) => {
    const typeUrl = ['', 'essay', 'serialcontent', 'question', 'music', 'movie', '', '', 'radio', 'topic']
    await API('get', `comment/praiseandtime/${typeUrl[type]}/${item_id}/${this.commentLists.length ? this.commentLists[this.commentLists.length - 1].id : 0}`)
    .then(res => {
      res.data.map(item => {
        item.showToggle = item.content.length > 110
      })
      if (res.data.length < 20) {
        this.isEmptyLoading = true
      }
      let filterData = res.data.reduce((item, next) => {
        if (next.id && this.commentListIds.indexOf(next.id) == -1) {
          this.commentListIds.push(next.id)
          item.push(next)
        }
        return item
      }, this.commentLists)
    })
  }

  @action.bound
  init () {
    this.commentLists = []
    this.isEmptyLoading = false
  }
}

export default new BookDetail()