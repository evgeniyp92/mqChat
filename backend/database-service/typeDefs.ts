import gql from "graphql-tag";

const typeDefs = gql(`
	type Query {
		user: String
	}
`);

export default typeDefs;
