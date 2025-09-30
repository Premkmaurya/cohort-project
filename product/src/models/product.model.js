const mongoose = require('mongoose');   

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    price:{
        amount:{
            type:String,
            required:true
        },
        currency:{
            type:String,
            enum:["USD","INR"],
            default:"INR"
        }
    },
    images:[
        {
            url:{
                type:String,
                required:true
            },
            thumbnail:{
                type:String,
            },
            id:{
                type:String,
                required:true
            }
        }
    ],
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        required:true   
    }
})

productSchema.index({title:"text",description:"text"});

const productModel = mongoose.model('product',productSchema);

module.exports = productModel;