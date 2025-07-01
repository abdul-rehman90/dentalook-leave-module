import axios from 'axios';
import Cookies from "js-cookie";
import { useEffect, useState } from 'react';

export default function viewReq() {
    const token = Cookies.get('access-token');
    const [provinceId, setProvinceId] = useState('');
    const [allProvinces, setAllProvinces] = useState([]);

    const [regionalManagers, setRegionalManagers] = useState([]);
    const [regionalManagersId, setRegionalManagersId] = useState('');

    const [allClinics, setAllClinics] = useState([]);
    const [clinicId, setClinicId] = useState('');

    const [docName, setDocName] = useState('');

    const [allProviders, setAllProviders] = useState([]);
    const [providerId, setProviderId] = useState('');

    const [getReqData, setGetReqData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getProvinces = async () => {
        setIsLoading(true);
        try{
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/upload-provinces/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if(response.status === 200) {
                setAllProvinces(response?.data);
            }
        }
        catch (error) {
            console.error("Error fetching provinces:", error);
        }
        finally{
            setIsLoading(false);
        }
    }
    useEffect(()=>{
        if(token){
            getProvinces();
        }
    }, [token]);


    // get reg and clinic
    const clinicByRegionalManager = async () => {
        try{
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/clinic-by-regional-manager/${provinceId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
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

    const getViewRequests = async () => {
        try {
                const params = {};
                if (providerId) params.provider_id = providerId;
                if (clinicId) params.clinic_id = clinicId;
                if (provinceId) params.province_id = provinceId;
                if (regionalManagersId) params.regional_manager = regionalManagersId;
                
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/get-all-leave-request/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params
            });
            if(response.status === 200) {
               setGetReqData(response.data)
            }
        } catch (error) {
            console.error("Error fetching view requests:", error);
        }
    }
    useEffect(() => {
        if (token) {
            getViewRequests();
        }
    }, [token, token, providerId, clinicId, provinceId, regionalManagersId]);

       
    return {
        provinceId, 
        setProvinceId,
        allProvinces,
        clinicId, 
        setClinicId,
        allClinics,
        regionalManagers,
        regionalManagersId, 
        setRegionalManagersId,
        docName, 
        setDocName,
        allProviders,
        providerId, 
        setProviderId,
        getReqData,
        isLoading
    }
}
