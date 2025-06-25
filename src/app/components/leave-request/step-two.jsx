import React, { useEffect, useState } from 'react'
import Heading from '../ui/heading'
import CustomSelector from '../ui/selector'
import Input from '../ui/input'
import { Plus } from 'lucide-react'
import DateInput from '../ui/date-input'
import Button from '../ui/button'
import useSteptwo from "./use-steptwo.hook"

function StepTwo() {
    const [leaveType, setLeaveType] = useState('');
    const [formData, setFormData] = useState({});

    const {getData} = useSteptwo();
    console.log(getData, "..getData")

    const [daysFields, setDaysFields] = useState([]);

    useEffect(() => {
        // If your API puts the array in getData.days
        const days = getData?.days || [];
        if (days?.length > 0) {
            // Map API fields to your form fields
            const mapped = days?.map(day => ([
                { type: 'date', label: 'Leave Date', name: 'leave_date', value: day.leave_date },
                { type: 'select', label: 'Leave Type', name: 'leave_type', options: ['emergency', 'annual', 'sick'], value: day.leave_type },
                { type: 'text', label: 'Reason', name: 'reason', placeholder: 'Reason', value: day.reason }
            ])).flat();
            setDaysFields(mapped);

            // Set initial formData
            setFormData({
                leave_date: days[0].leave_date,
                leave_type: days[0].leave_type,
                reason: days[0].reason
            });
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-5">
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
                            {daysFields.map((field, index) => (
                <div key={index}>
                    {field.type === 'text' && (
                        <Input
                            label={field.label}
                            placeholder={field.placeholder}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                        />
                    )}
                    {field.type === 'date' && (
                        // <DateInput
                        //     label={field.label}
                        //     value={formData[field.name]}
                        //     onChange={(date) => handleChange(field.name, date)}
                        // />

                        <Input
                            label={field.label}
                            placeholder={field.placeholder}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            
                        />
                    )}
                    {field.type === 'select' && (
                        <CustomSelector
                            label={field.label}
                            placeholder={field.placeholder}
                            options={field.options}
                            value={formData[field.name]}
                            onChange={(value) => handleChange(field.name, value)}
                        />
                    )}
                </div>
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
        </div>
    )
}

export default StepTwo;
