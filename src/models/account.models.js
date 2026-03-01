import mongoose from "mongoose"
import LedgerModel from "./ledger.models";

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Account must be associated with a user"],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ['ACTIVE', 'FROZEN', 'CLOSED'],
            message: "Status must be either 'ACTIVE', 'FROZEN', or 'CLOSED'",
        },
        default: "ACTIVE"
    },
    currency: {
        type: String,
        required: [true, "Currency is required for creating an account"],
        default: "INR"
    }
}, {
    timestamps: true
});

// compound index to ensure a user cannot have multiple accounts with the same status
accountSchema.index({ user: 1, status: 1 });

accountSchema.methods.getBalance = async function () {
    const balanceData = await LedgerModel.aggregate([
        {
            $match: {
                account: this._id
            }
        },
        {
            $group: {
                _id: null,
                totalDebits: {
                    $sum: {
                        $cond: [
                            {
                                $eq: ["$type", "DEBIT"]
                            },
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredits: {
                    $sum: {
                        $cond: [
                            {
                                $eq: ["$type", "CREDIT"]
                            },
                            "$amount",
                            0
                        ]
                    }
                }
            },
        },
        {
            $project: {
                _id: 0,
                balance: {
                    $subtract: ["$totalCredits", "$totalDebits"]
                }
            }
        }
    ])

    if(balanceData.length === 0){
        return 0;
    }
    return balanceData[0].balance;
}

const accountModel = mongoose.model("Account", accountSchema);

export default accountModel;   