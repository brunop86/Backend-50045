import UserModel from "../models/users.model.js";

class UserRepository {
  async findByEmail(email) {
    return UserModel.findOne({ email });
  }
}

export default UserRepository;
