
import mongoose from 'mongoose';

const AdminSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        }
    },

    {
        timeStamp: true
    }
);

const Admin = mongoose.model("Admin", AdminSchema);

export default Admin;
