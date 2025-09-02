import axios from 'axios';
import Cookies from "js-cookie";
import { use, useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axios-instance';
import { format } from "date-fns";

export default function useViewReq() {
    const token = Cookies.get('access-token');
    const role = Cookies.get('role');
    const [provinceId, setProvinceId] = useState('');
    const [allProvinces, setAllProvinces] = useState([]);
    const [allRegionalManagers, setAllRegionalManagers] = useState([]);
    const [regionalManagers, setRegionalManagers] = useState([]);
    const [regionalManagersId, setRegionalManagersId] = useState('');

    const [allClinics, setAllClinics] = useState([]);
    const [clinics, setClinics] = useState([]);
    const [clinicId, setClinicId] = useState('');

    const [docName, setDocName] = useState('');

    const [allProviders, setAllProviders] = useState([]);
    const [providerId, setProviderId] = useState('');
    const [leavePlanned, setLeavePlanned] = useState([]);
    const [leaveStatus, setLeaveStatus] = useState([]);
    const [coverageNeeded, setCoverageNeeded] = useState(null);

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
        try {
            const response = await axiosInstance.get(`api/v1/upload-provinces/`);
            if (response.status === 200) {
                setAllProvinces(response?.data);
            }
        }
        catch (error) {
            console.error("Error fetching provinces:", error);
        }
        finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        if (token) {
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
        if(role === "RM" ){
            if (provinceId) {
                clinicByRegionalManager();
            }
        }
    }, [provinceId, role]);

    const getProviders = async () => {
        try {
            const response = await axiosInstance.get(`api/v1/provider-by-clinic/${clinicId}`);
            if (response.status === 200) {
                setAllProviders(response?.data?.providers)
            }
        } catch (error) {
            console.error("Error fetching providers:", error);
        }
    }
    useEffect(() => {
        if(role === "RM" || role === "PM"){
            if (clinicId) {
                getProviders();
            }
        }
    }, [clinicId, role]);

    useEffect(()=>{
        if(role === "PM" || role === "RM"){
            const data = allProviders?.filter((item) => item.user_type === docName);
            setAllClinicData(data)
        }
    }, [allProviders, docName])

    const getViewRequests = async () => {
        try {
            const params = {};
            if (providerId) params.provider_id = providerId;
            if (clinicId) params.clinic_id = clinicId;
            if (provinceId) params.province_id = provinceId;
            if (regionalManagersId) params.regional_manager = regionalManagersId;
            if (docName) params.provider_title = docName;
            if (coverageNeeded == true) params.coverage_needed = 'True';
            if (coverageNeeded == false) params.coverage_needed = 'False';
            if (startDate && endDate) {
                params.start_date = format(startDate, "yyyy-MM-dd");
                params.end_date = format(endDate, "yyyy-MM-dd");
            };
            if (leavePlanned) params.leave_type = leavePlanned;
            if (leaveStatus) params.status = leaveStatus;
            const response = await axiosInstance.get(`api/v1/get-all-leave-request/`, {
                params
            });
            if (response.status === 200) {
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
    }, [token, token, docName, providerId, clinicId, startDate, endDate, provinceId, regionalManagersId, leavePlanned, leaveStatus, coverageNeeded]);

    const [userData, setUserData] = useState({});
    const userDetail = async () => {
        const response = await axiosInstance.get(`api/v1/user-detail/`);
        if (response.status === 200) {
            setUserData(response?.data);
            setAllProvinces(response?.data?.provinces);
            setRegionalManagers(response?.data?.regional_managers);
        }
    }
    useEffect(() => {
        if (role === "PM") {
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

    // get all RM
    const hanleGetAllRM = async () => {
        try {
            const response = await axiosInstance.get(`api/v1/admin/all-users/?role=RM`);
            if (response.status === 200) {
                setAllRegionalManagers(response?.data);
                setRegionalManagers(response?.data)
            }
        } catch (error) {
            console.error("Error fetching provinces:", error);
        }
    }

    useEffect(() => {
        if(role === "LT"){
            hanleGetAllRM();
            handleGetAllClinic();
            handleGetAllProviders()
        }
    }, []);

    // get clinics
    const handleGetAllClinic = async () => {
        try {
            const response = await axiosInstance.get(`api/v1/admin/all-clinics/`);
            if (response.status === 200) {
                setAllClinics(response?.data)
                setClinics(response?.data);
            }
        } catch (error) {
            console.error("Error fetching provinces:", error);
        }
    }


    // get providers
    const handleGetAllProviders = async () => {
        try {
            const response = await axiosInstance.get(`api/v1/admin/all-users/?role=Provider`);
            if (response.status === 200) {
                setAllProviders(response?.data)
            }
        } catch (error) {
            console.log(error, "error")
        }
    }

    const filterClinicByRM = (id) => {
        const data = allClinics?.filter(
            (clinic) => clinic.regional_manager && clinic.regional_manager[0]?.id === id
        );
        setClinics(data);
    }
    const filterRMByProvince = (id) => {
        const data = allRegionalManagers?.filter(
            (rm) => rm.provinces && rm.provinces[0]?.id === id
        );
        setRegionalManagers(data);
    }

    const handleProvice = (id) => {
        if (id) {
            const data = allRegionalManagers?.filter(
                (rm) => rm.provinces && rm.provinces[0]?.id === id
            );
            setRegionalManagers(data);
            setRegionalManagersId('');
            setClinicId('');
            setDocName('');
            setProviderId('')
        } else {
            setRegionalManagers(allRegionalManagers);
        }
    }

    const handleChangeRM = (id) => {
        if (id) {
            const currentRM = regionalManagers?.find(rm => rm.id === id);
            setProvinceId(currentRM?.provinces[0]?.id);
            const data = allClinics?.filter(
                (clinic) => clinic.regional_manager && clinic.regional_manager[0]?.id === id
            );
            setClinics(data);
            setClinicId('');
            setDocName('');
            setProviderId('')
        } else {
            setClinics(allClinics);
        }
    }

    const handleChangeClinic = (id, options) => {
        if (id) {

            const currentRM = allClinics?.find(rm => rm.id === id);
            setProvinceId(currentRM?.province?.id);
            setRegionalManagersId(currentRM?.regional_manager && currentRM?.regional_manager[0]?.id);

            filterClinicByRM(currentRM?.regional_manager[0]?.id);
            filterRMByProvince(currentRM?.province?.id);
            setDocName('');
            setProviderId('')
        }
    }

    useEffect(() => {
        setAllClinicData(allProviders || []);
    }, [allProviders]);

    const handleChangeProvider = (name) => {
        if (name) {
            const data = allProviders?.filter((item) => item.user_type === name);
            setAllClinicData(data)
        }

    }

    const handleChangeProviderName = (id, options) => {
        setDocName(options?.user_type);
        setProvinceId(options?.provinces ? options?.provinces[0]?.id : "");

        const currentClinic = allClinics?.find(clinic => clinic.id === options?.clinics?.id);
        setClinicId(currentClinic?.id);
        setRegionalManagersId(currentClinic?.regional_manager[0]?.id);
        filterClinicByRM(currentClinic?.regional_manager[0]?.id);
        filterRMByProvince(currentClinic?.province?.id);
    }


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
        leaveStatus, setLeaveStatus,
        coverageNeeded, setCoverageNeeded,
        handleProvice,
        handleChangeRM,
        clinics,
        handleChangeClinic,
        handleChangeProvider,
        handleChangeProviderName
    }
}
