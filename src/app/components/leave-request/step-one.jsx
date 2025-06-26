"use client";
import React, { useEffect, useState } from "react";
import Heading from "../ui/heading";
import CustomSelector from "../ui/selector";
import Input from "../ui/input";
import { Plus } from "lucide-react";
import useLeaveReq from "./use-leave-req.hook";
import Button from "../ui/button";
import axios from "axios";
import Cookies from "js-cookie";
import loading from "../../../common/assets/icons/loader.svg"
import Image from "next/image";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import toast from "react-hot-toast";
import { format } from "date-fns";

function StepOne({ onSubmit, onNext }) {
    const [leaveType, setLeaveType] = useState("");
    const token = Cookies.get('access-token');
    const [isLoading, setIsLoading] = useState(false);
    const [docName, setDocName] = useState('');
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
        provinceId
    } = useLeaveReq();

    const [regVlaue, setRegValue] = useState("");
    useEffect(() => {
        if (clinicId) {
            const data = allClinics?.find((item) => item.clinic_id === clinicId);
            setRegValue(data?.regional_managers?.[0]?.name || "");
        }
    }, [clinicId, allClinics]);

    // Update field values
    const handleChange = (index, field, value) => {
        const newRows = [...rows];
        newRows[index][field] = value;
        setRows(newRows);
    };

    const handleAddRow = () => {
        setRows([...rows, { leave_date: "", leave_type: "", reason: "" }]);
    };
    const lastRow = rows[rows.length - 1];
    const canAddRow = lastRow.leave_date && lastRow.leave_type && lastRow.reason;
    const handleSubmit = async (e) =>{
        e.preventDefault();
        setIsLoading(true);
        const paylaod = {
            clinic:clinicId,
            provider: providerId,
            leave_requests: rows?.map(row => ({
                leave_date: row.leave_date,
                leave_type: row.leave_type,
                reason: row.reason
            }))
        }
        try{
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/leave-requests/`, paylaod, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true"
                }
            });
            if(response.status === 201){
                localStorage.setItem("leaveRequestId", response.data?.id);
                onNext()
            }
        }
        catch(error){
            const errors = error?.response?.data?.leave_requests;
            if (Array.isArray(errors)) {
                errors.forEach(errObj => {
                    Object.values(errObj).forEach(msgArr => {
                        if (Array.isArray(msgArr)) {
                            msgArr.forEach(msg => toast.error(msg));
                        } else {
                            toast.error(msgArr);
                        }
                    });
                });
            } else {
                toast.error("An error occurred");
            }
        }
        finally{
            setIsLoading(false);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className=" rounded-2xl">
                    <div>
                    <Heading
                        title="New Provider Leave Request Form"
                        subtitle="Please complete the form below to initiate the provider leave request process"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-5">
                         <div className="col-span-3 flex flex-wrap md:flex-nowrap items-center gap-6">
                        <div className="w-full">
                            <CustomSelector
                                onChange={(value) => setDocName(value)}
                                label="Provider Name"
                                options={[{name:"DDS", value:"DDS"},{name:"RDH", value:"RDH"},{name:"RDT", value:"RDT"}]}
                                placeholder="Select Provider Name"
                                labelKey="name"
                                value={docName}
                            />
                        </div>
                        <div className="w-full">
                            <CustomSelector
                                onChange={(value) => setProviderId(value)}
                                label="Provider Title"
                                options={allProviders}
                                placeholder="Select Provider Title"
                                labelKey="name"
                                valueKey="id"
                                value={providerId}
                            />
                        </div>
                        </div>
                        <div className="col-span-3 md:col-span-1">
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
                        />
                        </div>
                        <div className="col-span-3 md:col-span-1">
                        <CustomSelector
                            onChange={(value) => {
                                setClinicId(value);
                            }}
                            label="Clinic"
                            options={allClinics}
                            placeholder="Province"
                            labelKey="clinic_name"
                            valueKey="clinic_id"
                            value={clinicId}
                        />
                        </div>
                        <div className="col-span-3 md:col-span-1">
                            <Input
                                placeholder="Surya Rana"
                                label="Regional Manager"
                                value={regVlaue}
                                onChange={(e) => console.log(e.target.value)}
                                readOnly
                                className="cursor-not-allowed"
                            />
                        </div>

                       
                    </div>
                   
                    {/* Plus Button */}
                    <div className="flex w-full items-center justify-between py-5">
                        <Heading
                            title='Add Leave Details'
                        />
                        <div className="p-2 rounded-xl border border-[#D0D5DD] ">
                            <Plus 
                                className={`${canAddRow ? 'cursor-pointer' : 'cursor-not-allowed'} text-[#7DB02D]`}                               
                                onClick={canAddRow ? handleAddRow : undefined}
                            />
                        </div>
                    </div>
                
                    <div>
                        {rows?.map((row, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-5"
                        >
                            <div className="flex flex-col gap-2">
                               
                                <label className="text-[13px] text-[#373940] font-medium block">Leave Date</label>
                                <DatePicker
                                    selected={row.leave_date ? new Date(row.leave_date) : null}
                                    minDate={new Date()}
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    dateFormat='YYYY-MM-dd'
                                    className='py-[8px] w-full px-4 text-[#1F1F1F] block placeholder:text-[#1f1f1fa9] focus:outline-0 text-sm rounded-xl border border-[#D9DADF]'
                                    name="leave_date"
                                    onChange={(date) => {
                                        const formatted = date ? format(date, "yyyy-MM-dd") : "";
                                        handleChange(index, "leave_date", formatted);
                                    }}
                                />
                               
                            </div>
                            <div>
                                <CustomSelector
                                    label="Leave Type"
                                    options={[{name:"Emergency", value:"emergency"},{name:"Planned", value:"planned"}]}
                                    placeholder="Select Leave Type"
                                    value={row.leave_type}
                                    onChange={(value) => handleChange(index, "leave_type", value)}
                                    labelKey="name"
                                    valueKey="value"
                                />
                            </div>
                            <div>
                                <Input
                                    label="Reason"
                                    placeholder="Enter Reason"
                                    name="reason"
                                    value={row.reason}
                                    onChange={(e) =>handleChange(index, "reason", e.target.value)}
                                />
                            </div>
                        </div>
                        ))}
                    </div>
                    </div>

                    <div className="flex justify-end gap-3.5 py-4 mt-0 md:mt-5">
                        <Button
                            text={isLoading ? <Image src={loading} alt="loading" width={24} height={24} /> : "Submit"}
                            bgcolor={true}
                            disabled={isLoading}
                            className="disabled:opacity-[0.5] disabled:cursor-not-allowed"
                            type="submit"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default StepOne;
