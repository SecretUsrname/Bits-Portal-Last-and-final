import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['User', 'Admin'], // Restrict to 'User' or 'Admin'
            required: true,
        },
        DOI: {
            type: [String],
            ref: 'Paper',
        },
        tagged_DOI: {
            type: [String],
            ref: 'Paper',
        },
        PSR: {
            type: String,
        },
        officePhone: {
            type: String,
        },
        personalPhone: {
            type: String,
        },
        chamberNum: {
            type: String,
        },
        Dept: {
            type: String,
        },
    },
    {
        timestamps: true, // Fixed typo: use `timestamps` instead of `timeStamp`
    }
);

const User = mongoose.model('User', UserSchema);

export default User;
