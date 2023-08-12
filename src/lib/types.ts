import { TotalRewardEvent, UserTransferEvent } from "../subgraph"

export type RecordEvents = UserTransferEvent | TotalRewardEvent

export enum RecordType {
    TransferIn = "txIn",
    TransferOut = "txOut",
    Stake = "stake",
    Withdraw = "withdraw",
    Reward = "reward",
}

export type BasicRecord = {
    type: RecordType

    block: number
    blockTime: number

    logIndex: number
    txHash?: string
}

export type HistoryRecord = BasicRecord & {
    from?: string
    to?: string

    value: bigint
    shares: bigint

    sharesBefore: bigint
    sharesAfter: bigint

    balanceBefore: bigint
    balanceAfter: bigint

    totalPooledEtherBefore: bigint
    totalPooledEtherAfter: bigint
    totalSharesBefore: bigint
    totalSharesAfter: bigint

    apr?: number
}
