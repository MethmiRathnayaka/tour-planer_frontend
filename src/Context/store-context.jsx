import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "https://tourplanerbackend-production.up.railway.app";

  // ✅ Initialize from localStorage correctly
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [list, setList] = useState([]);

  useEffect(() => {
    async function loadData() {
      await fetchList();
    }
    loadData();
  }, []);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/place/list`);
      setList(response.data.data);
      console.log(response.data.data);
    } catch (err) {
      console.error("Failed to fetch place list:", err);
    }
  };

  const contextValue = {
    list,
    url,
    token,
    setToken
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
