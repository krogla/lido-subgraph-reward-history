"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTransfersQuery = void 0;
const graphql_request_1 = require("graphql-request");
exports.UserTransfersQuery = (0, graphql_request_1.gql) `
    query getUserTransfers($limit: Int = 1000, $skip: Int = 0, $address: Bytes!) {
        lidoTransfers(first: $limit, skip: $skip, where: { or: [{ from: $address }, { to: $address }] }) {
            from
            to
            value

            shares
            sharesBeforeDecrease
            sharesAfterDecrease
            sharesBeforeIncrease
            sharesAfterIncrease

            totalPooledEther
            totalShares

            balanceAfterDecrease
            balanceAfterIncrease

            block
            blockTime
            transactionHash
            logIndex
        }
    }
`;
