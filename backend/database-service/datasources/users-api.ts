import { UserModel } from "../mongomodels/User";
import { MongoDataSource } from "apollo-datasource-mongodb";
import { ObjectId } from "mongodb";

interface UserDocument {
  _id?: ObjectId;
  username: string;
}

export class UsersAPI {
  createUser(username: string) {
    console.log("hello from the fully integrated users api");
    return { username: "honk" };
  }
}
