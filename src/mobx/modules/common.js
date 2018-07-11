import { observable, action } from "mobx";

class Common {
  @observable message = '';
  @observable loading = false;

  @action.bound
  toggleLoading = () => {
    this.loading = !this.loading
  }
}

export default new Common()