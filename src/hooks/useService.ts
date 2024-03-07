const headers = (isFile:boolean)=>{
    if(isFile) return{
        'Content-Type': 'multipart/form-data'
    }
    return{'Content-Type': 'application/json'}
}
const request = async() =>{
    
}