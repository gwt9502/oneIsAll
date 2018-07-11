import { observable, action, computed } from "mobx";
import API from '../../api'

class Home {
  @observable homeDataLists = [];
  @observable currentDate = 0;
  @observable weather = {}
  @observable dateLists = []

  @computed get currentFilterDate () {
    return this.currentDate == 0 ? 0 : this.currentDate.format('yyyy-MM-dd')
  }

  @computed get isToday () {
    return this.currentDate == new Date().format('yyyy-MM-dd')
  }

  @computed get date () {
    return this.currentDate == 0 ? new Date().format('yyyy-MM') : this.currentDate.format('yyyy-MM')
  }

  @action.bound
  getChannel = async () => {
    await API('get', `channel/one/${this.currentDate}/${encodeURI('上海')}`)
    .then(res => {
      this.weather = res.weather
      this.homeDataLists = res.content_list
      this.currentDate = res.date.substr(0, 10)
    })
  }

  @action.bound
  getDateLists = async () => {
    await API('get', `feeds/list/${this.date}`)
    .then(res => {
      this.dateLists = [...this.dateLists, ...res]
    })
  }

  @action.bound
  initData = () => {
    this.homeDataLists = []
  }
}

export default new Home()