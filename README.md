# react-apollo-dynamic-query

This package provides a replacement for [react-apollo's `graphql()` function](https://www.apollographql.com/docs/react/api/react-apollo.html#graphql), allowing for the query to be dynamically generated as a function of props.

## Installation

Using npm:

```
npm install --save react-apollo-dynamic-query
```

Using yarn:

```
yarn add react-apollo-dynamic-query
```

## Usage

```js
import { graphqlDynamic } from "react-apollo-dynamic-query"

const MyApolloComponent = graphqlDynamic(props => {
  return gql`
    # YOUR QUERY HERE
  `
})(MyDisplayComponent)
```

## Why?

When we use the [`graphql()`](https://www.apollographql.com/docs/react/api/react-apollo.html#graphql) function in react-apollo, we must specify an exact query. We can have variable arguments, but the _fields_ we use have to be specified in our query. This is sufficient for most cases, because most components will need to display a specific type of data. But what if we want to build a component that can slightly modify the query based on the props we pass in? We would have to build a different component for each use case.

For example, let's say we want to build a component that can display a list of all our users _or_ all our animals. If we're using the `graphql()` function, we'd have to build two separate components, like this:

```js
import React from "react"
import gql from "graphql-tag"
import { graphql } from "react-apollo"

const ListEntities = props => {
  if (props.data.loading) return null

  return (
    <div>
      <h1>List of {props.field}:</h1>
      <ul>
        {props.data.entities.map(entity => (
          <li>{entity.name}</li>
        ))}
      </ul>
    </div>
  )
}

const usersQuery = gql`
  query ListUsers {
    entities: users {
      name
    }
  }
`

const animalsQuery = gql`
  query ListAnimals {
    entities: animals {
      name
    }
  }
`

const ListUsersWithData = graphql(usersQuery)(ListEntities)
const ListAnimalsWithData = graphql(animalsQuery)(ListEntities)
```

Through the use of aliasing (seeing the field in both queries to "entities"), we're able to re-use our display component (`ListEntities`), but we have to create two different GraphQL-connected components (`ListUsersWithData` and `ListAnimalsWithData`) since we're dealing with two different queries.

It would be nice to be able to create a generic `ListEntitiesWithData` component that modifies the query based on the props we pass in.

## Example

This package provides a function called `graphqlDynamic()`, which is a drop-in replacement for react-apollo's [`graphql()`](https://www.apollographql.com/docs/react/api/react-apollo.html#graphql) function. The only difference is that the `query` argument we pass in must now be a _function_ instead of a GraphQL tag. This allows us to create a component that modifies the query based on the props we pass in.

```js
import React from "react"
import gql from "graphql-tag"
import { graphqlDynamic } from "react-apollo-dynamic-query"

// This component hasn't changed from the example above.
const ListEntities = props => {
  if (props.data.loading) return null

  return (
    <div>
      <h1>List of {props.field}:</h1>
      <ul>
        {props.data.entities.map(entity => (
          <li>{entity.name}</li>
        ))}
      </ul>
    </div>
  )
}

// We can now pass in the name of the field as a prop,
// and generate the query using string interpolation.
const query = props => gql`
  query Foo {
    entities: ${props.field} {
      name
    }
  }
`

const ListEntitiesWithData = graphqlDynamic(query)(ListEntities)
```

Then, we can use our component like this:

```js
<ListEntitiesWithData field="users" />

<ListEntitiesWithData field="animals" />
```
