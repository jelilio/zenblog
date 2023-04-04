const { ObjectId } = require('mongoose').Types;
const CategoryModel = require('../models/CategoryModel');

class PostService {
  async create(name, description) {
    const slug = name
      .trim()
      .replace(/[^A-Z0-9]+/gi, '-')
      .toLowerCase();

    if (await this.checkIfNameExist(slug)) {
      throw new Error(`Category with similar name: ${name}, already exist`);
    }

    const model = new CategoryModel({
      name,
      slug,
      description,
    });
    return model.save();
  }

  async update(id, name, description) {
    const slug = name
      .trim()
      .replace(/[^A-Z0-9]+/gi, '-')
      .toLowerCase();

    if (await this.checkIfNameExistButNotId(slug, id)) {
      throw new Error(`Category with similar name: ${name}, already exist`);
    }
    const category = await CategoryModel.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }

    category.name = name;
    category.slug = slug;
    category.description = description;

    return category.save();
  }

  // eslint-disable-next-line class-methods-use-this
  async findAll() {
    const result = await CategoryModel.find({}).exec();
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async findOne(id) {
    const result = await CategoryModel.findById({ _id: ObjectId(id) }).exec();
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteOne(id) {
    const deleted = await CategoryModel.deleteOne({ _id: ObjectId(id) }).exec();
    return deleted;
  }

  // eslint-disable-next-line class-methods-use-this
  async checkIfNameExist(slug) {
    const query = CategoryModel.count({ slug });
    const count = await query.exec();
    return count > 0;
  }

  // eslint-disable-next-line class-methods-use-this
  async checkIfNameExistButNotId(slug, id) {
    const query = CategoryModel.count({ slug, _id: { $ne: ObjectId(id) } });
    const count = await query.exec();
    return count > 0;
  }
}

module.exports = PostService;
