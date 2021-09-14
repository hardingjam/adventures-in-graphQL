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

const FilmType = new GraphQLObjectType({
    name: "Film",
    description: "This represents a film with a director",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        directorId: { type: GraphQLNonNull(GraphQLInt) },
        director: {
            type: DirectorType,
            resolve: (film) => {
                return directors.find(
                    (director) => director.id === film.directorId
                );
            },
        },
    }),
});

const DirectorType = new GraphQLObjectType({
    name: "Director",
    description: "This represents a director of a film",
    // We MUST use functions, not objects, to define our types. Otherwise they will not be hoisted when they're compiled, and will not be able to "read" each other properly.
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        films: {
            type: new GraphQLList(FilmType),
            resolve: (director) => {
                return films.filter((film) => film.directorId === director.id);
            },
        },
    }),
});

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: () => ({
        film: {
            type: FilmType,
            description: "A single film",
            args: {
                id: { type: GraphQLInt },
            },
            resolve: (parent, args) =>
                films.find((film) => film.id === args.id),
        },
        films: {
            type: new GraphQLList(FilmType),
            description: "A list of all the films",
            resolve: () => films,
        },

        director: {
            type: DirectorType,
            description: "A single director",
            args: {
                id: { type: GraphQLInt },
            },
            resolve: (parent, args) =>
                directors.find((director) => director.id === args.id),
        },
        directors: {
            type: new GraphQLList(DirectorType),
            description: "A list of all the directors",
            resolve: () => directors,
        },
    }),
});

const RootMutationType = new GraphQLObjectType({
    // By default, GraphiQL uses queries, not mutations. We will have to specify this is the browser UI
    name: "Mutation",
    description: "Root mutation",
    fields: () => ({
        // the different operations we want to do with each mutation
        addFilm: {
            type: FilmType,
            description: "Add a film",
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                directorId: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                // the resolve function will push the new film to our films array
                const film = {
                    id: films.length + 1,
                    name: args.name,
                    directorId: args.directorId,
                };
                films.push(film);
                return film;
            },
        },
        addDirector: {
            type: DirectorType,
            description: "Add a director",
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                const director = {
                    id: directorss.length + 1,
                    name: args.name,
                };
                directors.push(director);
                return director;
            },
        },
    }),
});

const schema = new GraphQLSchema({
    query: RootQueryType,
    // Just like our root query, we will create a root mutation type.
    mutation: RootMutationType,
});

app.use(
    "/graphql",
    graphqlHTTP({
        schema: schema,
        graphiql: true,
    })
);
app.listen(4000, () => console.log("Now browse to localhost:4000/graphql"));

[
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
];
