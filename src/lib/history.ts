import { GraphQLClient } from "graphql-request"
import { HistoryRecord, RecordType } from "./types"
import { TotalRewardEvent, TotalRewardsQuery, UserTransferEvent, UserTransfersQuery, fetchAll } from "../subgraph"
import { castTotalRewards, castUserTransfers, sortRecords } from "./record"

export const fetchUserRewardHistoryRecords = async (client: GraphQLClient, address: string): Promise<{ rawRecords: HistoryRecord[]; startIdx: number }> => {
    let rawRecords: HistoryRecord[] = []
    let startIdx = 0

    const userEvents = await fetchAll<UserTransferEvent>(client, UserTransfersQuery, { address })
    if (userEvents.length) {
        const userRecs = sortRecords(castUserTransfers(userEvents, address), "asc")
        const { block: startBlock, logIndex: startLogIdx } = userRecs[0]

        // no point to query rewards earlier than the first user transaction
        const rewardEvents = await fetchAll<TotalRewardEvent>(client, TotalRewardsQuery, { fromBlock: startBlock })

        rawRecords = sortRecords([...userRecs, ...castTotalRewards(rewardEvents)], "asc")

        // search for the position of the 1st user's (tx) event, from which history formation will start.
        // This allows to skip reward events, even if they occurred in the same
        // block (and/or transaction), but before the user's (tx) event.
        startIdx = rawRecords.findIndex((r) => r.block === startBlock && r.logIndex === startLogIdx)
        if (startIdx === -1) {
            throw new Error("start user event not detected")
        }
    }
    return { rawRecords, startIdx }
}

export const buildUserRewardHistory = (allRecs: HistoryRecord[], startIdx = 0): HistoryRecord[] => {
    const result: HistoryRecord[] = []

    // calculate rewards as cumulative totals starting from the 1st user event
    for (let i = startIdx; i < allRecs.length; ++i) {
        const curRec = allRecs[i]
        if (curRec.type !== RecordType.Reward) {
            // add to result user event
            result.push({ ...curRec })
            continue
        }

        // 1st event should not be a reward event, but a user event
        if (i === startIdx) throw new Error("reward event before user tx event")

        // calculating reward event
        const prevRec = allRecs[i - 1]
        if (prevRec.sharesAfter === 0n) {
            // skip if no shares on balance in pre-reward state
            continue
        } else if (prevRec.sharesAfter === 1n) {
            // fast fwd skip in case user's shares = 1
            curRec.sharesBefore = 1n
            curRec.sharesAfter = 1n
            curRec.balanceBefore = 1n
            curRec.balanceAfter = 1n
        } else {
            // the user's shares will not change at the time of the reward
            curRec.sharesBefore = prevRec.sharesAfter
            curRec.sharesAfter = prevRec.sharesAfter

            // update users's cumulative totals for reward records
            curRec.balanceBefore = (prevRec.sharesAfter * curRec.totalPooledEtherBefore) / curRec.totalSharesBefore
            curRec.balanceAfter = (prevRec.sharesAfter * curRec.totalPooledEtherAfter) / curRec.totalSharesAfter

            // reward value
            curRec.value = curRec.balanceAfter - curRec.balanceBefore

            // add to result only if it has a non-zero reward value
            if (curRec.value > 0) {
                result.push({ ...curRec })
            }
        }
        // updated state
        allRecs[i] = curRec
    }
    return result
}

export const formatDecimal = (n: bigint = 0n, decimals: number = 18) => {
    const base = 10n ** BigInt(decimals)
    const d = n / base
    const r = n % base
    return `${d.toString()}.${r === 0n ? "0" : r.toString().padStart(decimals, "0")}`
}
