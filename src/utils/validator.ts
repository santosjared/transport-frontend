
export const isPhoneValidate = (string:string ):boolean => {
    let aux:boolean = false
    if(string === '')return true
    if(string.length === 20)return false
    for(let i=0;i<string.length;i++){
        if(i==0){
            if(string.charAt(i)==='(' || string.charAt(i)=== '+'  || !isNaN(Number(string))){
                aux = true;
            }
        }
        if(i>1 && i<6 && string.length<6){        
            if(string.charAt(i)===')' || string.charAt(i)===' ' || !isNaN(parseInt(string.charAt(i)))){
                aux = true;
            }else{aux=false}
        }
        if(i===1 || string.length>5){
            if(!isNaN(parseInt(string.charAt(i)))){
                aux = true;
            }else{
                aux=false;
            }
        }
    }
    return aux
}
