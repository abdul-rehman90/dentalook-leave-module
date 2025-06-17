import React, { useState } from 'react'
import Heading from '../ui/heading'
import CustomSelector from '../ui/selector'
import Input from '../ui/input'
import { Plus } from 'lucide-react'
import DateInput from '../ui/date-input'
import Button from '../ui/button'
import Canvas from './canvas'

function StepThree() {
    const [open, setOpen] = useState(false)

    const [leaveType, setLeaveType] = useState('');

    const leaveOptions = ['Dashboard', 'Calendar', 'Reports', 'Settings'];
    return (
        <div className='relative'>
            <div className="p-5 border border-[#E6EAEE] rounded-2xl mt-6">
                <div>
                    <Heading
                        title='Provider Requiring Coverage'
                        subtitle='Please complete the form below to initiate the provider requiring coverages'
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-5">
                        <div>
                            <CustomSelector
                                onChange={(value) => setLeaveType(value)}
                                label='Province'
                                options={leaveOptions}
                                placeholder="Province"
                            />
                        </div>
                        <div>
                            <CustomSelector
                                onChange={(value) => setLeaveType(value)}
                                label='Clinic'
                                options={leaveOptions}
                                placeholder="Province"
                            />
                        </div>
                        <div>
                            <Input
                                placeholder='Surya Rana'
                                label='Regional Manager'
                            />
                        </div>
                        <div>
                            <CustomSelector
                                onChange={(value) => setLeaveType(value)}
                                label='Provider Title'
                                options={leaveOptions}
                                placeholder="Province"
                            />
                        </div>
                        <Input
                            placeholder='Provider’s Name'
                            label='Provider Name'
                        />
                    </div>
                    <div className="flex flex-wrap md:flex-nowrap gap-4 w-full items-center justify-between py-4">
                        <Heading
                            title='Add Leave Details'
                        />
                        <button
                            type='button'
                            onClick={() => setOpen(true)}
                            className="rounded-xl border flex items-center px-2.5 py-2 gap-3 border-[#D0D5DD] ">
                            <Plus className="text-[#7DB02D] hidden md:block" />
                            <p>Add Provider Details</p>
                        </button>
                        <Canvas open={open} onClose={() => setOpen(false)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-2 py-5">
                        <div>
                            <DateInput
                                label='Leave Date'
                                placeholder=''
                            />
                        </div>
                        <div>
                            <CustomSelector
                                onChange={(value) => setLeaveType(value)}
                                options={leaveOptions}
                                label='Leave Type'
                                placeholder='Select' />
                        </div>
                        <div>
                            <Input
                                label='Coverage Needed'
                                placeholder='Enter Reason'
                            />
                        </div>
                        <div>
                            <Input
                                label='Coverage Provider'
                                placeholder='Enter Reason'
                            />
                        </div>
                        <div>
                            <CustomSelector
                                onChange={(value) => setLeaveType(value)}
                                options={leaveOptions}
                                label='Coverage Type'
                                placeholder='Select' />
                        </div>
                        <div>
                            <CustomSelector
                                onChange={(value) => setLeaveType(value)}
                                options={leaveOptions}
                                label='Coverage Found By'
                                placeholder='Select'
                            />
                        </div>
                        <div>
                            <DateInput />
                        </div>
                        <div>
                            <CustomSelector
                                onChange={(value) => setLeaveType(value)}
                                options={leaveOptions}
                                placeholder='Select' />
                        </div>
                        <div>
                            <Input
                                placeholder='Enter Reason'
                            />
                        </div>
                        <div>
                            <Input
                                placeholder='Enter Reason'
                            />
                        </div>
                        <div>
                            <CustomSelector
                                onChange={(value) => setLeaveType(value)}
                                options={leaveOptions}
                                placeholder='Select' />
                        </div>
                        <div>
                            <CustomSelector
                                onChange={(value) => setLeaveType(value)}
                                options={leaveOptions}
                                placeholder='Select'
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default StepThree