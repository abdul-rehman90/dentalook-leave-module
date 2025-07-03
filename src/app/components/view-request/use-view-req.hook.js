import axios from 'axios';
import Cookies from "js-cookie";
import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axios-instance';

export default function useViewReq() {
    const token = Cookies.get('access-token');
    const role = Cookies.get('role');
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
            const response = await axiosInstance.get(`api/v1/upload-provinces/`);
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
            const response = await axiosInstance.get(`api/v1/clinic-by-regional-manager/${provinceId}`);
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
            const response = await axiosInstance.get(`api/v1/provider-by-clinic/${clinicId}`);
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
                
                const response = await axiosInstance.get(`api/v1/get-all-leave-request/`, {
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

     useEffect(() => {
    
            if (role === "RM") {
                setProvinceId(allProvinces[0]?.id);
                setRegionalManagersId(regionalManagers[0]?.id);  
            }
            if (role === "PM") {
                setProvinceId(allProvinces[0]?.id);
                setRegionalManagersId(regionalManagers[0]?.id);  
                setClinicId(allClinics[0]?.clinic_id);
            }
        },[allProvinces, regionalManagers, allClinics]
    );

       
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
        isLoading,
        role
    }
}
