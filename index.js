const {ApolloServer, PubSub} = require('apollo-server');
const mongoose = require('mongoose');

const { MONGODB } = require('./config');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const PORT = process.env.PORT || 5000;

const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({req, pubsub})
});

mongoose.connect( MONGODB, {
    useNewUrlParser: true ,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB Connected !!');
    return server.listen({ port: PORT });
}).then((res) => {
    console.log(`Server running at ${res.url}`);
}).catch(err => console.error(err));