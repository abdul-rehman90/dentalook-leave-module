'use client'

import React from 'react'
import { X } from 'lucide-react'
import Heading from '../ui/heading'
import Input from '../ui/input'
import CustomSelector from '../ui/selector'
import Button from '../ui/button'

function Canvas({ open, onClose }) {
    const leaveOptions = ['Dashboard', 'Calendar', 'Reports', 'Settings'];
    const leaveOptions1 = ['Yes', 'No'];
    if (!open) return null

    return (
        <>
            <div
                onClick={onClose}
                className="fixed inset-0 z-[9999] bg-black/50 transition-opacity duration-300"
            />

            <div className="fixed top-0 right-0 z-[999999] rounded-l-2xl h-screen overflow-y-auto bg-white w-full max-w-[430px] dark:bg-gray-800 transition-transform duration-300 shadow-xl">
                <div className="flex justify-between w-full items-start px-6 py-5 border-b border-[#E6EAEE]">
                    <Heading
                        title='New Provider Details'
                        subtitle='Description should be here.'
                    />
                    <button
                        onClick={onClose}
                        className="text-gray-400 rounded-lg p-2 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                        <X className="w-8 h-8 p-1 border rounded-lg" />
                        <span className="sr-only">Close menu</span>
                    </button>
                </div>
                <div className='py-5 px-6 flex flex-col gap-3.5'>
                    <div>
                        <Input
                            label='Provider First Name'
                            placeholder='First Name'
                        />
                    </div>
                    <div>
                        <Input
                            label='Provider Last Name'
                            placeholder='Last Name'
                        />
                    </div>
                    <div>
                        <Input
                            label='Provider Title'
                            placeholder='DDS/RDH/RDT'
                        />
                    </div>
                    <div>
                        <CustomSelector
                            onChange={(value) => console.log(value)}
                            options={leaveOptions}
                            label='Leave Type'
                            placeholder='Select' />
                    </div>
                    <div>
                        <Input
                            label='Province'
                            placeholder='ON/SK/AB'
                        />
                    </div>
                    <div>
                        <CustomSelector
                            onChange={(value) => console.log(value)}
                            options={leaveOptions1}
                            label='Leave Type'
                            placeholder='Select option' />
                    </div>
                    <div>
                        <CustomSelector
                            onChange={(value) => console.log(value)}
                            options={leaveOptions}
                            label='Clinic'
                            placeholder='Select Clinic' />
                    </div>
                    <div>
                        <Input
                            label='City'
                            placeholder='Enter City'
                        />
                    </div>
                    <div className='flex items-center justify-end gap-4'>
                        <Button
                            text='Cancel'
                            border={true}
                            textcolor={true}
                            type='button'
                            className='!w-fit !px-6 !font-semibold'
                        />
                        <Button
                            text='Create'
                            className='!w-fit !px-6 !font-semibold'
                            bgcolor={true}
                            type='button'
                        />
                    </div>
                </div>

            </div>
        </>
    )
}

export default Canvas
