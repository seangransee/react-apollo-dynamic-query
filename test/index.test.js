import { graphqlDynamic } from "../src"
import gql from "graphql-tag"

describe("graphqlDynamic", () => {
  it("successfully generates component", () => {
    const query = jest.fn(props => {
      return gql`
        query GetName {
          entity: ${props.field} {
            name
          }
        }
      `
    })

    const component = graphqlDynamic(query)(
      props => `My name is ${props.name}.`
    )({
      field: "passedIntoQuery"
    }).type.WrappedComponent

    expect(component({ name: "Sean" })).toEqual("My name is Sean.")

    expect(query).toHaveBeenCalledTimes(1)
    expect(query).toHaveBeenLastCalledWith({ field: "passedIntoQuery" })
  })
})
