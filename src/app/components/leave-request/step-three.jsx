import React, { useEffect, useState } from 'react';
import Heading from '../ui/heading';
import CustomSelector from '../ui/selector';
import Input from '../ui/input';
import { Plus } from 'lucide-react';
import Button from '../ui/button';
import Canvas from './canvas';
import useStepThree from './use-stepthree.hook';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Cookies from 'js-cookie';
import loader from '../../../common/assets/icons/loader.svg';
import axios from 'axios';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '../../utils/AuthContext';
import { format } from 'date-fns';
import axiosInstance from '../../../utils/axios-instance';

function StepThree({ onNext }) {
  const {
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
    regionalManagersId,
    setRegionalManagersId,
    coverageProvider,
    coverageProviderId,
    setcoverageProviderId,
    getLeaveDeatils,
    formId,
    coverageProviderList,
    providerList,
    provinceId2,
    setProvinceId2,
    regionalManagersId2,
    setRegionalManagersId2,
    setAllClinics,
    isAllSelected,
    setIsAllSelected,
    selectedRows,
    setSelectedRows
  } = useStepThree();

  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [docName, setDocName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const token = Cookies.get('access-token');
  const { userData } = useAuth();
  const searchParams = useSearchParams();
  const step = searchParams.get('step');
  const [providerTitle, setProviderTitle] = useState('');
  const [providerType, setProviderType] = useState('');
  const [coverageClinicId, setCoverageClinicId] = useState('');
  const [providerLoader, setProviderLoader] = useState(false);
  const [covergeType, setCoverageType] = useState('');
  const [appendConerageNeeded, setAppendConerageNeeded] = useState('');
  const [checkCoveringProvider, setCheckCoveringProvider] = useState(null);
  const [providerFormData, setProviderFormData] = useState({
    firstName: '',
    lastName: '',
    city: ''
  });

  const handleProviderFormChange = (e) => {
    const { name, value } = e.target;
    setProviderFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProviderFormSubmit = async (e) => {
    e.preventDefault();
    setProviderLoader(true);
    const payload = [
      {
        name: providerFormData.firstName + ' ' + providerFormData.lastName,
        ...(providerType === 'External' && {
          province_id: provinceId2,
          city: providerFormData.city
        }),
        ...(providerType === 'Internal' && {
          clinic_id: coverageClinicId,
          province_id: provinceId2
        }),
        ...(providerType === 'ACE' && { province_id: provinceId2 }),
        user_type: docName,
        provider_coverage: providerType
      }
    ];

    try {
      const response = await axiosInstance.post(
        `api/v1/provider-create/`,
        payload
      );
      if (response.status === 201) {
        toast.success(response?.data?.message);
        setOpen(false);
        providerList();
        setProviderFormData({
          firstName: '',
          lastName: '',
          city: ''
        });
        setProvinceId2('');
        setRegionalManagersId2('');
      }
    } catch (error) {
      toast.error(error.response?.data?.error);
    } finally {
      setProviderLoader(false);
    }
  };

  const providerTitleOptions = [
    { name: 'DDS', value: 'DDS' },
    { name: 'RDH', value: 'RDH' },
    { name: 'RDT', value: 'RDT' }
  ];
  const [idd, setIdd] = useState('');

  useEffect(() => {
    if (getData?.province && allProvinces?.length > 0) {
      const matchedProvince = allProvinces.find(
        (item) => item.name === getData.province
      );
      if (matchedProvince) {
        setProvinceId(matchedProvince.id);
      }
    }

    if (getData?.regional_manager && regionalManagers?.length > 0) {
      const matchedManager = regionalManagers.find(
        (item) => item.name === getData.regional_manager
      );
      setIdd(matchedManager);
      if (matchedManager) {
        setRegionalManagersId(matchedManager.id);
        setAllClinics(matchedManager.clinics);
      }
    }

    if (getData?.clinic_name && regionalManagers?.length > 0 && !clinicId) {
      const matchedManager = allClinics?.find(
        (item) => item.clinic_name === getData.clinic_name
      );
      if (matchedManager) {
        setClinicId(matchedManager.clinic_id);
      }
    }

    if (getData?.provider_name && allProviders?.length > 0) {
      const matchedManager = allProviders?.find((item) => {
        const isMatch =
          item.name.trim().toLowerCase() ===
          getData?.provider_name?.name?.trim().toLowerCase();
        return isMatch;
      });
      if (matchedManager) {
        setProviderId(matchedManager.id);
      }
    }

    if (getData?.provider_name && providerTitleOptions?.length > 0) {
      const matchedManager = providerTitleOptions?.find(
        (item) =>
          item.name?.trim().toLowerCase() ===
          getData.provider_name?.user_type?.trim().toLowerCase()
      );
      if (matchedManager) {
        setDocName(matchedManager.value);
      }
    }
    console.log( getData.days, ".. getData.days")
    if (getData?.days && getData?.days?.length > 0) {
      setRows(
        getData.days.map((row) => {
          console.log(row, "...row")
          return {
            ...row,
            coverage_needed: row.coverage_needed ? 'yes' : 'no',
            // Ensure provider is null when coverage is not needed
            coverage_provider:
              row.coverage_needed === false ? null : row.coverage_provider || null
          };
        })
      );
    }
  }, [getData, allProvinces, regionalManagers, allClinics, allProviders]);

  const handleChange = (index, field, value) => {
    const newRows = [...rows];

    if (selectedRows.length === rows.length) {
      newRows.forEach((row) => {
        row[field] = value;
        if (field === 'coverage_needed') {
          const normalized = value === true || value === 'yes' ? 'yes' : 'no';
          row.coverage_needed = normalized;
          if (normalized === 'no') {
            row.coverage_provider = null;
          }
        }
      });
    } else {
      newRows[index][field] = value;
      if (field === 'coverage_needed') {
        const normalized = value === true || value === 'yes' ? 'yes' : 'no';
        newRows[index].coverage_needed = normalized;
        if (normalized === 'no') {
          newRows[index].coverage_provider = null;
        }
      }
    }

    setRows(newRows);
  };

  const handleCheckedSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = rows?.map((row) => ({
      provider_id: row?.coverage_provider?.id,
      date: row?.leave_date
    }));
    try {
      const res = await axiosInstance.post(
        `api/v1/provider-availability/`,
        payload
      );
      if (res.status === 200) {
        if (res?.data?.unavailable_dates.length > 0) {
          toast.error(
            `Provider is unavailable on these dates. ${res?.data?.unavailable_dates
              .map((item) => item)
              .join(', ')}`
          );
          return;
        }
        handleSubmit();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error.includes(
          'provider_id and dates are required'
        )
          ? 'Covering Provider is required.'
          : error?.response?.data?.error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const paylaod = {
      leave_requests: rows?.map((row) => ({
        id: row.id,
        coverage_needed: row.coverage_needed === 'yes' ? true : false,
        ...(row.coverage_needed === 'yes' && {
          coverage_provider: row?.coverage_provider?.id,
          coverage_found_by: userData?.id
        })
      }))
    };
    try {
      const response = await axiosInstance.patch(
        `api/v1/leave-requests-update/`,
        paylaod
      );
      if (response.status === 200) {
        toast.success(response?.data?.message);
        onNext();
        router.replace(`${window.location.pathname}?step=4`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetProviderList = (item) => {
    providerList(item);
  };

  const handleRowSelect = (index, checked) => {
    const newSelected = checked
      ? [...selectedRows, index]
      : selectedRows.filter((i) => i !== index);

    setSelectedRows(newSelected);
    setIsAllSelected(newSelected.length === rows.length);
  };

  const handleBatchChange = (field, value) => {
    const updated = rows.map((row, idx) =>
      selectedRows.includes(idx) ? { ...row, [field]: value } : row
    );
    setRows(updated);
  };

  return (
    <>
      <form>
        <div className="relative">
          <div className="">
            <div>
              <Heading title="Provider Requiring Coverage" subtitle="" />
              <div className="flex flex-wrap gap-6 py-5">
                <div className="flex flex-wrap md:flex-nowrap items-center gap-6 md:w-[99%] w-full">
                  <div className="w-full md:w-[24%]">
                    <CustomSelector
                      onChange={(value) => setDocName(value)}
                      label="Provider Title"
                      options={providerTitleOptions}
                      placeholder="Select Provider Name"
                      labelKey="name"
                      value={docName || getData?.provider_type?.user_type}
                      disabled={step === '3' ? true : false}
                      className="disabled:cursor-not-allowed disabled:opacity-[0.8]"
                    />
                  </div>
                  <div className="w-full md:w-[35%]">
                    <CustomSelector
                      onChange={(value) => setProviderId(value)}
                      label="Provider Name"
                      options={allProviders}
                      placeholder="Select Provider Title"
                      labelKey="name"
                      valueKey="id"
                      value={providerId}
                      disabled={step === '3' ? true : false}
                      className="disabled:cursor-not-allowed disabled:opacity-[0.8]"
                    />
                  </div>
                </div>
                <div className="md:w-[24%] w-full">
                  <CustomSelector
                    onChange={(value) => {
                      setProvinceId(value);
                    }}
                    label="Province"
                    options={allProvinces}
                    placeholder="Select Provider Title"
                    labelKey="name"
                    valueKey="id"
                    value={provinceId || getData?.province}
                    disabled={step === '3' ? true : false}
                    className="disabled:cursor-not-allowed disabled:opacity-[0.8]"
                  />
                </div>
                <div className="md:w-[35%] w-full">
                  <CustomSelector
                    onChange={(value, options) => {
                      setRegionalManagersId(value);
                      setAllClinics(options?.clinics);
                    }}
                    label="Regional Manager"
                    options={regionalManagers}
                    placeholder="Surya Rana"
                    labelKey="name"
                    valueKey="id"
                    value={regionalManagersId}
                    disabled={step === '3' ? true : false}
                    className="disabled:cursor-not-allowed disabled:opacity-[0.8]"
                  />
                </div>
                <div className="md:w-[35%] w-full">
                  <CustomSelector
                    onChange={(value) => {
                      setClinicId(value);
                    }}
                    label="Clinic"
                    options={allClinics}
                    placeholder="Select Clinic"
                    labelKey="clinic_name"
                    valueKey="clinic_id"
                    value={clinicId}
                    disabled={step === '3' ? true : false}
                    className="disabled:cursor-not-allowed disabled:opacity-[0.8]"
                  />
                </div>
              </div>

              <div className="my-3 w-full bg-[#E6EAEE] h-[1px]" />

              <div className="flex flex-wrap md:flex-nowrap gap-4 w-full items-center justify-between py-4">
                <Heading
                  title="Secure Coverage Details"
                  subtitle="Add Coverage Details"
                />
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="rounded-xl border flex cursor-pointer items-center px-2.5 py-2 gap-3 w-full md:w-fit border-[#D0D5DD]"
                >
                  <Plus className="text-[#7DB02D] hidden md:block" />
                  <p>Add New Covering Provider Details</p>
                </button>
              </div>

              {/* Table Structure for Coverage Details */}
              <div className="relative addBorderClass">
                <div className="relative">
                  <table className="w-full">
                    <thead className="border-b-[#D9DADF] border-b border-solid">
                      <tr>
                        <th className="text-left p-1 w-[5%]">
                          <input
                            type="checkbox"
                            className="mx-2"
                            checked={
                              selectedRows.length === rows.length &&
                              rows.length > 0
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedRows(rows.map((_, idx) => idx));
                              } else {
                                setSelectedRows([]);
                              }
                            }}
                          />
                        </th>
                        <th className="text-left p-1 w-[20%] text-[13px] text-[#373940] font-semibold">
                          Leave Date
                        </th>
                        <th className="text-left p-1 w-[15%] text-[13px] text-[#373940] font-semibold">
                          Leave Type
                        </th>
                        <th className="text-left p-1 w-[15%] text-[13px] text-[#373940] font-semibold">
                          Coverage Needed
                        </th>
                        <th className="text-left p-1 w-[20%] text-[13px] text-[#373940] font-semibold">
                          Covering Provider
                        </th>
                        <th className="text-left p-1 w-[15%] text-[13px] text-[#373940] font-semibold">
                          Coverage Type
                        </th>
                        <th className="text-left p-1 w-[15%] text-[13px] text-[#373940] font-semibold">
                          Coverage Found By
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows?.map((row, index) => {
                        const isSelected = selectedRows.includes(index);
                        const isRange = row.entry_type === 'date range';
                        return (
                          <tr
                            key={index}
                            className={`${
                              index !== rows.length - 1
                                ? 'border-b border-[#E6EAEE]'
                                : ''
                            } hover:shadow-[0_2px_4px_0_rgba(60,64,67,0.1),0_2px_6px_2px_rgba(60,64,67,0.15)] hover:transition-all hover:duration-200 hover:z-10`}
                          >
                            <td className="p-1">
                              <input
                                type="checkbox"
                                className="mx-2"
                                checked={isSelected}
                                onChange={(e) =>
                                  handleRowSelect(index, e.target.checked)
                                }
                              />
                            </td>
                            <td className="p-1">
                              <DatePicker
                                disabled
                                name="leave_date"
                                minDate={new Date()}
                                dropdownMode="select"
                                selectsRange={isRange}
                                dateFormat="MMM-dd-yyyy"
                                endDate={
                                  isRange ? new Date(row.end_date) : null
                                }
                                startDate={
                                  isRange ? new Date(row.leave_date) : null
                                }
                                selected={
                                  !isRange
                                    ? row.leave_date
                                      ? new Date(row.leave_date)
                                      : null
                                    : null
                                }
                                className="py-[6px] w-full px-4 bg-white text-[#000] placeholder:text-[#1f1f1fa9] focus:outline-0 text-sm rounded-[8px] border border-[#D9DADF]"
                                onChange={(date) => {
                                  if (!isRange) {
                                    const formatted = date
                                      ? format(date, 'MMM-dd-yyyy')
                                      : '';
                                    handleChange(
                                      index,
                                      'leave_date',
                                      formatted
                                    );
                                  } else {
                                    const [start, end] = date;
                                    handleChange(
                                      index,
                                      'leave_date',
                                      start ? format(date, 'MMM-dd-yyyy') : ''
                                    );
                                    handleChange(
                                      index,
                                      'end_date',
                                      end ? format(date, 'MMM-dd-yyyy') : ''
                                    );
                                  }
                                }}
                              />
                            </td>
                            <td className="p-1">
                              <CustomSelector
                                disabled
                                options={[
                                  { name: 'Emergency', value: 'emergency' },
                                  { name: 'Planned', value: 'planned' }
                                ]}
                                placeholder="Select Leave Type"
                                value={row.leave_type}
                                onChange={(value) =>
                                  handleChange(index, 'leave_type', value)
                                }
                                labelKey="name"
                                valueKey="value"
                                className="disabled:cursor-not-allowed"
                              />
                            </td>
                            <td className="p-1">
                              <CustomSelector
                                options={[
                                  { name: 'Yes', value: 'yes' },
                                  { name: 'No', value: 'no' }
                                ]}
                                placeholder="Select Coverage Needed"
                                onChange={(value) =>
                                  handleChange(index, 'coverage_needed', value)
                                }
                                labelKey="name"
                                valueKey="value"
                                value={
                                  row.coverage_needed === true
                                    ? 'yes'
                                    : row.coverage_needed === false
                                    ? 'no'
                                    : row.coverage_needed
                                }
                                className="disabled:cursor-not-allowed disabled:opacity-[0.8]"
                              />
                            </td>
                            {console.log(typeof row.coverage_provider,"...row.coverage_provider")}
                            <td className="p-1">
                              <CustomSelector
                                options={coverageProviderList}
                                placeholder="Select Provider"
                                displayLabel={
                                  typeof row.coverage_provider === 'object' &&
                                  row.coverage_provider !== null
                                    ? row.coverage_provider.name
                                    : undefined
                                }
                                value={
                                  (typeof row.coverage_provider === 'object' &&
                                  row.coverage_provider !== null)
                                    ? row.coverage_provider.id
                                    : row.coverage_provider
                                }
                                onChange={(value, option) => {
                                  handleChange(
                                    index,
                                    'coverage_provider',
                                    option
                                  );
                                  setCoverageType(option);
                                }}
                                onOpen={() =>
                                  handleGetProviderList(row.leave_date)
                                }
                                labelKey="name"
                                valueKey="id"
                                disabled={
                                  row.coverage_needed === 'no' ||
                                  row.coverage_needed === false
                                }
                                showSearch={true}
                                className="disabled:cursor-not-allowed disabled:opacity-[0.8]"
                              />
                            </td>
                            <td className="p-1">
                              <CustomSelector
                                options={[
                                  { name: 'Internal', value: 'Internal' },
                                  { name: 'External', value: 'External' },
                                  { name: 'ACE', value: 'ACE' }
                                ]}
                                placeholder="Select Type"
                                value={
                                  typeof row.coverage_provider === 'object' &&
                                  row.coverage_provider !== null
                                    ? row.coverage_provider.provider_coverage
                                    : ''
                                }
                                onChange={(value) =>
                                  handleChange(index, 'coverage_type', value)
                                }
                                labelKey="name"
                                valueKey="value"
                                disabled={
                                  row.coverage_needed === 'no' ||
                                  row.coverage_needed === false
                                }
                                className="disabled:cursor-not-allowed disabled:opacity-[0.8]"
                              />
                            </td>
                            <td className="p-1">
                              <Input
                                placeholder="Enter Coverage"
                                name="coverage_found_by"
                                value={userData?.name}
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    'coverage_found_by',
                                    e.target.value
                                  )
                                }
                                disabled
                                className="!py-[6px] disabled:cursor-not-allowed disabled:opacity-[0.8]"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-end gap-3.5 py-4 mt-0 md:mt-5">
          <Button
            className="w-full md:!w-fit disabled:opacity-[0.8] disabled:cursor-not-allowed text-nowrap !px-6"
            disabled={isLoading}
            text={
              isLoading ? (
                <span className="flex items-center gap-2">
                  Update Leave Request Details
                  <Image src={loader} alt="loading" width={24} height={24} />
                </span>
              ) : (
                'Update Leave Request Details'
              )
            }
            bgcolor={true}
            onClick={
              isAllSelected === true && checkCoveringProvider !== null
                ? handleCheckedSubmit
                : handleSubmit
            }
            type="button"
          />
        </div>
      </form>
      <Canvas
        open={open}
        onClose={() => setOpen(false)}
        providerTitle={providerTitle}
        setProviderTitle={setProviderTitle}
        providerType={providerType}
        setProviderType={setProviderType}
        allClinics={allClinics}
        coverageClinicId={coverageClinicId}
        setCoverageClinicId={setCoverageClinicId}
        handleProviderFormChange={handleProviderFormChange}
        handleProviderFormSubmit={handleProviderFormSubmit}
        providerFormData={providerFormData}
        providerLoader={providerLoader}
        allProvinces={allProvinces}
        setProvinceId={setProvinceId}
        provinceId={provinceId}
        setRegionalManagersId={setRegionalManagersId}
        regionalManagersId={regionalManagersId}
        regionalManagers={regionalManagers}
        provinceId2={provinceId2}
        setProvinceId2={setProvinceId2}
        regionalManagersId2={regionalManagersId2}
        setRegionalManagersId2={setRegionalManagersId2}
        getData={getData}
        docName={docName}
        setDocName={setDocName}
      />
    </>
  );
}

export default StepThree;
