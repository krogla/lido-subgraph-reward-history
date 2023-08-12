import { GraphQLClient, RequestDocument, Variables } from "graphql-request"
import cfg from "../lib/config"

export const fetchAll = async <T>(client: GraphQLClient, query: RequestDocument, variables: Variables = {}): Promise<T[]> => {
    const results: T[] = []
    const limit = 1000
    let skip = 0
    let next = true
    while (next) {
        const res = await client.request<Record<string, T[]>>(query, {
            ...variables,
            limit,
            skip,
        })
        const data = Object.values(res)[0]
        results.push(...data)
        if (data.length < limit) next = false
        else skip += limit
    }

    return results
}

export const getSubgraphClient = () => {
    const { subgraphUrl } = cfg
    if (!subgraphUrl) throw new Error("subgraph url not defined")
    return new GraphQLClient(subgraphUrl)
}
