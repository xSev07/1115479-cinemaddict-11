export default class CommentModel {
  constructor(data) {
    this.id = data[`id`];
    this.text = data[`comment`];
    this.emoji = data[`emotion`];
    this.author = data[`author`];
    this.date = new Date(data[`date`]);
  }

  toRaw() {
    return {
      "id": this.id,
      "comment": this.text,
      "date": this.date.toISOString(),
      "emotion": this.emoji,
      "author": this.author
    };
  }

  static parseComment(data) {
    return new CommentModel(data);
  }

  static parseComments(data) {
    return data.map(CommentModel.parseComment);
  }

  static clone(data) {
    return new CommentModel(data.toRaw());
  }
}
