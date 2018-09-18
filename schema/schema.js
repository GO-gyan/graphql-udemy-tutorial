import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema
} from 'graphql';
import _ from 'lodash';


const users= [
    { id: '1', firstName: 'Shams', age: 34 },
    { id: '2', firstName: 'John', age: 49 }
]
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt }
    }
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve: (parentValue, args) => {
                return _.find(users, { id: args.id });
            }
        }
    }
});

export default new GraphQLSchema({
    query: RootQuery
});