'use client'

import React from 'react'
import { X } from 'lucide-react'
import Heading from '../ui/heading'
import Input from '../ui/input'
import CustomSelector from '../ui/selector'
import Button from '../ui/button'
import Image from 'next/image'
import loader from "../../../common/assets/icons/loader.svg"

function Canvas({ 
    open, 
    onClose,
    setProviderTitle,
    providerTitle,  
    setProviderType,
    providerType,
    allClinics,
    coverageClinicId,
    setCoverageClinicId,
    handleProviderFormChange,
    handleProviderFormSubmit,
    providerFormData,
    providerLoader,
    // allProvinces,
    provinceId,
    setProvinceId,
    setRegionalManagersId,
    regionalManagersId,
    regionalManagers,
    provinceId2, 
    setProvinceId2,
    regionalManagersId2,
    setRegionalManagersId2,
    getData,
    docName,
    setDocName
}) {
    if (!open) return null


    const allProvinces = [
        { id: 1, name: "Alberta (AB)" },
        { id: 2, name: "Saskatchewan (SK)" },    
        { id: 3, name: "Ontario (ON)" },
    ]

    return (
        <form onSubmit={handleProviderFormSubmit}>
            <div
                onClick={onClose}
                className="fixed inset-0 z-[9999] bg-black/50 transition-opacity duration-300"
            />

            <div className="fixed top-0 right-0 z-[999999] rounded-l-2xl h-screen overflow-y-auto bg-white w-full max-w-[430px]  transition-transform duration-300 shadow-xl">
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
                            name="firstName"
                            onChange={handleProviderFormChange}
                            value={providerFormData.firstName} 
                        />
                    </div>
                    <div>
                        <Input
                            label='Provider Last Name'
                            placeholder='Last Name'
                            name="lastName"
                            value={providerFormData.lastName}
                            onChange={handleProviderFormChange}
                        />
                    </div>
                    <div>
                        <CustomSelector
                            onChange={(value) => setDocName(value)}
                            label="Provider Title"
                            options={[{name:"DDS", value:"DDS"},{name:"RDH", value:"RDH"},{name:"RDT", value:"RDT"}]}
                            placeholder="DDS/RDH/RDT"
                            labelKey="name"
                            value={docName || getData?.provider_type?.user_type}
                            className='disabled:opacity-50 disabled:cursor-not-allowed'
                            disabled
                        />
                    </div>

                    <div>
                        <CustomSelector
                            onChange={(value) => setProviderType(value)}
                            label="Provider Type"
                            options={[{name:"Internal", value:"Internal"},{name:"External", value:"External"},{name:"ACE", value:"ACE"}]}
                            placeholder="Internal/External/ACE"
                            labelKey="name"
                            value={providerType}
                        />
                    </div>
                    
                    
                    {
                        providerType === "ACE" &&
                        <div>
                            <CustomSelector
                                onChange={(value) => {
                                    setProvinceId2(value);
                                }}
                                label="Province"
                                options={allProvinces}
                                placeholder="Select Provider Title"
                                labelKey="name"
                                valueKey="id"
                                value={provinceId2}
                            />
                        </div>
                    }   
                    {
                        providerType === "Internal" &&
                        <>
                            <div>
                                <CustomSelector
                                    onChange={(value) => {
                                        setProvinceId2(value);
                                    }}
                                    label="Province"
                                    options={allProvinces}
                                    placeholder="Select Provider Title"
                                    labelKey="name"
                                    valueKey="id"
                                    value={provinceId2}
                                />
                            </div>
                            <div>
                                <CustomSelector
                                    onChange={(value) => {
                                        setRegionalManagersId2(value);
                                    }}
                                    label="Regional Manager"
                                    options={regionalManagers}
                                    placeholder="Surya Rana"
                                    labelKey="name"
                                    valueKey="id"
                                    value={regionalManagersId2}
                                    
                                />
                            </div>
                            <div>
                                <CustomSelector
                                    onChange={(value) => {
                                        setCoverageClinicId(value);
                                    }}
                                    label="Clinic"
                                    options={allClinics}
                                    placeholder="Select Clinic"
                                    labelKey="clinic_name"
                                    valueKey="clinic_id"
                                    value={coverageClinicId}
                                />
                            </div>
                        </>
                    }
                    {
                        providerType === "External" &&
                        <div>
                            <Input
                                label="City"
                                placeholder="Enter Coverage"
                                name="city"
                                onChange={handleProviderFormChange}
                            />
                        </div>
                    }       
                   
                    <div className='flex items-center justify-end gap-4'>
                        <Button
                            text='Cancel'
                            border={true}
                            textcolor={true}
                            onClick={onClose}
                            type='button'
                            disabled={providerLoader}
                            className='!w-fit !px-6 !font-semibold disabled:opacity-[0.5] disabled:cursor-not-allowed'
                        />
                        <Button
                           text={
                                providerLoader ? (
                                <span className="flex items-center gap-2">
                                    Create
                                    <Image src={loader} alt="loading" width={24} height={24} />
                                </span>
                                ) : (
                                "Create"
                                )
                            }
                            className='!w-fit !px-6 !font-semibold disabled:opacity-[0.5] disabled:cursor-not-allowed'
                            disabled={providerLoader}
                            bgcolor={true}
                            type='submit'
                        />
                    </div>
                </div>

            </div>
        </form>
    )
}

export default Canvas
