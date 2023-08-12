import { ADDRESS_WITHDRAWALS, ADDRESS_ZERO, EMPTY_REC } from "./constants"
import { BasicRecord, HistoryRecord, RecordEvents, RecordType } from "./types"
import { TotalRewardEvent, UserTransferEvent } from "../subgraph"

export const recordFromEvent = (tx: RecordEvents, type: RecordType): HistoryRecord => {
    return {
        ...EMPTY_REC,
        type,
        block: Number(tx.block),
        blockTime: Number(tx.blockTime),
        logIndex: Number(tx.logIndex),
    }
}

export const cmpRecAsc = <T extends BasicRecord>(a: T, b: T) => a.block - b.block || a.logIndex - b.logIndex
export const cmpRecDesc = <T extends BasicRecord>(a: T, b: T) => b.block - a.block || b.logIndex - a.logIndex
export const sortRecords = <T extends BasicRecord>(recs: T[], direction: "asc" | "desc" = "asc") => recs.sort(direction === "asc" ? cmpRecAsc : cmpRecDesc)

export const castUserTransfers = (txs: UserTransferEvent[], addr: string): HistoryRecord[] => {
    return txs.map((tx) => {
        const isTxIn = tx.to.toLowerCase() === addr.toLowerCase()

        let sharesBefore: bigint
        let sharesAfter: bigint
        let balanceAfter: bigint
        let type: RecordType

        if (isTxIn) {
            sharesBefore = BigInt(tx.sharesBeforeIncrease)
            sharesAfter = BigInt(tx.sharesAfterIncrease)
            balanceAfter = BigInt(tx.balanceAfterIncrease)
            type = tx.from === ADDRESS_ZERO ? RecordType.Stake : RecordType.TransferIn
        } else {
            sharesBefore = BigInt(tx.sharesBeforeDecrease)
            sharesAfter = BigInt(tx.sharesAfterDecrease)
            balanceAfter = BigInt(tx.balanceAfterDecrease)
            type = ADDRESS_WITHDRAWALS.includes(tx.to.toLowerCase()) ? RecordType.Withdraw : RecordType.TransferOut
        }

        const totalPooledEther = BigInt(tx.totalPooledEther)
        const totalShares = BigInt(tx.totalShares)
        const balanceBefore = (sharesBefore * totalPooledEther) / totalShares

        return {
            ...recordFromEvent(tx, type),

            from: tx.from,
            to: tx.to,

            value: BigInt(tx.value),
            shares: BigInt(tx.shares),

            sharesBefore,
            sharesAfter,

            balanceBefore,
            balanceAfter,

            totalPooledEtherBefore: totalPooledEther,
            totalPooledEtherAfter: totalPooledEther,
            totalSharesBefore: totalShares,
            totalSharesAfter: totalShares,

            txHash: tx.transactionHash,
        }
    })
}
export const castTotalRewards = (txs: TotalRewardEvent[]): HistoryRecord[] => {
    return txs.map((tx) => {
        return {
            ...recordFromEvent(tx, RecordType.Reward),

            totalPooledEtherBefore: BigInt(tx.totalPooledEtherBefore),
            totalPooledEtherAfter: BigInt(tx.totalPooledEtherAfter),
            totalSharesBefore: BigInt(tx.totalSharesBefore),
            totalSharesAfter: BigInt(tx.totalSharesAfter),
            apr: Number(tx.apr),
            txHash: tx.id,
        }
    })
}
