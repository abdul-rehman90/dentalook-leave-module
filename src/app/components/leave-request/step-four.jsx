import React, { useState } from 'react'
import Heading from '../ui/heading'
import CustomSelector from '../ui/selector'
import Input from '../ui/input'
import { ArrowRight, Plus } from 'lucide-react'
import DateInput from '../ui/date-input'
import Button from '../ui/button'
import Link from 'next/link'

function StepFour() {
    const [leaveType, setLeaveType] = useState('');

    const leaveOptions = ['Dashboard', 'Calendar', 'Reports', 'Settings'];
    return (
        <div>
            {/* <div classN
            ame="">
                <div>
                    <Heading
                        title='Provider Requiring Coverage'
                        subtitle='Please complete the form below to initiate the provider requiring coverages'
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-5">
                        <div className='col-span-3 flex items-center gap-6'>
                            <div className='w-full'>
                                <CustomSelector
                                    onChange={(value) => setLeaveType(value)}
                                    label='Provider Title'
                                    options={leaveOptions}
                                    placeholder="Select Provider Title"
                                />
                            </div>
                            <div className='w-full'>
                                <Input
                                    placeholder='Provider’s Name'
                                    label='Provider Name'
                                />
                            </div>
                        </div>
                        <div>
                            <CustomSelector
                                onChange={(value) => setLeaveType(value)}
                                label='Province'
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
                                label='Clinic'
                                options={leaveOptions}
                                placeholder="Province"
                            />
                        </div>
                    </div>
                    <div className="flex w-full items-center justify-between py-4">
                        <Heading
                            title='Leave Details'
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2 py-5">
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
                            <CustomSelector
                                label='Coverage Needed'
                                placeholder='Enter Reason'
                                options={leaveOptions}
                                onChange={(value) => setLeaveType(value)}
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
                            <CustomSelector
                                placeholder='Enter Reason'
                                onChange={(value) => setLeaveType(value)}
                                options={leaveOptions}
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

            </div> */}


        </div>
    )
}

export default StepFour