import { model } from "mongoose"

export const findOne = async ({model,filter= { },select="",populate=[]}) =>{
return await model.findOne(filter).select(select).populate(populate)
}

export const find = async ({model,filter= { },select="",populate=[]}) =>{
    return await model.find(filter).select(select).populate(populate)
}

export const findById = async ({model,id,select ="" ,populate = [] }) =>{
return await model.findById(id).select(select).populate(populate)
}

export const create = async({model,data = [{}],options ={validateBeforeSave: true}})=>{
return await model.create(data,options)
}

export const updateOne = async({model,filter={},data = [{}],options ={runvalidators: true}})=>{
return await model.updateOne(filter,data,options)
}

export const deleteMany = async ({model,filter={}})=>{
    return await model.deleteMany(filter)
}
export const findOneAndUpdate = async ({model,filter= { },data={},select={},options = {runvalidators: true,new:true}}) =>{
    return await model.findOneAndUpdate(filter,{...data,$inc:{__v:1}},options).select(select)
}

export const deleteOne = async ({model,filter={}}) =>{
    return await model.deleteOne(filter)
}
