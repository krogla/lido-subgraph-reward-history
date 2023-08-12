"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const types_1 = require("./lib/types");
const history_1 = require("./lib/history");
const subgraph_1 = require("./subgraph");
const main = async () => {
    const [userAddr] = process.argv.slice(2);
    if (!userAddr) {
        console.info(`usage: npm run rewards <stETH_holder_address>`);
        return;
    }
    const client = (0, subgraph_1.getSubgraphClient)();
    const { rawRecords, startIdx } = await (0, history_1.fetchUserRewardHistoryRecords)(client, userAddr);
    if (!rawRecords.length) {
        console.warn(`No events fetched for address: ${userAddr}`);
        return;
    }
    const rewardsHistory = (0, history_1.buildUserRewardHistory)(rawRecords, startIdx);
    const totalRewards = rewardsHistory.reduce((s, r) => (r.type === types_1.RecordType.Reward ? s + r.value : s), 0n);
    const historyFormatted = rewardsHistory.map((r) => ({
        date: new Date(r.blockTime * 1000).toLocaleDateString("fr-CA"),
        block: r.block,
        type: r.type,
        hash: r.txHash,
        // from: r.from,
        // to: r.to,
        // sharesDelta: formatDecimal(r.shares!),
        shares: (0, history_1.formatDecimal)(r.sharesAfter),
        balanceDelta: (0, history_1.formatDecimal)(r.value),
        balance: (0, history_1.formatDecimal)(r.balanceAfter),
    }));
    console.table({ userAddr, totalRewards: (0, history_1.formatDecimal)(totalRewards) });
    console.table(historyFormatted);
    // console.log(JSON.stringify(historyFormatted))
};
main()
    .then(() => {
    process.exit(0);
})
    .catch((e) => {
    console.error(e);
    process.exit(1);
});
