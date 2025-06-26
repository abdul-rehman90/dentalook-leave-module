import React, { useEffect, useState } from 'react'
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

    // get clinic
    const getClinics = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/province-data/${provinceId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true"
                }
            });
            if(response.status === 200) {
               setAllClinics(response?.data?.clinics);
            }
        } catch (error) {
            console.error("Error fetching clinics:", error);
        }
    }
    useEffect(() => {
        if (provinceId) {
            getClinics();
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
        provinceId
    }
}
