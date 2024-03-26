import { MongoDataSource } from "apollo-datasource-mongodb";

export default class Users extends MongoDataSource<any> {
  getUser(userId: string) {
    return this.findOneById(userId);
  }
}
