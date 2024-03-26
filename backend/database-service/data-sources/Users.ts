import { MongoDataSource } from "apollo-datasource-mongodb";
import { ObjectId } from "mongodb";

interface UserDocument {
  _id: ObjectId;
  username: string;
}

export default class Users extends MongoDataSource<UserDocument> {
  getUser(userId: string) {
    return this.findOneById(userId);
  }
}
