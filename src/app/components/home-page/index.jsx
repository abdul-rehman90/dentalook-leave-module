import { Download, Settings } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import Heading from '../ui/heading'
import { Mainlogo, userAvatar } from '@/common/assets/images'
import Link from 'next/link'

function HomPage() {
    return (
        <div className='bg-white relative'>
            <div className='flex sticky top-0 items-center border-b border-[#E6EAEE] justify-between w-full p-6 bg-white'>
                <div>
                    <Image src={Mainlogo} alt='logo' />
                </div>
                <div className='flex items-center gap-3'>
                    <button className='cursor-pointer p-2 border rounded-lg border-[#E6EAEE] shadow'>
                        <Download className='text-[#5D606D]' />
                    </button>
                    <button className='cursor-pointer p-2 border rounded-lg border-[#E6EAEE] shadow'>
                        <Settings className='text-[#5D606D]' />
                    </button>
                    <button className='cursor-pointer'>
                        <Image height={40} width={40} src={userAvatar} alt='avatar' />
                    </button>

                </div>
            </div>
            <div className='flex items-center min-h-[calc(100vh-95px)] max-w-[550px] mx-auto px-10 py-6'>
                <div className='w-full'>
                    <div>
                        <Image src={Mainlogo} alt='logo' />
                        <Heading
                            className='mt-8 !text-left'
                            title='Dentalook Provider Leave Request Hub'
                            subtitle='Manage Time Off Requests Efficiently and Transparently'
                        />
                    </div>
                    <Link href='/leave-request'>
                        <div className='px-8 mt-13 py-11.5 border-[#335679] shadow mr-auto border-2 rounded-2xl w-full'>
                            <Heading
                                titleClass='font-semibold text-xl text-[#335679]'
                                title='Submit Provider Leave Request'
                                subtitle='Fill & send your time-off request in few steps.'
                            />
                        </div></Link>
                    <div className='px-8 mt-6 py-11.5  mr-auto border border-[#E6EAEE] shadow rounded-2xl w-full'>
                        <Heading
                            titleClass='font-medium text-lg text-[#030303] font-jakarta'
                            title='View Leave Requests'
                            subtitle='Check status of submitted leave & past requests'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomPage