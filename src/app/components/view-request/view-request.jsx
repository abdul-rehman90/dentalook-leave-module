'use client'

import { useState } from "react";
import Heading from "../ui/heading";
import Button from "../ui/button";
import CustomSelector from "../ui/selector";
import Input from "../ui/input";
import DataTabel from './data-table'
import useViewReq from "./use-view-req.hook"


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
        role
    } = useViewReq();
    
    
    return (
        <div>
            <div className="p-5 border border-[#E6EAEE] rounded-2xl">
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
                                placeholder="Select Provider Title"
                                labelKey="name"
                                valueKey="id"
                                value={provinceId}
                                disabled={(role === "regional_manager" || role === "PM") ? true : false}
                                className="disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div>
                           <CustomSelector
                                onChange={(value) => {
                                    setRegionalManagersId(value);
                                }}
                                label="Regional Manager"
                                options={regionalManagers}
                                placeholder="Surya Rana"
                                labelKey="name"
                                valueKey="id"
                                value={regionalManagersId}
                                disabled={role === "regional_manager" ? true : false || provinceId ? false : true}
                                className="disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div>
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
                                disabled={role === "PM" ? true : false || provinceId ? false : true}
                                className="disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                         <div>
                            <CustomSelector
                                onChange={(value) => setDocName(value)}
                                label="Provider Title"
                                options={[{name:"DDS", value:"DDS"},{name:"RDH", value:"RDH"},{name:"RDT", value:"RDT"}]}
                                placeholder="Select Provider Name"
                                labelKey="name"
                                value={docName}
                            />
                        </div>
                        <div>
                            <CustomSelector
                                onChange={(value) => setProviderId(value)}
                                label="Provider Name"
                                options={allProviders}
                                placeholder="Select Provider Title"
                                labelKey="name"
                                valueKey="id"
                                value={providerId}
                                disabled={clinicId ? false : true}
                                className="disabled:opacity-50 disabled:cursor-not-allowed"
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