const Url = 'https://fakestoreapi.com/products'

export const getAllProductsApi = async() =>{
    try{
        const response = await fetch(Url);
        return response;
    } catch(error){
        return error;
    }
}


export const createProductApi = async() =>{
    try{
        const response = await fetch(Url);
        return response;
    } catch(error){
        return error;
    }
}


export const getSingleProductApi = async() =>{
    try{
        const response = await fetch(Url);
        return response;
    } catch(error){
        return error;
    }
}


export const updateProductApi = async() =>{
    try{
        const response = await fetch(Url);
        return response;
    } catch(error){
        return error;
    }
}


export const deleteProductApi = async() =>{
    try{
        const response = await fetch(Url);
        return response;
    } catch(error){
        return error;
    }
}