export default class CommentsModel {
  constructor(comments) {
    this._comments = comments;

    this._dataChangeHandlers = [];
  }

  setComments(comments) {
    this._comments = comments;
  }

  getComment(id) {
    const index = this._comments.findIndex((it) => it.id === id);
    return this._comments[index];
  }
}
