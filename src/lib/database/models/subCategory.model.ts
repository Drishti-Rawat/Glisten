import { model, models, Schema } from "mongoose";

export interface ISubCategory {
    _id: string
    name: string
}

const SubCategorySchema = new Schema({
    name:{type:String,required:true,unique:true},
})

const SubCategory = models.Category || model("Category", SubCategorySchema);
export default SubCategory