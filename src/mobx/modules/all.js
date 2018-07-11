import { observable, action } from "mobx";
import API from '../../api';

class All {
  @observable bannerLists = []; // 轮播图
  @observable specialLists = []; // 专题列表
  @observable isEnd = false

  @action.bound
  getSpecialLists = async () => {
    await API('get', `banner/list/4?last_id=${this.specialLists.length > 0 ? this.specialLists[this.specialLists.length - 1].id : 0}`)
    .then(res => {
      if (res.length < 5) {
        this.isEnd = true
      }
      this.specialLists = [...this.specialLists, ...res]
    })
  }

  @action.bound
  getBannerLists = async () => {
    await API('get', 'banner/list/3')
    .then(res => {
      console.log(res)
      this.bannerLists = res
    })
  }

  @action.bound
  initAllData () {
    this.specialLists = []
    this.isEnd = false
  }
}

export default new All()