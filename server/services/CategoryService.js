const { ObjectId } = require('mongoose').Types;
const CategoryModel = require('../models/CategoryModel');

class PostService {
  async create(name, description) {
    if (await this.checkIfNameExist(name)) {
      throw new Error(`Category with similar name: ${name}, already exist`);
    }

    const model = new CategoryModel({
      name,
      description,
    });
    return model.save();
  }

  async update(id, name, description) {
    if (await this.checkIfNameExistButNotId(name, id)) {
      throw new Error(`Category with similar name: ${name}, already exist`);
    }
    const category = await CategoryModel.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }

    category.name = name;
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
  async checkIfNameExist(name) {
    const query = CategoryModel.count({ name });
    const count = await query.exec();
    return count > 0;
  }

  // eslint-disable-next-line class-methods-use-this
  async checkIfNameExistButNotId(name, id) {
    const query = CategoryModel.count({ name, _id: { $ne: ObjectId(id) } });
    const count = await query.exec();
    return count > 0;
  }
}

module.exports = PostService;
