const { ObjectId } = require('mongoose').Types;
const UserModel = require('../models/UserModel');

class UserService {
  // eslint-disable-next-line class-methods-use-this
  async register(name, email, password) {
    if (await this.checkIfEmailExist(email)) {
      throw new Error(`User with the email: ${email}, already exist`);
    }
    const user = new UserModel({ name, email, password, roles: ['USER'] });
    return user.save();
  }

  // eslint-disable-next-line class-methods-use-this
  async create(name, email, password, roles) {
    if (await this.checkIfEmailExist(email)) {
      throw new Error(`User with the email: ${email}, already exist`);
    }
    const user = new UserModel({ name, email, password, roles });
    return user.save();
  }

  // eslint-disable-next-line class-methods-use-this
  async updateByAdmin(id, name, email, roles) {
    if (await this.checkIfEmailExistButNotId(email, id)) {
      throw new Error(`User with the email: ${email}, already exist`);
    }
    const user = await UserModel.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    user.name = name;
    user.email = email;
    user.roles = roles;

    return user.save();
  }

  // eslint-disable-next-line class-methods-use-this
  async update(id, name, email, bio, avatar) {
    if (await this.checkIfEmailExistButNotId(email, id)) {
      throw new Error(`User with the email: ${email}, already exist`);
    }
    const user = await UserModel.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    user.name = name;
    user.email = email;
    user.bio = bio;
    user.avatar = avatar;

    return user.save();
  }

  // eslint-disable-next-line class-methods-use-this
  async findAll() {
    const result = await UserModel.find({}).exec();
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async findOne(id) {
    const result = await UserModel.findById({ _id: ObjectId(id) }).exec();
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteOne(id) {
    const deleted = await UserModel.deleteOne({ _id: ObjectId(id) }).exec();
    return deleted;
  }

  // eslint-disable-next-line class-methods-use-this
  async checkIfEmailExist(email) {
    const query = UserModel.count({ email });
    const count = await query.exec();
    return count > 0;
  }

  // eslint-disable-next-line class-methods-use-this
  async checkIfEmailExistButNotId(email, id) {
    const query = UserModel.count({ email, _id: { $ne: ObjectId(id) } });
    const count = await query.exec();
    return count > 0;
  }
}

module.exports = UserService;
