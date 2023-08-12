import { gql } from "graphql-request"

export interface UserTransferEvent {
    from: string
    to: string
    value: string

    shares: string
    sharesBeforeDecrease: string
    sharesAfterDecrease: string
    sharesBeforeIncrease: string
    sharesAfterIncrease: string

    totalPooledEther: string
    totalShares: string

    balanceAfterDecrease: string
    balanceAfterIncrease: string
    block: string
    blockTime: string
    transactionHash: string
    transactionIndex: string
    logIndex: string
}

export const UserTransfersQuery = gql`
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
`
