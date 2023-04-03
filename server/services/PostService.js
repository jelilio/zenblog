const { ObjectId } = require('mongoose').Types;
const PostModel = require('../models/PostModel');

class PostService {
  // eslint-disable-next-line class-methods-use-this
  async create(
    title,
    subtitle,
    body,
    author,
    featureImage,
    featureImageCaption,
    publish,
    categories,
    tags
  ) {
    if (await this.checkIfTitleExist(title.trim())) {
      throw new Error(`Post with similar title: ${title}, already exist`);
    }

    let published;
    let publishedDate;

    if (publish) {
      published = true;
      publishedDate = Date.now;
    }

    const slug = title.trim().replace(/\s+/g, '-').toLowerCase();

    const model = new PostModel({
      title,
      slug,
      subtitle,
      body,
      author,
      featureImage,
      featureImageCaption,
      published,
      publishedDate,
      categories,
      tags,
    });
    return model.save();
  }

  // eslint-disable-next-line class-methods-use-this
  async update(
    id,
    title,
    subtitle,
    body,
    author,
    featureImage,
    featureImageCaption,
    publish,
    categories,
    tags
  ) {
    if (await this.checkIfTitleExistButNotId(title, id)) {
      throw new Error(`Post with similar title: ${title}, already exist`);
    }

    const post = await PostModel.findById(id);
    if (!post) {
      throw new Error('Post not found');
    }

    if (!post.publish && publish) {
      post.published = true;
      post.publishedDate = Date.now;
    }

    if (featureImage) {
      post.featureImage = featureImage;
    }

    const slug = title.replace(/\s+/g, '-').toLowerCase();

    post.title = title;
    post.slug = slug;
    post.subtitle = subtitle;
    post.body = body;
    post.author = author;
    post.categories = categories;
    post.featureImageCaption = featureImageCaption;
    post.tags = tags;

    return post.save();
  }

  // eslint-disable-next-line class-methods-use-this
  async findAll() {
    const result = await PostModel.find({}).exec();
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async findOne(id) {
    const result = await PostModel.findById({ _id: ObjectId(id) }).exec();
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteOne(id) {
    const deleted = await PostModel.deleteOne({ _id: ObjectId(id) }).exec();
    return deleted;
  }

  // eslint-disable-next-line class-methods-use-this
  async checkIfTitleExist(title) {
    const query = PostModel.count({ title });
    const count = await query.exec();
    return count > 0;
  }

  // eslint-disable-next-line class-methods-use-this
  async checkIfTitleExistButNotId(title, id) {
    const query = PostModel.count({ title, _id: { $ne: ObjectId(id) } });
    const count = await query.exec();
    return count > 0;
  }
}

module.exports = PostService;
