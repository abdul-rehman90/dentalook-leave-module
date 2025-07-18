'use client'

import { useState } from "react";
import Heading from "../ui/heading";
import Button from "../ui/button";
import CustomSelector from "../ui/selector";
import Input from "../ui/input";
import DataTabel from './data-table'
import useViewReq from "./use-view-req.hook"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import loading from "../../../common/assets/icons/loader.svg"

function ViewRequest() {
    const {
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
        leavePlanned, setLeavePlanned,
        leaveStatus, setLeaveStatus
    } = useViewReq();
    const [filterLoader, setFilterLoader] = useState(false);
    const handleClearFilter = () => {
        setFilterLoader(true);
        if (role === "LT") {
            setProvinceId('');
            setRegionalManagersId('');
            setClinicId('');
            setAllClinics([]);
            setDocName('');
            setProviderId('');
            setLeaveStatus('');
            setLeavePlanned(''); 
            setDateRange([null, null]);
        } else if (role === "RM") {
            setClinicId('');
            setAllClinics([]);
            setDocName('');
            setProviderId('');
            setLeaveStatus('');
            setLeavePlanned('');
            setDateRange([null, null]);
        } else if(role === "PM"){
            setDocName('');
            setProviderId('');
            setLeaveStatus('');
            setLeavePlanned('');
            setDateRange([null, null]);
        }
        setTimeout(() => {
            setFilterLoader(false);
        }, 1000);
    };

 
    return (
        <div>
            <div className="p-5 border border-[#E6EAEE] rounded-2xl mt-2 w-full max-w-[1230px] mx-auto">
                <div>
                    <div className="flex items-start flex-wrap md:flex-nowrap justify-between gap-4 w-full">
                        <Heading
                            title='View all Leave Requests here'
                            subtitle='Review all the leave requests submitted here'
                        />
                       
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-5">
                        <div>
                            <CustomSelector
                                onChange={(value) => {
                                    setProvinceId(value);
                                }}
                                label="Province"
                                options={allProvinces}
                                placeholder="Select Province"
                                labelKey={role === "PM" ? "province_name" : "name"}
                                valueKey={role === "PM" ? "province_id" : "id"}
                                value={provinceId}
                                disabled={(role === "RM" || role === "PM") ? true : false}
                                className="disabled:opacity-[0.8] disabled:cursor-not-allowed"
                            />
                        </div>
                        <div>
                           <CustomSelector
                                onChange={(value, options) => {
                                    setRegionalManagersId(value); 
                                    setAllClinics(options?.clinics)
                                }}
                                label="Regional Manager"
                                options={regionalManagers}
                                placeholder="Select Regional Manager"
                                labelKey={role === "PM" ? "regional_manager_name" : "name"}
                                valueKey={role === "PM" ? "regional_manager_id" : "id"}
                                value={regionalManagersId}
                                disabled={role === "RM" || role === "PM" ? true : false || provinceId ? false : true}
                                className="disabled:opacity-[0.8] disabled:cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <CustomSelector
                                onChange={(value) => {
                                    setClinicId(value);
                                    setDocName("");
                                }}
                                label="Clinic"
                                options={allClinics}
                                placeholder="Select Clinic"
                                labelKey="clinic_name"
                                valueKey="clinic_id"
                                value={clinicId}
                                disabled={role === "PM" ? true : false || provinceId ? false : true}
                                className="disabled:opacity-[0.8] disabled:cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <CustomSelector
                                onChange={(value) => setDocName(value)}
                                label="Provider Title"
                                options={[{name:"DDS", value:"DDS"},{name:"RDH", value:"RDH"},{name:"RDT", value:"RDT"}]}
                                placeholder="Select Provider Title"
                                labelKey="name"
                                value={docName}
                                disabled={clinicId ? false : true }
                                className="disabled:opacity-[0.8] disabled:cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <CustomSelector
                                onChange={(value) => setProviderId(value)}
                                label="Provider Name"
                                options={allClicnicData}
                                placeholder="Select Provider Name"
                                labelKey="name"
                                valueKey="id"
                                value={providerId}
                                disabled={docName ? false : true}
                                className="disabled:opacity-[0.8] disabled:cursor-not-allowed"
                            />
                        </div>
                        <div className="request_Datepicker">
                            <label className='text-[13px] mb-2 block font-semibold text-[#373940]'>Leave Request Date</label>
                            <DatePicker
                                selectsRange={true}
                                startDate={startDate}
                                endDate={endDate}
                                dateFormat="yyyy-MM-dd"
                                onChange={(update) => {
                                    setDateRange(update);
                                    handleDateChange(update);
                                }}
                                isClearable={true}
                                className="w-full flex rounded-[8px] items-center justify-between bg-transparent border border-[#D9DADF] px-4 py-2 text-sm font-medium focus:outline-none text-[#1F1F1F]"
                            />
                        </div>
                        <div>
                            <CustomSelector
                                label="Leave Type"
                                options={[
                                    { name: 'Emergency', value: 'emergency' },
                                    { name: 'Planned', value: 'planned' }
                                ]}
                                placeholder="Select Leave Type"
                                labelKey="name"
                                valueKey="value"
                                value={leavePlanned}
                                onChange={(value) => setLeavePlanned(value)}
                            />
                        </div>
                        <div>
                            <CustomSelector
                                label="Status"
                                options={[
                                    { name: 'Pending', value: 'pending' },
                                    { name: 'Declined', value: 'decline' },
                                    { name: 'Approved', value: 'approved' }
                                ]}
                                placeholder="Select Status"
                                labelKey="name"
                                valueKey="value"
                                value={leaveStatus}
                                onChange={(value) => setLeaveStatus(value)}
                            />
                        </div>
                        <div className="flex items-end">
                            <Button
                                // text="Clear filters"
                                text={
                                    filterLoader ? (
                                        <Image src={loading} alt="loading" width={24} height={24} />
                                    ) : (
                                        'Clear filters'
                                    )
                                    }
                                bgcolor={true}
                                type="button"
                                disabled={filterLoader}
                                onClick={handleClearFilter}
                                className="disabled:opacity-[0.8] disabled:cursor-not-allowed"
                            />
                        </div>
                       
                    </div>
                    <div className="overflow-auto">
                        <DataTabel getReqData={getReqData} isLoading={isLoading} />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ViewRequest