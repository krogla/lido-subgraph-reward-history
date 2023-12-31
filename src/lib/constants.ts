import { HistoryRecord, RecordType } from "./types"

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"

export const ADDRESS_WITHDRAWALS = [
    "0xCF117961421cA9e546cD7f50bC73abCdB3039533", // Goerli
    "0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1", // Mainnet
].map((a) => a.toLowerCase())

export const EMPTY_REC: HistoryRecord = {
    type: RecordType.Reward,

    value: 0n,
    shares: 0n,

    sharesBefore: 0n,
    sharesAfter: 0n,

    balanceBefore: 0n,
    balanceAfter: 0n,

    totalPooledEtherBefore: 0n,
    totalPooledEtherAfter: 0n,
    totalSharesBefore: 0n,
    totalSharesAfter: 0n,

    block: 0,
    blockTime: 0,
    logIndex: 0,
}
