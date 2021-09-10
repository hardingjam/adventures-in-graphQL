var express = require("express");
var { graphqlHTTP } = require("express-graphql");

var { GraphQLSchema, GraphQLObjectType, GraphQLString } = require("graphql");
var app = express();

// The schema defines our query section
var schema = new GraphQLSchema({
    // The query section defines the use-cases we can use for querying our HelloWorld object
    query: new GraphQLObjectType({
        // For now, the object is super simple. It has a name...
        name: "HelloWorld",
        // ...and single field: message.
        fields: () => ({
            message: {
                type: GraphQLString,
                // The resolve function is what information we are returning for this field.
                // How do we get that information and return it?
                resolve: () => "Hello World!",
            },
        }),
    }),
});

var root = { hello: () => "Hello world!" };

//Middleware to insist on using graphiql.
app.use(
    "/graphql",
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    })
);
app.listen(4000, () => console.log("Now browse to localhost:4000/graphql"));
