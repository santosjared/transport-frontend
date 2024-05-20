import { useState } from "react"
import { instance } from "src/configs/instances"

export const useService = () => {
  const getHeaders = (data: { [key: string]: any }) => {
    for (const [key, value] of Object.entries(data)) {
      if (value instanceof File) {
        return { headers:{'Content-Type': 'multipart/form-data' }}
      }
    }
    return { headers:{'Content-Type': 'application/json'} }
  }
  const Post = async (endpoint:string,data: { [key: string]: any }) => {
    try{
      const response = await instance.post(endpoint,data,getHeaders(data))
      return response
    }catch(error:any){
      return error.response
    }
  }
  const Get = async (endpoint:string) =>{
    return await instance.get(endpoint)
  }
  const GetId = async (endpoint:string,id:string | number)=>{
    return await instance.get(`${endpoint}/${id}`)
  }
  const Update = async (endpoint:string,data:{[key:string]:any},id:string|number)=>{
    return await instance.put(`${endpoint}/${id}`,data,getHeaders(data))
  }
  const Delete = async (endpoint:string,id:string | number)=>{
  return await instance.delete(`${endpoint}/${id}`)
  }
  return {
    Post, Get, GetId, Update, Delete
  }
 
}
