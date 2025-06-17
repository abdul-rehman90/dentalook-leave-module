'use client'
import React, { useState } from 'react'
import Heading from '../ui/heading'
import CustomSelector from '../ui/selector'
import Input from '../ui/input'
import { Plus } from 'lucide-react'
import DateInput from '../ui/date-input'
import Button from '../ui/button'

function StepOne() {
    const [leaveType, setLeaveType] = useState('')
    return (
        <div>
            <div className="p-5 border border-[#E6EAEE] rounded-2xl mt-6">
                <div>
                    <Heading
                        title='New Provider Leave Request Form'
                        subtitle='Please complete the form below to initiate the provider leave request process'
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-5">
                        <div>
                            <CustomSelector
                                onChange={(value) => setLeaveType(value)}
                                label='Proince'
                                options={['Dashboard', 'Calendar', 'Reports', 'Settings']}
                                placeholder="Province"
                            />
                        </div>
                        <div>
                            <CustomSelector
                                onChange={(value) => setLeaveType(value)}
                                label='Clinic'
                                options={['Dashboard', 'Calendar', 'Reports', 'Settings']}
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
                                options={['Dashboard', 'Calendar', 'Reports', 'Settings']}
                                placeholder="Province"
                            />
                        </div>
                        <Input
                            placeholder='Provider’s Name'
                            label='Provider Name'
                        />
                    </div>
                    <div className="flex w-full items-center justify-between py-5">
                        <Heading
                            title='Add Leave Details'
                        />
                        <div className="p-2 rounded-xl border border-[#D0D5DD] ">
                            <Plus className="text-[#7DB02D]" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-5">
                        <div>
                            <DateInput
                                label='Leave Date'
                            />
                        </div>
                        <div>
                            <CustomSelector
                                onChange={(value) => setLeaveType(value)}
                                label='Leave Type'
                                options={['Dashboard', 'Calendar', 'Reports', 'Settings']}
                                placeholder="Province"
                            />
                        </div>
                        <div>
                            <Input
                                placeholder='Enter Reason'
                                label='Reason'
                            />
                        </div>
                        <div>
                            <DateInput
                                label=''
                            />
                        </div>
                        <div>
                            <CustomSelector
                                onChange={(value) => setLeaveType(value)}
                                label=''
                                options={['Dashboard', 'Calendar', 'Reports', 'Settings']}
                                placeholder="Province"
                            />
                        </div>
                        <div>
                            <Input
                                placeholder='Enter Reason'
                                label=''
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default StepOne