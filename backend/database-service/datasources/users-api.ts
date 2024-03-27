import { User as UserModel } from "../mongomodels/User";
import type { User } from "../__generated__/graphql";

export class UsersAPI {
  async createUser(username: string): Promise<User> {
    const user = await UserModel.create({ username: username });
    return { username: user.username, id: user.id };
  }

  async getAllUsers(): Promise<User[]> {
    const users = await UserModel.find();
    return users.map((user) => ({ username: user.username, id: user.id }));
  }

  async findByName(username: string): Promise<User | null> {
    const user = await UserModel.findOne({ username: username });
    if (user) {
      return { username: user.username, id: user.id };
    }
    return null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    if (user) {
      return { username: user.username, id: user.id };
    }
    return null;
  }
}
