'use client'

import { useState } from "react";
import Heading from "../ui/heading";
import Button from "../ui/button";
import CustomSelector from "../ui/selector";
import Input from "../ui/input";
import DataTabel from './data-table'


function ViewRequest() {
    const [leaveType, setLeaveType] = useState('');

    const leaveOptions = ['Dashboard', 'Calendar', 'Reports', 'Settings'];
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
                         <div>
                            <CustomSelector
                                onChange={(value) => setLeaveType(value)}
                                label='Provider Title'
                                options={leaveOptions}
                                placeholder="Province"
                            />
                        </div>
                        <div>
                            <Input
                                placeholder='Provider’s Name'
                                label='Provider Name'
                            />
                        </div>
                       
                        
                        
                       
                        
                    </div>
                    <div className="overflow-auto">
                        <DataTabel />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ViewRequest