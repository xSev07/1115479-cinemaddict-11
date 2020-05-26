import {CommentMode} from "../const";

export default class CommentsModel {
  constructor(comments, onDataChange) {
    this._comments = comments;
    this._onDataChange = onDataChange;

    this._dataChangeHandlers = [];
  }

  getComment(id) {
    const index = this._comments.findIndex((it) => it.id === id);
    return this._comments[index];
  }

  removeComment(id) {
    const index = this._comments.findIndex((it) => it.id === id);

    if (index === -1) {
      throw new Error(`Comment not finding. id: ${id}`);
    }

    const deletedComment = this._comments[index];

    this._comments = [].concat(this._comments.slice(0, index), this._comments.slice(index + 1));
    this._onDataChange(deletedComment, undefined, CommentMode.DELETE);
  }

  addComment(comment) {
    this._comments = [].concat(comment, this._comments);
    this._callHandlers(this._dataChangeHandlers);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
