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
        setAllClinics
    } = useViewReq();

   
    
    return (
        <div>
            <div className="p-5 border border-[#E6EAEE] rounded-2xl mt-2">
                <div>
                    <div className="flex items-start flex-wrap md:flex-nowrap justify-between gap-4 w-full">
                        <Heading
                            title='Provider Requiring Coverage'
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
                                labelKey="name"
                                valueKey="id"
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
                                labelKey="name"
                                valueKey="id"
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
                            <label className='text-[13px] mb-2 block font-medium text-[#373940]'>Leave Request Date</label>
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
                                className="w-full flex items-center justify-between bg-transparent border border-[#D9DADF] rounded-xl px-4 py-2 text-sm font-medium focus:outline-none text-[#1F1F1F]"
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