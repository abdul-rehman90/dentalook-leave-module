import { ArrowRight, Download, Settings } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import Heading from '../ui/heading'
import { Mainlogo, userAvatar } from '../../../common/assets/images'
import Link from 'next/link'

function HomPage() {
    return (
        <div className='bg-white relative'>
            <div className='flex sticky top-0 items-center border-b border-[#E6EAEE] justify-between w-full p-6 bg-white'>
                <div>
                    <Image src={Mainlogo} alt='logo' />
                </div>
                <div className='flex items-center gap-3'>
                    {/* <button className='cursor-pointer p-2 border rounded-lg border-[#E6EAEE] shadow'>
                        <Download className='text-[#5D606D]' />
                    </button>
                    <button className='cursor-pointer p-2 border rounded-lg border-[#E6EAEE] shadow'>
                        <Settings className='text-[#5D606D]' />
                    </button> */}
                    <button className='cursor-pointer'>
                        <Image height={40} width={40} src={userAvatar} alt='avatar' />
                    </button>

                </div>
            </div>
            <div className='flex items-center min-h-[calc(100vh-95px)] max-w-[550px] mx-auto px-1 py-6'>
                <div className='w-full'>
                    <div>
                        <Image src={Mainlogo} alt='logo' />
                        <Heading
                            className='mt-8 !text-left'
                            title='Dentalook Provider Leave Request Hub'
                            subtitle='Manage Time Off Requests Efficiently and Transparently'
                        />
                    </div>
                    <div>
                        <Link className='!p-0' href='/leave-request'>
                            <div className='group w-full hover:shadow-lg max-w-md mx-auto mt-6 px-6 py-12 border-2 relative rounded-2xl shadow border-white hover:border-[#335679] transition-all duration-300 ease-in-out'>
                                <Heading
                                    titleClass='font-medium text-lg text-black group-hover:text-[#335679] font-jakarta transition-colors duration-300'
                                    title='Submit Provider Leave Request'
                                    subtitle='Fill & send your time-off request in few steps.'
                                />
                                <div className='absolute hidden group-hover:block top-3 right-3 group-hover:text-[#335679] -rotate-45'>
                                    <ArrowRight />
                                </div>
                            </div>
                        </Link>


                        <Link href='/view-request'>
                            <div className='group w-full relative hover:shadow-lg max-w-md mx-auto mt-6 px-6 py-12 border-2 rounded-2xl shadow border-white hover:border-[#335679] transition-all duration-300 ease-in-out'>
                                <Heading
                                    titleClass='font-medium text-lg text-black group-hover:text-[#335679] font-jakarta transition-colors duration-300'
                                    title='View Leave Requests'
                                    subtitle='Check status of submitted leave & past requests'
                                />
                                <div className='absolute hidden group-hover:block top-3 right-3 group-hover:text-[#335679] -rotate-45'>
                                    <ArrowRight />
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomPage