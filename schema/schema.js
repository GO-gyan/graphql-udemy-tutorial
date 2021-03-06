import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} from 'graphql';
import axios from 'axios';

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            resolve: (root, args) => {
                return axios.get(`http://localhost:3000/companies/${root.id}/users`)
                    .then(res => res.data);
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve: (root, args) => {
                return axios.get(`http://localhost:3000/companies/${root.companyId}`)
                    .then(res => res.data);
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve: (parentValue, args) => {
                return axios.get(`http://localhost:3000/users/${args.id}`)
                    .then(resp => resp.data);
            }
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString } },
            resolve: (root, args) => {
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                    .then(res => res.data);
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                companyId: { type: GraphQLString }
            },
            resolve: (root, { firstName, age }) => {
                return axios.post('http://localhost:3000/users', { firstName, age })
                    .then(res => res.data);
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (root, { id }) => {
                return axios.delete(`http://localhost:3000/users/${id}`)
                    .then(res => res.data);
            }
        },
        editUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                firstName: { type: GraphQLString },
                age: { type: GraphQLInt },
                companyId: { type: GraphQLString }
            },
            resolve: (root, args) => {
                return axios.patch(`http://localhost:3000/users/${args.id}`, args)
                    .then(res => res.data);
            }
        }
    }
})
export default new GraphQLSchema({
    query: RootQuery,
    mutation
});