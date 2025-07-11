import { createContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
export const StoreContext = createContext(null)

const StoreContextProvider = (props) =>{

    const url ="https://tourplanerbackend-production.up.railway.app"
    const [token,setToken] = useState({});
    const [list,setList] = useState([]);
    useEffect(()=>{
        
        async function loadData(){
            await fetchList();
            if (localStorage.getItem("token")){
                setToken(localStorage.getItem("token"));
            }
        }
        loadData();
    },[])

    const fetchList = async ()=>{
        const response = await axios.get(url+"/api/place/list");
        setList(response.data.data)
        console.log(response.data.data)
    }
    const contextValue={
        list,
        url,
        token,
        setToken
        
    }
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}
export default StoreContextProvider