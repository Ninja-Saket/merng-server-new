const { gql } = require('apollo-server');

module.exports = gql`
    type Post {
        id: ID!,
        body: String!,
        username: String!,
        createdAt: String!
        comments: [Comment]!,
        likes: [Like]!
        likeCount: Int!
        commentCount: Int!
    }
    type Comment {
        id: ID!,
        createdAt: String!,
        username: String!,
        body: String!
    }
    type Like {
        id: ID!,
        createdAt: String!,
        username: String!
    }
    type Query {
        getPosts: [Post],
        getPost(postId: ID!):Post
    }
    input RegisterInput {
        username: String!,
        email: String!,
        password: String!,
        confirmPassword: String!
    }
    type User {
        id: ID!,
        username: String!,
        token: String!,
        email: String!,
        createdAt: String!
    }
    type Mutation {
        login(username: String!, password: String!): User!
        register(registerInput: RegisterInput):User!
        createPost(body: String!):Post!
        deletePost(postId: ID!):String!
        createComment(postId: ID!, body: String!):Post!
        deleteComment(postId: ID!, commentId: ID!):Post!
        likePost(postId: ID!):Post!
    },
    type Subscription {
        newPost: Post!
    }
`;

