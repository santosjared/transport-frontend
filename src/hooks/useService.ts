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
  const Get = async (endpoint:string, param?:{}) =>{
    return await instance.get(endpoint,  {
      params: param
    })
  }
  const GetId = async (endpoint:string,id:string | number)=>{
    return await instance.get(`${endpoint}/${id}`)
  }
  const Update = async (endpoint:string,data:{[key:string]:any},id:string|number)=>{
    try{
      const response = await instance.put(`${endpoint}/${id}`,data,getHeaders(data))
      return response
    }catch(error:any){
      return error.response
    }
  }
  const Delete = async (endpoint:string,id:string | number)=>{
  return await instance.delete(`${endpoint}/${id}`)
  }
  return {
    Post, Get, GetId, Update, Delete
  }

}
