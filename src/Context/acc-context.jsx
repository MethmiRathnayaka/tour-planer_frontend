import { createContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
export const AccContext = createContext(null)

const AccContextProvider = (props) =>{

    const url ="http://localhost:4000"
    const [token, setToken] = useState(""); // Use empty string for consistency
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
        const response = await axios.get(url+"/api/accomedation/list");
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
        <AccContext.Provider value={contextValue}>
            {props.children}
        </AccContext.Provider>
    )
}
export default AccContextProvider