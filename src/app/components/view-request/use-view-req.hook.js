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

   const [leavePlanned, setLeavePlanned] = useState([]);
   const [leaveStatus, setLeaveStatus] = useState([]);

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
            }
        }
        catch (error) {
            console.error("Error fetching provinces:", error);
        }
    }
    useEffect(()=>{
        if(role === "RM" || role === "LT"){
            if (provinceId) {
                clinicByRegionalManager();
            }
        }
    }, [provinceId, role]);

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
        if(role === "RM" || role === "LT"){
            if (clinicId) {
                getProviders();
            }
        }
    }, [clinicId, role]);

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
                if(leavePlanned) params.leave_type = leavePlanned;
                if(leaveStatus) params.status = leaveStatus;
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
    }, [token, token, providerId, clinicId,startDate, endDate, provinceId, regionalManagersId, leavePlanned, leaveStatus]);

    const [userData, setUserData] = useState({});
    const userDetail = async () =>{
        const response = await axiosInstance.get(`api/v1/user-detail/`);
        if(response.status === 200) {
            setUserData(response?.data);
            setAllProvinces(response?.data?.provinces);
            setRegionalManagers(response?.data?.regional_managers);
        }
    }
    useEffect(()=>{
        if(role === "PM"){
            userDetail();
        }
    }, [])

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

            if(role === "PM"){
                if (userData.provinces && userData.provinces[0] && allProvinces?.length > 0) {
                    const matchedProvince = allProvinces.find(
                    (item) => item.province_name === userData.provinces[0]?.province_name
                    );
                    if (matchedProvince) {
                    setProvinceId(matchedProvince.province_id);
                    }
                }
                // =================

                if (
                userData.regional_managers && userData.regional_managers[0] &&
                    regionalManagers?.length > 0 &&
                    !regionalManagersId 
                ) {
                    const matchedManager = regionalManagers.find(
                    (item) => item.regional_manager_name === userData.regional_managers[0]?.regional_manager_name
                    );
                    if (matchedManager) {
                    setRegionalManagersId(matchedManager.regional_manager_id);
                    setAllClinics(matchedManager.clinics);
                    }
                }
                // ====================
                if (userData.regional_managers && userData.regional_managers[0]?.clinics[0]?.clinic_name && regionalManagers?.length > 0 && !clinicId) {
                    const matchedManager = allClinics?.find(
                    (item) => item.clinic_name.trim().toLowerCase() === userData.regional_managers[0]?.clinics[0].clinic_name.trim().toLowerCase()
                    );
                    if (matchedManager) {
                    setClinicId(matchedManager.clinic_id);
                    }
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
        setAllClinics,
        userData,
        leavePlanned, setLeavePlanned,
        leaveStatus, setLeaveStatus
    }
}
