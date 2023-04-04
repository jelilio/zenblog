const { ObjectId } = require('mongoose').Types;
const CommentModel = require('../models/CommentModel');

class PostService {
  // eslint-disable-next-line class-methods-use-this
  async create(message, author, postId) {
    const model = new CommentModel({
      message,
      author,
      postId,
    });
    return model.save();
  }

  // eslint-disable-next-line class-methods-use-this
  async update(id, message, author, postId) {
    const comment = await CommentModel.findById(id);
    if (!comment) {
      throw new Error('Comment not found');
    }

    comment.message = message;
    comment.author = author;
    comment.postId = postId;

    return comment.save();
  }

  // eslint-disable-next-line class-methods-use-this
  async findAll() {
    const result = await CommentModel.find({}).exec();
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async findAllByPost(postId) {
    const result = await CommentModel.find({ postId }).exec();
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async findOne(id) {
    const result = await CommentModel.findById({ _id: ObjectId(id) }).exec();
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteOne(id) {
    const deleted = await CommentModel.deleteOne({ _id: ObjectId(id) }).exec();
    return deleted;
  }
}

module.exports = PostService;
