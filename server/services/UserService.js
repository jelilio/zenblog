const UserModel = require('../models/UserModel');

class UserService {
  // eslint-disable-next-line class-methods-use-this
  async register(name, email, password) {
    if (await this.checkIfEmailExist(email)) {
      throw new Error(`User with the email: ${email}, already exist`);
    }
    const user = new UserModel({ name, email, password });
    return user.save();
  }

  // eslint-disable-next-line class-methods-use-this
  async checkIfEmailExist(email) {
    const query = UserModel.count({ email });
    const count = await query.exec();
    return count > 0;
  }
}

module.exports = UserService;
