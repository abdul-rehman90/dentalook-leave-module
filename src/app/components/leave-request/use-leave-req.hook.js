import { useEffect, useState } from 'react'
import Cookies from "js-cookie";
import axios from 'axios';

export default function useLeaveReq() {
    const [provinceId, setProvinceId] = useState('');
    const [allProvinces, setAllProvinces] = useState([]);
    const token = Cookies.get('access-token');
    

    const [allClinics, setAllClinics] = useState([]);
    const [clinicId, setClinicId] = useState('');
    
    const [allProviders, setAllProviders] = useState([]);
    const [providerId, setProviderId] = useState('');

    const [regionalManagers, setRegionalManagers] = useState([]);
    const [regionalManagersId, setRegionalManagersId] = useState('');
    const [formId, setFormId] = useState('');

    // get province
    const getProvinces = async () => {
        try{
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/upload-provinces/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true"
                }
            });
            if(response.status === 200) {
                setAllProvinces(response?.data);
            }
        }
        catch (error) {
            console.error("Error fetching provinces:", error);
        }
    }
    useEffect(()=>{
        getProvinces();
    }, [token]);

    // get reg and clinic
    const clinicByRegionalManager = async () => {
        try{
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/clinic-by-regional-manager/${provinceId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true"
                }
            });
            if(response.status === 200) {
                setRegionalManagers(response?.data?.regional_managers);
                setAllClinics(response?.data?.regional_managers[0]?.clinics);
            }
        }
        catch (error) {
            console.error("Error fetching provinces:", error);
        }
    }
    useEffect(()=>{
        if (provinceId) {
            clinicByRegionalManager();
        }
        
    }, [provinceId]);

   
    // get providers
    const getProviders = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/provider-by-clinic/${clinicId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true"
                }
            });
            if(response.status === 200) {
                setAllProviders(response?.data?.providers)
            }
        } catch (error) {
            console.error("Error fetching providers:", error);
        }
    }
    useEffect(() => {
        if (clinicId) {
            getProviders();
        }
    }, [clinicId]);


    const [rows, setRows] = useState([
        { leave_date: '', leave_type:'', reason: '' }
    ]);

    // get patch method for update step 1
    const [getData, setGetData] = useState('');
    const getLeaveDeatils = async (id) => {
        // setIsLoading(true);
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
        finally{
        // setIsLoading(false);
        }
    };
    useEffect(() => {
        if (typeof window !== "undefined") {
            const getId = localStorage.getItem("leaveRequestId");
            setFormId(getId);
            if (getId) {
                getLeaveDeatils(getId);
            }
        }
    }, []);

   
        

    return {
        allProvinces,
        setProvinceId,
        setClinicId,
        allClinics,
        clinicId,
        allProviders,
        rows, 
        setRows,
        providerId, 
        setProviderId,
        provinceId,
        getData,
        regionalManagers,
        regionalManagersId, setRegionalManagersId,
        formId
    }
}
