"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TotalRewardsQuery = void 0;
const graphql_request_1 = require("graphql-request");
exports.TotalRewardsQuery = (0, graphql_request_1.gql) `
    query getTotalRewards($limit: Int = 1000, $skip: Int = 0, $fromBlock: Int = 0) {
        totalRewards(first: $limit, skip: $skip, where: { block_gte: $fromBlock }) {
            id

            totalPooledEtherBefore
            totalPooledEtherAfter
            totalSharesBefore
            totalSharesAfter

            apr

            block
            blockTime
            logIndex
        }
    }
`;
