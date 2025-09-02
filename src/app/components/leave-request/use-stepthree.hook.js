import React, { useEffect, useState } from 'react'
import Cookies from "js-cookie";
import axios from 'axios';
import axiosInstance from '../../../utils/axios-instance';
import { useSearchParams } from 'next/navigation';

export default function useStepThree() {
    const [provinceId, setProvinceId] = useState('');
    const [allProvinces, setAllProvinces] = useState([]);
    const token = Cookies.get('access-token');

    const [provinceId2, setProvinceId2] = useState('');    

    const [allClinics, setAllClinics] = useState([]);
    const [clinicId, setClinicId] = useState('');
    
    const [allProviders, setAllProviders] = useState([]);
    const [providerId, setProviderId] = useState('');
    const [coverageProvider, setCoverageProvider] = useState([]);
    const [coverageProviderId, setcoverageProviderId] = useState('');

    const [regionalManagers, setRegionalManagers] = useState([]);
    const [regionalManagersId, setRegionalManagersId] = useState('');
    const [regionalManagersId2, setRegionalManagersId2] = useState('');
    const [formId, setFormId] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [getDataLoader, setGetDataLoader]= useState(false);

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
        getProvinces();
    }, [token]);

    // get reg and clinic
    const clinicByRegionalManager = async () => {
        try{
            const response = await axiosInstance.get(`api/v1/clinic-by-regional-manager/${provinceId2 ? provinceId2 : provinceId}`);
            if(response.status === 200) {
                setRegionalManagers(response?.data?.regional_managers);
                // setAllClinics(response?.data?.regional_managers[0]?.clinics);
            }
        }
        catch (error) {
            console.error("Error fetching provinces:", error);
        }
    }
    useEffect(()=>{
        if (provinceId) {
            clinicByRegionalManager();
        }else if(provinceId2){
            clinicByRegionalManager();
        }
        
    }, [provinceId, provinceId2]);

   
    // get providers
    const getProviders = async () => {
        try {
            const response = await axiosInstance.get(`api/v1/provider-by-clinic/${clinicId}`);
            if(response.status === 200) {
                setAllProviders(response?.data?.providers);
                setCoverageProvider(response?.data?.providers);

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
        { leave_date: '', leave_type:'', reason: '', coverage_needed: '', coverage_provider:''}
    ]);

    // get patch method for update step 1
    const [getData, setGetData] = useState('');
    const getLeaveDeatils = async (id) => {
        setGetDataLoader(true);
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
        setGetDataLoader(false);
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

    const [coverageProviderList, setCoverageProviderList] = useState([]);

    // const providerList = async (item) => {
    //     try {
    //         const response = await
    //         axiosInstance.get(`api/v1/provider-list/?provider_title=${getData?.provider_name?.user_type}&date=${item}`);
    //         if(response.status === 200) {
    //             setCoverageProviderList(response?.data)
    //         }
    //     } catch (error) {
    //         console.error("Error fetching coverage providers:", error);
    //     }
    // }

    const providerList = async (item) => {
        try {
            let url = "api/v1/provider-list/";
            if (item) {
            let providerType = getData?.provider_name?.user_type;

            if (providerType === "RDH" || providerType === "DDS") {
                providerType = "RDH,DDS";
            } else if (providerType === "RDT") {
                providerType = "RDT";
            }

            url += `?provider_title=${providerType}&date=${item}`;
            }

            const response = await axiosInstance.get(url);

            if (response.status === 200) {
            setCoverageProviderList(response.data);
            }
        } catch (error) {
            console.error("Error fetching coverage providers:", error);
        }
    };


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
        coverageProvider,
        coverageProviderId, setcoverageProviderId,
        getLeaveDeatils,
        coverageProviderList,
        providerList,
        provinceId2, setProvinceId2,
        regionalManagersId2, setRegionalManagersId2,
        setAllClinics,
        isAllSelected, setIsAllSelected,
        selectedRows, setSelectedRows,
        getDataLoader
    }
}
