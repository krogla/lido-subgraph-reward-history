import "dotenv/config"

import { RecordType } from "./lib/types"
import { buildUserRewardHistory, fetchUserRewardHistoryRecords, formatDecimal } from "./lib/history"
import { getSubgraphClient } from "./subgraph"

const main = async () => {
    const [userAddr] = process.argv.slice(2)
    if (!userAddr) {
        console.info(`usage: npm run rewards <stETH_holder_address>`)
        return
    }

    const client = getSubgraphClient()
    const { rawRecords, startIdx } = await fetchUserRewardHistoryRecords(client, userAddr)

    if (!rawRecords.length) {
        console.warn(`No events fetched for address: ${userAddr}`)
        return
    }
    const rewardsHistory = buildUserRewardHistory(rawRecords, startIdx)
    const totalRewards = rewardsHistory.reduce((s, r) => (r.type === RecordType.Reward ? s + r.value : s), 0n)

    const historyFormatted = rewardsHistory.map((r) => ({
        date: new Date(r.blockTime * 1000).toLocaleDateString("fr-CA"),
        block: r.block,
        type: r.type,
        hash: r.txHash,
        // from: r.from,
        // to: r.to,
        // sharesDelta: formatDecimal(r.shares!),
        shares: formatDecimal(r.sharesAfter),
        balanceDelta: formatDecimal(r.value),
        balance: formatDecimal(r.balanceAfter),
    }))

    console.table({ userAddr, totalRewards: formatDecimal(totalRewards) })
    console.table(historyFormatted)
    // console.log(JSON.stringify(historyFormatted))
}

main()
    .then(() => {
        process.exit(0)
    })
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
