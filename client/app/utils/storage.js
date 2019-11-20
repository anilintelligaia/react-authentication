export function getFromStorage(key){
    if(!key){
        return null;
    }

    try {
        valueStr= localStorage.getItem(key);
        if(valueStr){
            return JSON.parse(valueStr)
        }
        return null;

    } catch (err) {
        return null;
    }
}

export function setInStorage(key,obj){
    if(!key){
        console.error('Error: Key is missing');
    }
    try {
        localStorage.getItem(key,JSON.stringify(obj))

    } catch (error) {
        console.error(error);
    }
}