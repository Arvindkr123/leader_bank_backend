
/**
 * - Create a New Transcation
 * THE 10-STEP TRANSFER FLOW
 * 1. Validate the request body
 * 2. Validate idempotency key
 * 3. Check the amount status
 * 4.  Derive sender balance from ledger 
 * 5. Create transcation with PENDING status
 * 6. Create Debit ledger entry for sender
 * 7. Create Credit ledger entry for receiver
 * 8. Update transcation status to COMPLETED
 * 9. Commit mongodb session
 * 10. send the email notification to the sender and receiver
*/

import mongoose from "mongoose";
import accountModel from "../models/account.models.js";
import TranscationModel from "../models/transactions.models.js";

export async function createTranscation(req, res) {
    try {
        const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

        if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const fromUserAccount = await accountModel.findOne({
            _id: fromAccount
        })
        const toUserAccount = await accountModel.findOne({
            _id: toAccount
        })

        if (!fromUserAccount || !toUserAccount) {
            return res.status(400).json({
                message: 'Invalid fromAccount or toAccount'
            })
        }

        // Validate the idempotency key
        const transcationAlreadyExists = await TranscationModel.findOne({ idempotencyKey });

        if (transcationAlreadyExists) {
            if (transcationAlreadyExists.status === 'COMPLETED') {
                return res.status(409).json({
                    message: 'Transcation already completed with this idempotency key',
                    idempotencyKey: idempotencyKey
                })
            }
            if (transcationAlreadyExists.status === 'PENDING') {
                return res.status(409).json({
                    message: 'Transcation already pending with this idempotency key',
                    idempotencyKey: idempotencyKey
                })
            }
            if (transcationAlreadyExists.status === 'FAILED') {
                return res.status(409).json({
                    message: 'Transcation already failed with this idempotency key',
                    idempotencyKey: idempotencyKey
                })
            }
            if (transcationAlreadyExists.status === 'REVERSED') {
                return res.status(409).json({
                    message: 'Transcation already reversed with this idempotency key',
                    idempotencyKey: idempotencyKey
                })
            }
        }


        // checking the account status
        if (fromUserAccount.status !== 'ACTIVE' || toUserAccount.status !== 'ACTIVE') {
            return res.status(400).json({
                message: 'toAccount or fromAccount accounts are not active'
            })
        }

        // get the balance of the sender account
        const senderBalance = await fromUserAccount.getBalance();
        if (senderBalance < amount) {
            return res.status(400).json({
                message: `Insufficient balance.Current balance is ${senderBalance} and required balance is ${amount}`
            })
        }

        // create mongodb session
        const session = await mongoose.startSession();
        session.startTransaction();

        const transcation = await TranscationModel.create({
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: 'PENDING'
        }, { session })

        const debitLedgerEntry = await LedgerModel.create({
            account: fromAccount,
            amount,
            transcation: transcation._id,
            type: 'DEBIT'
        }, { session })
        const creditLedgerEntry = await LedgerModel.create({
            account: toAccount,
            amount,
            transcation: transcation._id,
            type: 'CREDIT'
        }, { session })

        transcation.status = 'COMPLETED';
        await transcation.save({ session })

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'Transcation completed successfully',
            transcationId: transcation._id,
            idempotencyKey: idempotencyKey
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
} 