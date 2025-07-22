import { useEffect, useState } from 'react'
import Cookies from "js-cookie";
import axios from 'axios';
import axiosInstance from '../../../utils/axios-instance';

export default function useLeaveReq() {
    const [provinceId, setProvinceId] = useState('');
    const [allProvinces, setAllProvinces] = useState([]);
    const token = Cookies.get('access-token');
    const role = Cookies.get('role');

    const [allClinics, setAllClinics] = useState([]);
    const [clinicId, setClinicId] = useState('');
    const [clinics, setClinics] = useState([]);
    const [allProviders, setAllProviders] = useState([]);
    const [providerId, setProviderId] = useState('');
    const [allRegionalManagers, setAllRegionalManagers] = useState([]);
    const [regionalManagers, setRegionalManagers] = useState([]);
    const [regionalManagersId, setRegionalManagersId] = useState('');
    const [formId, setFormId] = useState('');

    const [allClicnicData, setAllClinicData] = useState([]);

    const [docName, setDocName] = useState('');

    // get province
    const getProvinces = async () => {
        try{
            const response = await axiosInstance.get(`api/v1/upload-provinces/`);
            if(response.status === 200) {
                setAllProvinces(response?.data);
            }
        }
        catch (error) {
            console.error("Error fetching provinces:", error);
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
        if(role === "RM"){
            if (provinceId) {
                clinicByRegionalManager();
            }   
        }
    }, [provinceId]);

   
    // get providers
    // const getProviders = async () => {
    //     try {
    //         const response = await axiosInstance.get(`api/v1/provider-by-clinic/${clinicId}`);
    //         if(response.status === 200) {
    //             setAllProviders(response?.data?.providers)
    //         }
    //     } catch (error) {
    //         console.error("Error fetching providers:", error);
    //     }
    // }
    // useEffect(() => {
    //     if (clinicId) {
    //         getProviders();
    //     }
    // }, [clinicId]);

    useEffect(()=>{
        if(role === "PM" || role === "RM"){
            const data = allProviders?.filter((item) => item.user_type === docName);
            setAllClinicData(data)
        }
        
    }, [allProviders, docName])


    const [rows, setRows] = useState([
        { leave_date: '', leave_type:'', reason: '' }
    ]);

    // get patch method for update step 1
    const [getData, setGetData] = useState('');
    const getLeaveDeatils = async (id) => {
        // setIsLoading(true);
        try {
        const response = await axiosInstance.get(`api/v1/leave-requests/${id}`);
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
        formId,
        allClicnicData,
        docName, setDocName,
        setAllClinics,
        userData,
        handleProvice,
        handleChangeRM,
        clinics,
        handleChangeClinic,
        handleChangeProvider,
        handleChangeProviderName
    }
}
