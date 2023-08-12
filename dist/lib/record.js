"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.castTotalRewards = exports.castUserTransfers = exports.sortRecords = exports.cmpRecDesc = exports.cmpRecAsc = exports.recordFromEvent = void 0;
const constants_1 = require("./constants");
const types_1 = require("./types");
const recordFromEvent = (tx, type) => {
    return {
        ...constants_1.EMPTY_REC,
        type,
        block: Number(tx.block),
        blockTime: Number(tx.blockTime),
        logIndex: Number(tx.logIndex),
    };
};
exports.recordFromEvent = recordFromEvent;
const cmpRecAsc = (a, b) => a.block - b.block || a.logIndex - b.logIndex;
exports.cmpRecAsc = cmpRecAsc;
const cmpRecDesc = (a, b) => b.block - a.block || b.logIndex - a.logIndex;
exports.cmpRecDesc = cmpRecDesc;
const sortRecords = (recs, direction = "asc") => recs.sort(direction === "asc" ? exports.cmpRecAsc : exports.cmpRecDesc);
exports.sortRecords = sortRecords;
const castUserTransfers = (txs, addr) => {
    return txs.map((tx) => {
        const isTxIn = tx.to.toLowerCase() === addr.toLowerCase();
        let sharesBefore;
        let sharesAfter;
        let balanceAfter;
        let type;
        if (isTxIn) {
            sharesBefore = BigInt(tx.sharesBeforeIncrease);
            sharesAfter = BigInt(tx.sharesAfterIncrease);
            balanceAfter = BigInt(tx.balanceAfterIncrease);
            type = tx.from === constants_1.ADDRESS_ZERO ? types_1.RecordType.Stake : types_1.RecordType.TransferIn;
        }
        else {
            sharesBefore = BigInt(tx.sharesBeforeDecrease);
            sharesAfter = BigInt(tx.sharesAfterDecrease);
            balanceAfter = BigInt(tx.balanceAfterDecrease);
            type = constants_1.ADDRESS_WITHDRAWALS.includes(tx.to.toLowerCase()) ? types_1.RecordType.Withdraw : types_1.RecordType.TransferOut;
        }
        const totalPooledEther = BigInt(tx.totalPooledEther);
        const totalShares = BigInt(tx.totalShares);
        const balanceBefore = (sharesBefore * totalPooledEther) / totalShares;
        return {
            ...(0, exports.recordFromEvent)(tx, type),
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
        };
    });
};
exports.castUserTransfers = castUserTransfers;
const castTotalRewards = (txs) => {
    return txs.map((tx) => {
        return {
            ...(0, exports.recordFromEvent)(tx, types_1.RecordType.Reward),
            totalPooledEtherBefore: BigInt(tx.totalPooledEtherBefore),
            totalPooledEtherAfter: BigInt(tx.totalPooledEtherAfter),
            totalSharesBefore: BigInt(tx.totalSharesBefore),
            totalSharesAfter: BigInt(tx.totalSharesAfter),
            apr: Number(tx.apr),
            txHash: tx.id,
        };
    });
};
exports.castTotalRewards = castTotalRewards;
