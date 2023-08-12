"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubgraphClient = exports.fetchAll = void 0;
const graphql_request_1 = require("graphql-request");
const config_1 = __importDefault(require("../lib/config"));
const fetchAll = async (client, query, variables = {}) => {
    const results = [];
    const limit = 1000;
    let skip = 0;
    let next = true;
    while (next) {
        const res = await client.request(query, {
            ...variables,
            limit,
            skip,
        });
        const data = Object.values(res)[0];
        results.push(...data);
        if (data.length < limit)
            next = false;
        else
            skip += limit;
    }
    return results;
};
exports.fetchAll = fetchAll;
const getSubgraphClient = () => {
    const { subgraphUrl } = config_1.default;
    if (!subgraphUrl)
        throw new Error("subgraph url not defined");
    return new graphql_request_1.GraphQLClient(subgraphUrl);
};
exports.getSubgraphClient = getSubgraphClient;
