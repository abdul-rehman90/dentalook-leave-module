import axios from 'axios';
import Cookies from "js-cookie";
import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axios-instance';
import { format } from "date-fns";

export default function useViewReq() {
    const token = Cookies.get('access-token');
    const role = Cookies.get('role');
    const [provinceId, setProvinceId] = useState('');
    const [allProvinces, setAllProvinces] = useState([]);

    const [regionalManagers, setRegionalManagers] = useState([]);
    const [regionalManagersId, setRegionalManagersId] = useState('');
    
    const [allClinics, setAllClinics] = useState([]);
    const [clinicId, setClinicId] = useState('');
    // console.log(regionalManagers, "...allClinics")
    const [docName, setDocName] = useState('');

    const [allProviders, setAllProviders] = useState([]);
    const [providerId, setProviderId] = useState('');

    const [getReqData, setGetReqData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [allClicnicData, setAllClinicData] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const handleDateChange = (update) => {
        const [start, end] = update || [];
        const formattedStart = start ? format(start, "yyyy-MM-dd") : "";
        const formattedEnd = end ? format(end, "yyyy-MM-dd") : "";
        console.log("start_Date=", formattedStart, "end_Date=", formattedEnd);
    };

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
                // setAllClinics(response?.data?.regional_managers?.clinics);
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

    useEffect(()=>{
        const data = allProviders?.filter((item) => item.user_type === docName);
        setAllClinicData(data)
    }, [allProviders, docName])

    const getViewRequests = async () => {
        try {
                const params = {};
                if (providerId) params.provider_id = providerId;
                if (clinicId) params.clinic_id = clinicId;
                if (provinceId) params.province_id = provinceId;
                if (regionalManagersId) params.regional_manager = regionalManagersId;
                if (startDate && endDate) {
                    params.start_date = format(startDate, "yyyy-MM-dd");
                    params.end_date = format(endDate, "yyyy-MM-dd");
                };
                // if (endDate) params.end_date = format(endDate, "yyyy-MM-dd");
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
    }, [token, token, providerId, clinicId,startDate, endDate, provinceId, regionalManagersId]);

     useEffect(() => {
    
            if (role === "RM") {
                setProvinceId(allProvinces[0]?.id);
                if(typeof window !== "undefined"){
                    const userData = JSON.parse(localStorage.getItem('userData'));
                    if(userData) {
                        setRegionalManagersId(userData?.id);
                        const rmObj = regionalManagers?.find(rm => rm.id === userData?.id);
                        if (rmObj && rmObj.clinics) {
                            setAllClinics(rmObj.clinics);
                        }
                    }
                }
            }
            if (role === "PM") {
                setProvinceId(allProvinces[0]?.id);
                setRegionalManagersId(regionalManagers[0]?.id);  
                if(regionalManagers[0]?.clinics && regionalManagers[0]?.clinics.length > 0){
                    setAllClinics(regionalManagers[0]?.clinics);
                    setClinicId(regionalManagers[0]?.clinics[0]?.clinic_id);
                }
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
        role,
        allClicnicData,
        handleDateChange,
        startDate, endDate,
        setDateRange,
        setAllClinics
    }
}
