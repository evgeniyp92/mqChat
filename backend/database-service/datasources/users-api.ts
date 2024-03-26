import { User as UserModel } from "../mongomodels/User";
import type { User } from "../__generated__/graphql";

export class UsersAPI {
  async createUser(username: string): Promise<User> {
    const user = await UserModel.create({ username: username });
    return { username: user.username, id: user.id };
  }

  async findById(username: string) {
    return {};
  }
}
