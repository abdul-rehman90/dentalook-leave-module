import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function useSteptwo() {
  const [getData, setGetData] = useState('');
  const token = Cookies.get('access-token');
  const getLeaveDeatils = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/leave-requests/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      if (response.status === 200) {
        setGetData(response?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      const getId = localStorage.getItem("leaveRequestId");
      if (getId) {
        getLeaveDeatils(getId);
      }
    }

  }, []);

  return {
    getData,
  };
}
