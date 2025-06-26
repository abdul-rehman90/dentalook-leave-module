import React, { useEffect, useState } from 'react'
import Heading from '../ui/heading'
import CustomSelector from '../ui/selector'
import Input from '../ui/input'
import { Plus } from 'lucide-react'
import DateInput from '../ui/date-input'
import Button from '../ui/button'
import useSteptwo from "./use-steptwo.hook"
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { format } from "date-fns";
import loader from "../../../common/assets/icons/blue-loader.svg"
import Image from 'next/image'

function StepTwo({onPrev, onNext}) {
    const [leaveType, setLeaveType] = useState('');
    const [formData, setFormData] = useState({});

    const {
        getData, 
        isLoading, 
        handleStatus,
        loadingButton
    } = useSteptwo({onNext});
      
    const [formData1, setFormData2] = useState([]);
    useEffect(() => {
        const days = getData?.days || [];
        if (days?.length > 0) {
            setFormData2(days.map(day => ({
                leave_date: day.leave_date,
                leave_type: day.leave_type,
                reason: day.reason
            })));
        }
    }, [getData]);


    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const rightSideSteps = [
        {
            title: '1. Verify to Payroll System',
            description: 'Check the payroll system to confirm the leave request has been submitted.'
        },
        {
            title: '2. Confirm Request Details',
            description: 'Review the amount of time requested for the leave.'
        },
        {
            title: '3. Consult with the practice manager (PM)',
            description: 'Get input from the PM regarding the impact and feasibility of the requested leave'
        },
        {
            title: '4. Evaluate Notice Period Compliance',
            description: 'Verify whether the request was submitted within the required notice period.'
        },
        {
            title: '5. Connect with the provider',
            description: 'Get in touch with the provider to understand their reason for the request'
        },
        {
            title: '6. Make the Decision',
            description: 'Approve or decline the request based on the evaluation'
        },
    ];

    const providerInfo = [
        { label: 'Provider Title', value: 'Dental Look' },
        { label: 'Provider’s Name', value: getData?.provider_name },
    ];

    const locationInfo = [
        { label: 'Province', value: getData?.province },
        { label: 'Regional Manager', value: getData?.regional_manager },
        { label: 'Clinic', value: getData?.clinic_name },
    ];

    return (
        <div className="">
            <Heading
                title='Review Leave Request'
                subtitle='Please review the leave request before taking any action'
            />
            <form> 
                          
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-5">
                    {
                        isLoading ? <Image src={loader} alt="" width={80} height={80} />  : 
                        <div className='flex justify-between flex-col h-full gap-8'>
                            <div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full justify-start">
                                    {providerInfo?.map((item, index) => (
                                        <div className='flex flex-col gap-2' key={index}>
                                            <p className='font-medium text-[#979797] text-sm'>{item.label}</p>
                                            <h2 className='font-medium text-base'>{item.value}</h2>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 justify-between w-full mt-4.5">
                                    {locationInfo.map((item, index) => (
                                        <div className='flex flex-col gap-2' key={index}>
                                            <p className='font-medium text-[#979797] text-sm'>{item.label}</p>
                                            <h2 className='font-medium text-base'>{item.value}</h2>
                                        </div>
                                    ))}
                                </div>                   
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 py-2 md:py-5">
                                    {formData1.map((day, dayIdx) => (
                                        <React.Fragment key={dayIdx}>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[13px] text-[#373940] font-medium block">Leave Date</label>
                                                <DatePicker
                                                    selected={day.leave_date ? new Date(day.leave_date) : null}
                                                    minDate={new Date()}
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    dateFormat='YYYY-MM-dd'
                                                    className='py-[8px] w-full px-4 text-[#1F1F1F] block placeholder:text-[#1f1f1fa9] focus:outline-0 text-sm rounded-xl border border-[#D9DADF]'
                                                    name="leave_date"
                                                    placeholderText="Leave Date"
                                                    onChange={date => {
                                                        const updated = [...formData1];
                                                        updated[dayIdx].leave_date = date ? format(date, "yyyy-MM-dd") : "";
                                                        setFormData2(updated);
                                                    }}
                                                />
                                            </div>
                                            <CustomSelector
                                                label="Leave Type"
                                                options={[{name:"Emergency", value:"emergency"},{name:"Planned", value:"planned"}]}
                                                value={day.leave_type}
                                                onChange={(value, option) => {
                                                    const updated = [...formData1];
                                                    updated[dayIdx].leave_type = value;
                                                    setFormData2(updated);
                                                }}
                                                labelKey="name"
                                            />
                                            
                                            <Input
                                                label="Reason"
                                                placeholder="Reason"
                                                value={day.reason}
                                                onChange={e => {
                                                    const updated = [...formData1];
                                                    updated[dayIdx].reason = e.target.value;
                                                    setFormData2(updated);
                                                }}
                                            />
                                        </React.Fragment>
                                    ))}
                                </div>

                            </div>

                            {/* <Button
                                type='button'
                                className='md:w-fit'
                                textcolor={true}
                                border={true}
                                text='Edit Request'
                            /> */}
                        </div>
                    }
                    <div className='bg-[#F8F8F8] p-4.5 rounded-xl'>
                        {rightSideSteps.map((step, index) => (
                            <div className={`mt-${index === 0 ? '0' : '5'}`} key={index}>
                                <h2 className='text-base font-medium text-[#111B2B]'>
                                    {step.title}
                                </h2>
                                <p className='text-[#67728A] text-sm'>
                                    {step.description}
                                </p>
                            </div>
                        ))}
                        <div className='mt-5 flex gap-2 items-center'>
                            <input id='check' type="checkbox" />
                            <label htmlFor='check' className='text-black font-medium text-base'>
                                I acknowledge that I’ve reviewed the above points
                            </label>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap md:flex-nowrap justify-between w-full items-center gap-3.5 md:py-4 mt-5">
                    <button
                        type='button'
                        className='w-full md:w-fit py-[6px] md:py-[11px] rounded-xl text-base text-[#335679] font-medium px-[75px] cursor-pointer border border-[#D0D5DD]'
                        onClick={() => onPrev()}
                    >
                        Edit Request
                    </button>
                    <div className='flex flex-wrap md:flex-nowrap items-center gap-2'>
                        <Button
                            text={loadingButton === 'decline' ? 'Declining...' : 'Decline Request'}
                            textcolor={true}
                            border={true}
                            onClick={()=>handleStatus("decline")}
                            type='button'
                            disabled={loadingButton !== null}
                            className='w-full md:w-fit disabled:opacity-[0.5] text-[#FF0000] border border-[#FF0000]'
                        />
                        <Button
                            text={loadingButton === 'approved' ? 'Approving...' : 'Approved Request'}
                            bgcolor={true}
                            onClick={()=>handleStatus("approved")}
                            type='button'
                            disabled={loadingButton !== null}
                            className='w-full disabled:opacity-[0.5] md:w-fit'
                        />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default StepTwo;
