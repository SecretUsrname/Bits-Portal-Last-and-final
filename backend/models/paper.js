
import mongoose from 'mongoose';
import User from './user.js';

const PaperSchema = mongoose.Schema(
    {
        title:{
            type:String,
            required: true, 

        },
        author:{
            type:String,
            required:true,
        },
        DOI:{
            type:String,
            required:true,
        },
        publisher:{
            type:String,
        }, 
        year:{
            type:Number,
            required:true,
        },
        journal:{
            type:String,
        },
        volume:{
            type:String,
        },
        pages:{
            type:Number,
        },
        creator:{
            type: String,
            ref: User,
        },
        taggers:{
            type: [String],
            ref: User,
        }
    },

    {
        timeStamp: true
    }
);

const Paper = mongoose.model("Paper", PaperSchema);

export default Paper;
