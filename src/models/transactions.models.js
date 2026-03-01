import mongoose from "mongoose";

const transcationSchema = new mongoose.Schema({
    fromAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'account',
        required:[true, 'Transaction must be associated with an account'],
        index:true
    },
    toAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'account',
        required:[true, 'Transaction must be associated with an account'],
        index:true
    },
    status:{
        type:String,
        enum:{
            values:['PENDING', 'COMPLETED', 'FAILED', 'REVERSED'],
            message:'Status must be either PENDING, COMPLETED, FAILED, or REVERSED'
        }
    },
    amount:{
        type:Number,
        required:[true, 'Amount is required for a transaction'],
        min:[0, 'Transaction amount must be a positive number']
    },
    idempotencyKey:{
        type:String,
        required:[true, 'Idempotency key is required for a transaction'],
        unique:true,
        index:true
    }
},{
    timestamps:true
})

const TranscationModel = mongoose.model('transaction', transcationSchema)

export default TranscationModel