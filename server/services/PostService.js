const { ObjectId } = require('mongoose').Types;
const PostModel = require('../models/PostModel');

class PostService {
  // eslint-disable-next-line class-methods-use-this
  async create(title, subtitle, body, author, featureImage, publish) {
    if (await this.checkIfTitleExist(title)) {
      throw new Error(`Post with similar title: ${title}, already exist`);
    }

    let published;
    let publishedDate;

    if (publish) {
      published = true;
      publishedDate = Date.now;
    }

    const model = new PostModel({
      title,
      subtitle,
      body,
      author,
      featureImage,
      published,
      publishedDate,
    });
    return model.save();
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
