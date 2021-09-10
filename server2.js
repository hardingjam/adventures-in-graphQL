var express = require("express");
var { graphqlHTTP } = require("express-graphql");

var {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
} = require("graphql");
var app = express();

const directors = [
    { id: 1, name: "Michael Haneke" },
    { id: 2, name: "Paul Thomas Anderson" },
    { id: 3, name: "Lynn Ramsay" },
];

const films = [
    { id: 1, name: "The White Ribbon", directorId: 1 },
    { id: 2, name: "The Piano Teacher", directorId: 1 },
    { id: 3, name: "Amour", directorId: 1 },
    { id: 4, name: "You Were Never Really Here", directorId: 3 },
    { id: 5, name: "Morven Callar", directorId: 3 },
    { id: 6, name: "Hard Eight", directorId: 2 },
    { id: 6, name: "Punch Drunk Love", directorId: 2 },
];

/** THE OBJECT TYPE ***/
/** This is where I define the expected structure of each FilmType object. ***/

const FilmType = new GraphQLObjectType({
    // Name and description are self-explanatory
    name: "Film",
    description: "This represents a film with a director",
    // Each FilmType object will include the following fields.
    // To begin with, it will reflect the data structure in my hard-coded films array.
    fields: () => ({
        // An index number which is NOT NULL (think SQL notation)...
        id: { type: GraphQLNonNull(GraphQLInt) },
        // ... a name which is NOT NULL...
        name: { type: GraphQLNonNull(GraphQLString) },
        // ...and a directorId.
        directorId: { type: GraphQLNonNull(GraphQLInt) },
        // Now, this is where it gets interesting. We want to make things relational, so that we can access the director for each film, even though they exist in a separate "database".
        director: {
            // We will need to create another type!
            type: DirectorType,
            // Because our film objects don't include directors (just their ID), we need to use a resolve function to access the information in the directors array.
            // Resolve takes a "parent property", which is whatever film is being queried.
            resolve: (film) => {
                // It returns the director whose ID matches the directorID of the film.
                // I'm using find, not filter, since the first match will be enough.
                return directors.find(
                    (director) => director.id === film.directorId
                );
            },
        },
    }),
});

// Once I define a DirectorType, I can use it to populate the results of my films query.
const DirectorType = new GraphQLObjectType({
    name: "Director",
    description: "This represents a director of a film",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
    }),
});

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    // A descriptive name will appear in our docs, and tell us that this is the top level
    description: "Root Query",
    // This is where we define our fields
    fields: () => ({
        films: {
            // We've imported GraphQLLists, and we can wrap our FilmType inside it to make a list of FilmTypes.
            type: new GraphQLList(FilmType),
            description: "A list of all the films",
            // Here I am using a super simple implicit return, which is my entire hard-coded list of films.
            // If I had a database, I would query it here.
            resolve: () => films,
        },
    }),
});

// Whatever is defined here will be used by my graphiql middleware.
const schema = new GraphQLSchema({ query: RootQueryType });

//Middleware to insist on using graphiql.

app.use(
    "/graphql",
    graphqlHTTP({
        schema: schema,
        // rootValue: root,
        graphiql: true,
    })
);
app.listen(4000, () => console.log("Now browse to localhost:4000/graphql"));
