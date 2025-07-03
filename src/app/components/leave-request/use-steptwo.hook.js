import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axiosInstance from "../../../utils/axios-instance";

export default function useSteptwo({onNext}) {
  const router = useRouter();
  const [getData, setGetData] = useState('');
  const token = Cookies.get('access-token');
  const [isLoading, setIsLoading] = useState(false);
  const [stepId, setStepId] = useState(null);
  const [loadingButton, setLoadingButton] = useState(null);
  const [declineReq, setDeclineReq] = useState(false);
  const getLeaveDeatils = async (id) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `api/v1/leave-requests/${id}`
      );
      if (response.status === 200) {
        setGetData(response?.data);
      }
    } catch (error) {
      console.log(error);
    }
    finally{
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      const getId = localStorage.getItem("leaveRequestId");
      setStepId(getId);
      if (getId) {
        getLeaveDeatils(getId);
      }
    }

  }, []);

  // updated status
  const handleStatus = async (buttonName) =>{
    setLoadingButton(buttonName);
    const payload = {
      status: buttonName
    }
    try{
      const response = await axiosInstance.patch(`api/v1/leave-requests/${stepId}/status/`, payload);
      if(response.status === 200){
        
       toast.success(response?.data?.detail);
        if(buttonName === 'approved'){
          onNext();
          router.replace(`${window.location.pathname}?step=3`);
        }
        if(buttonName === 'decline'){
          setDeclineReq(true);
        }
      }
    }
    catch(error){
      toast.error(error.response?.data?.detail)
    }
    finally {
      setLoadingButton(null); 
    }

  }

  return {
    getData,
    isLoading,
    handleStatus,
    loadingButton,
    declineReq
  };
}
