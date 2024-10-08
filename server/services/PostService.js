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
    hide,
    categories,
    tags
  ) {
    const slug = title.replace(/[^A-Z0-9]+/gi, '-').toLowerCase();

    if (await this.checkIfTitleExist(slug.trim())) {
      throw new Error(`Post with similar title: ${title}, already exist`);
    }

    let published;
    let publishedDate;

    if (publish) {
      published = true;
      publishedDate = Date.now();
    }

    const model = new PostModel({
      title,
      slug,
      subtitle,
      body,
      author,
      featureImage,
      featureImageCaption,
      published,
      hidden: hide,
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
    editor,
    featureImage,
    featureImageCaption,
    publish,
    hide,
    categories,
    tags
  ) {
    const slug = title.replace(/[^A-Z0-9]+/gi, '-').toLowerCase();

    if (await this.checkIfTitleExistButNotId(slug.trim(), id)) {
      throw new Error(`Post with similar title: ${title}, already exist`);
    }

    const post = await PostModel.findById(id);
    if (!post) {
      throw new Error('Post not found');
    }

    if (!post.publish && publish) {
      post.published = true;
      post.publishedDate = Date.now();
    }

    if (featureImage) {
      post.featureImage = featureImage;
    }

    post.title = title;
    post.slug = slug;
    post.subtitle = subtitle;
    post.body = body;
    post.editor = editor;
    post.hidden = hide;
    post.categories = categories;
    post.featureImageCaption = featureImageCaption;
    post.tags = tags;

    return post.save();
  }

  // eslint-disable-next-line class-methods-use-this
  async findAll() {
    const result = await PostModel.find({ published: true, hidden: { $ne: true } })
      .sort({ createdAt: 1 })
      .exec();
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async findAllAdmin() {
    const result = await PostModel.find({}).sort({ createdAt: 1 }).exec();
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async findTop(top) {
    const result = await PostModel.find({ published: true, hidden: { $ne: true } })
      .sort({ createdAt: 1 })
      .limit(top)
      .exec();
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async findAllByCategory(category) {
    const result = await PostModel.find({
      published: true,
      hidden: { $ne: true },
      categories: { $in: [category] },
    })
      .sort({ createdAt: 1 })
      .exec();
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async findOne(id) {
    const result = await PostModel.findById({ _id: ObjectId(id) }).exec();
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async findOneBySlug(slug) {
    const result = await PostModel.findOne({ published: true, hidden: { $ne: true }, slug }).exec();
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async findOneBySlugAdmin(slug) {
    const result = await PostModel.findOne({ slug }).exec();
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteOne(id) {
    const deleted = await PostModel.deleteOne({ _id: ObjectId(id) }).exec();
    return deleted;
  }

  // eslint-disable-next-line class-methods-use-this
  async checkIfTitleExist(slug) {
    const query = PostModel.count({ slug });
    const count = await query.exec();
    return count > 0;
  }

  // eslint-disable-next-line class-methods-use-this
  async checkIfTitleExistButNotId(slug, id) {
    const query = PostModel.count({ slug, _id: { $ne: ObjectId(id) } });
    const count = await query.exec();
    return count > 0;
  }
}

module.exports = PostService;
