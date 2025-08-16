import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import axiosInstance from '../../../utils/axios-instance';

export default function useSteptwo({ onNext }) {
  const router = useRouter();
  const [getData, setGetData] = useState('');
  const token = Cookies.get('access-token');
  const [isLoading, setIsLoading] = useState(false);
  const [stepId, setStepId] = useState(null);
  const [loadingButton, setLoadingButton] = useState(null);
  const [declineReq, setDeclineReq] = useState(false);
  const [multiDates, setMultiDates] = useState([{ leave_date: '' }]);

  const getLeaveDeatils = async (id) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`api/v1/leave-requests/${id}`);
      if (response.status === 200) {
        setGetData(response?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const getId = localStorage.getItem('leaveRequestId');
      setStepId(getId);
      if (getId) {
        getLeaveDeatils(getId);
      }
    }
  }, []);

  // updated status
  const handleStatus = async (data) => {
    const payload = data
      .filter((item) => item.status === 'approve')
      .map((item) => ({
        status: 'approved',
        day_id: item.id
      }));

    if (payload.length === 0) {
      toast.error('No items to approve.');
      return;
    }

    try {
      setLoadingButton(true);
      const response = await axiosInstance.patch(
        `api/v1/leave-requests/${stepId}/status/`,
        payload
      );
      if (response.status === 200) {
        toast.success(response?.data?.detail);
        onNext();
        router.replace(`${window.location.pathname}?step=3`);
      }
    } catch (error) {
      toast.error(error.response?.data?.detail);
    } finally {
      setLoadingButton(false);
    }
  };

  return {
    getData,
    isLoading,
    handleStatus,
    loadingButton,
    declineReq,
    multiDates,
    setMultiDates
  };
}
