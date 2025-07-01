'use client';
import React from 'react';
import { ChevronDown } from '../../../common/assets/icons';
import loading from "../../../common/assets/icons/blue-loader.svg"
import Image from 'next/image';

export default function LeaveTable({getReqData, isLoading}) {
    const leaveRequests = [
        {
            name: 'Dr. Test',
            date: 'Wed, April 16 2025',
            type: { label: 'Emergency', color: 'bg-red-500' },
            decision: { label: 'Approved', color: 'bg-green-500' },
            coverageNeeded: { label: 'Yes', color: 'bg-red-500' },
            coverageDetails: { label: 'External', },
            coverageProvider: { label: 'Dr. Surya', },
        },
        {
            name: 'Dr. Test',
            date: 'Wed, April 16 2025',
            type: { label: 'Planned', color: 'bg-green-500' },
            decision: { label: 'Decline', color: 'bg-red-500' },
            coverageNeeded: { label: 'Yes', color: 'bg-red-500' },
            coverageDetails: { label: 'Looking for Coverage', color: 'colored' },
            coverageProvider: { label: 'Looking for Coverage', color: 'colored' },
        },
        {
            name: 'Dr. Test',
            date: 'Wed, April 16 2025',
            type: { label: 'Planned', color: 'bg-green-500' },
            decision: { label: 'Approved', color: 'bg-green-500' },
            coverageNeeded: null,
            coverageDetails: { label: '---', color: '' },
            coverageProvider: { label: '---', },
        },
        {
            name: 'Dr. Test',
            date: 'Wed, April 16 2025',
            type: { label: 'Emergency', color: 'bg-red-500' },
            decision: { label: 'Decline', color: 'bg-red-500' },
            coverageNeeded: { label: 'No', color: 'bg-orange-400' },
            coverageDetails: { label: '---', color: '' },
            coverageProvider: { label: '---', },
        },
        {
            name: 'Dr. Test',
            date: 'Wed, April 16 2025',
            type: { label: 'Planned', color: 'bg-green-500' },
            decision: { label: 'Approved', color: 'bg-green-500' },
            coverageNeeded: null,
            coverageDetails: { label: '---', color: '' },
            coverageProvider: { label: '---', },
        },
        {
            name: 'Dr. Test',
            date: 'Wed, April 16 2025',
            type: { label: 'Planned', color: 'bg-green-500' },
            decision: { label: 'Approved', color: 'bg-green-500' },
            coverageNeeded: { label: 'No', color: 'bg-orange-400' },
            coverageDetails: { label: 'No Coverage Needed', color: '' },
            coverageProvider: { label: 'No Coverage Needed', },
        },
    ]

    return (
        <div className="overflow-hidden">
            <div className="min-w-[700px] relative md:min-w-full border border-gray-200 rounded-xl overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700">
                    <thead className="bg-[#F3F3F5] text-xs text-[#475467] font-medium uppercase">
                        <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Leave Date Requested</th>
                            <th className="px-4 py-3">Type of Leave</th>
                            <th className="px-4 py-3">Request Decision</th>
                            <th className="px-4 py-3">Coverage Needed</th>
                            <th className="px-4 py-3">Coverage Details</th>
                            <th className="px-4 py-3">Covering Provider Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            isLoading ?<Image src={loading} width={125} height={125} alt="" className="mx-auto " /> : 
                            
                            <>
                                {getReqData?.map((req, index) => (
                                    <tr
                                        key={index}
                                        className="border-t border-gray-100 hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3 text-xs font-normal text-[#475467] whitespace-nowrap">
                                            {req.provider}
                                        </td>
                                        <td className="px-4 py-3 text-xs font-normal text-[#475467] whitespace-nowrap">
                                            {req.leave_date}
                                        </td>

                                        <td className="px-4 py-3 whitespace-nowrap">
                                    
                                                <div className="flex items-center gap-1 justify-between w-full">
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`w-2 h-2 inline-block rounded-full ${req.leave_type === "emergency" ? "bg-red-500" : "bg-green-500"}`}
                                                        />
                                                        <span className="text-xs font-normal text-[#475467]">
                                                            {req.leave_type}
                                                        </span>
                                                    </div>
                                                   
                                                </div>
                                            
                                        </td>

                                        <td className="px-4 py-3 whitespace-nowrap">
                                
                                                <div className="flex items-center gap-1 justify-between w-full">
                                                    <div className="flex items-center gap-2">
                                                        {/* <span
                                                            className={`inline-block w-2 h-2 rounded-full ${req.decision.color}`}
                                                        /> */}
                                                        <span className="text-[#475467] text-xs">
                                                            {req.status}
                                                        </span>
                                                    </div>
                                                   
                                                </div>
                                            
                                        </td>

                                        <td className="px-4 py-3 whitespace-nowrap">
                            
                                                <div className="flex items-center gap-1 justify-between w-full">
                                                    <div className="flex gap-2 items-center">
                                                        <span
                                                            className={`w-2 h-2 inline-block rounded-full ${req.coverage_needed !== true ? "bg-red-500" : "bg-green-500"}`}
                                                        />
                                                        <span className="text-[#475467] text-xs">
                                                            {req.coverage_needed === true ? 'Yes' : 'No'}
                                                        </span>
                                                    </div>
                                                   
                                                </div>
                                            
                                        </td>

                                        <td
                                            className={`px-4 py-3 whitespace-nowrap text-xs font-medium `}
                                        >
                                            {req.reason}
                                        </td>

                                        <td
                                            className={`px-4 py-3 whitespace-nowrap text-xs font-medium `}
                                        >
                                            {req.coverage_provider || "---"}
                                        </td>
                                    </tr>
                                ))}
                            </>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}
