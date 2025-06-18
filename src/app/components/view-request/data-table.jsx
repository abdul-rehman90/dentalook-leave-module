'use client';
import React from 'react';
import { ChevronDown } from '../../../common/assets/icons';

export default function LeaveTable() {
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
            <div className="min-w-[700px] md:min-w-full border border-gray-200 rounded-xl overflow-x-auto">
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
                        {leaveRequests.map((req, index) => (
                            <tr
                                key={index}
                                className="border-t border-gray-100 hover:bg-gray-50"
                            >
                                <td className="px-4 py-3 text-xs font-normal text-[#475467] whitespace-nowrap">
                                    {req.name}
                                </td>
                                <td className="px-4 py-3 text-xs font-normal text-[#475467] whitespace-nowrap">
                                    {req.date}
                                </td>

                                <td className="px-4 py-3 whitespace-nowrap">
                                    {req.type ? (
                                        <div className="flex items-center gap-1 justify-between w-full">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`w-2 h-2 inline-block rounded-full ${req.type.color}`}
                                                />
                                                <span className="text-xs font-normal text-[#475467]">
                                                    {req.type.label}
                                                </span>
                                            </div>
                                            <ChevronDown className="w-4 h-4 text-[#475467]" />
                                        </div>
                                    ) : (
                                        '---'
                                    )}
                                </td>

                                <td className="px-4 py-3 whitespace-nowrap">
                                    {req.decision ? (
                                        <div className="flex items-center gap-1 justify-between w-full">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`inline-block w-2 h-2 rounded-full ${req.decision.color}`}
                                                />
                                                <span className="text-[#475467] text-xs">
                                                    {req.decision.label}
                                                </span>
                                            </div>
                                            <ChevronDown className="w-4 h-4 text-[#475467]" />
                                        </div>
                                    ) : (
                                        '---'
                                    )}
                                </td>

                                <td className="px-4 py-3 whitespace-nowrap">
                                    {req.coverageNeeded ? (
                                        <div className="flex items-center gap-1 justify-between w-full">
                                            <div className="flex gap-2 items-center">
                                                <span
                                                    className={`w-2 h-2 rounded-full inline-block ${req.coverageNeeded.color}`}
                                                />
                                                <span className="text-[#475467] text-xs">
                                                    {req.coverageNeeded.label}
                                                </span>
                                            </div>
                                            <ChevronDown className="w-4 h-4 text-[#475467]" />
                                        </div>
                                    ) : (
                                        '---'
                                    )}
                                </td>

                                <td
                                    className={`px-4 py-3 whitespace-nowrap text-xs font-medium ${req.coverageDetails.color
                                        ? 'text-[#FF9500]'
                                        : 'text-[#475467]'
                                        }`}
                                >
                                    {req.coverageDetails.label}
                                </td>

                                <td
                                    className={`px-4 py-3 whitespace-nowrap text-xs font-medium ${req.coverageProvider.color
                                        ? 'text-[#FF9500]'
                                        : 'text-[#475467]'
                                        }`}
                                >
                                    {req.coverageProvider.label}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
