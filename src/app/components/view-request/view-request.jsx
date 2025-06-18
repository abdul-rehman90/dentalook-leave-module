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
                        <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-end gap-3.5">
                            <Button
                                className='!text-[#335679] w-full md:!w-fit text-nowrap !px-6'
                                text='Add Leave Days'
                                textcolor={true}
                                border={true}
                                // onClick={() => setCurrentStep(currentStep - 1)}
                                type='button'
                            />
                            <Button
                                className='!text-red-600 w-full md:!w-fit text-nowrap !bg-transparent !border !border-red-600 !px-6'
                                text='Add Coverage Days'
                                bgcolor={true}
                                type='submit'

                            />
                            <Button
                                className='w-full md:!w-fit text-nowrap !px-6'
                                text='Add  No Coverage Days'
                                bgcolor={true}
                                type='submit'

                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-5">
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
                    <div className="overflow-auto">
                        <DataTabel />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ViewRequest