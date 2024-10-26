import { model, models, Schema } from "mongoose";
export interface IProduct {
    name: string
    description: string
    price: number
    imageUrls: string[]
    category: string
    subCategory: {_id:string,name:string};
    sizes: string[]
    pattern:string
    Sleeves:string
    Color:string
    Brand:string
    fit:string
    ProductMaterial:string
    length:string
    Neck:string
    bestsellers: boolean
    createdAt: Date
    createdBy: {_id:string,firstName:string,lastName:string};
}
const ProductSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    imageUrls: {type: Array, required: true},
    category: {
        type: String,
        enum: ["men", "women", "kid"], // Restrict values to these three
        required: true,
    },
    subCategory: {type: Schema.Types.ObjectId, ref:"Category", required: true},
    pattern:{type:String},
    sleeves:{type:String},
    color:{type:String},
    brand:{type:String},
    fit:{type:String},
    productMaterial:{type:String},
    length:{type:String},
    neck:{type:String},
    sizes : {type: Array, required: true},
    bestsellers: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now},
    createdBy: {type: Schema.Types.ObjectId, ref:"User"},
    
}
, {
    timestamps: true // Automatically manage createdAt and updatedAt fields
})

export const Product = models.Product || model('Product', ProductSchema);