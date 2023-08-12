import { gql } from "graphql-request"

export interface TotalRewardEvent {
    id: string
    totalPooledEtherBefore: string
    totalPooledEtherAfter: string
    totalSharesBefore: string
    totalSharesAfter: string
    apr: string
    block: string
    blockTime: string
    logIndex: string
}

export const TotalRewardsQuery = gql`
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
`
