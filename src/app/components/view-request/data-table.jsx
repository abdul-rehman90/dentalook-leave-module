'use client';
import React, { useEffect, useState } from 'react';
import { ChevronDown } from '../../../common/assets/icons';
import loading from '../../../common/assets/icons/blue-loader.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaEye } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { CloudCog } from 'lucide-react';

export default function LeaveTable({ getReqData, isLoading }) {
  const [newData, setNewData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modelData, setModelData] = useState({});
  const router = useRouter();
  useEffect(() => {
    if (getReqData?.length > 0) {
      const transformedData = getReqData?.flatMap((item) =>
        item?.days?.map((day) => ({
          provider_name: item?.provider_name,
          status: item?.status,
          id: item?.id,
          status: item?.status,
          leave_date: item?.days?.map((nestedDay) => nestedDay?.leave_date),
          leave_type: item?.days?.map((nestedDay) => nestedDay?.leave_type),
          email: item?.days?.map(
            (nestedDay) => nestedDay?.coverage_provider?.email
          ),
          user_type: item?.days?.map(
            (nestedDay) => nestedDay?.coverage_provider?.user_type
          ),
         
          province_name: item?.days?.map(
            (nestedDay) => nestedDay?.coverage_provider?.province_name
          ),
          clinic_name: item?.days?.map(
            (nestedDay) => nestedDay?.coverage_provider?.clinic_name
          ),
          regional_manager: item?.days?.map(
            (nestedDay) => nestedDay?.coverage_provider?.regional_manager
          ),
          name: item?.days?.map(
            (nestedDay) => nestedDay?.coverage_provider?.name
          ),
          reason: item?.days?.map(
            (nestedDay) => nestedDay?.coverage_provider?.provider_coverage
          ),
          coverage_provider: item?.days?.map(
            (nestedDay) => nestedDay?.coverage_provider?.name
          ),
          coverage_status: item?.days?.map(
            (nestedDay) => nestedDay?.coverage_status
          ),
          coverage_needed: item?.days?.map(
            (nestedDay) => nestedDay?.coverage_needed
          )
        }))
      );
      setNewData(transformedData);
    }
  }, [getReqData]);

  const handelClick = (item) => {
    localStorage.setItem('leaveRequestId', item.id);
    if (item.status === 'pending') {
      router.push(
        `/leave-request?step=2&leaveRequestId=${item.id}&status=${item.status}`
      );
    }
    if (item.status === 'decline') {
      return;
    }
    if (item.status !== 'pending') {
      router.push(
        `/leave-request?step=3&leaveRequestId=${item.id}&status=${item.status}`
      );
    }
  };

  const handleModelOpen = (item) => {
    setModelData(item);
    setModalOpen(true);
  };

  return (
    <div className="">
      <div className="w-full relative md:min-w-full border border-gray-200 rounded-xl overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm text-left text-gray-700">
          <thead className="bg-[#F3F3F5] text-xs text-[#475467] font-medium uppercase">
            <tr>
              <th className="px-3 py-3 whitespace-nowrap text-xs">
                Provider Title
              </th>
              <th className="pl-3 pr-1 py-3 whitespace-nowrap text-xs">
                Provider On Leave
              </th>
              <th className="pr-1 pl-2 py-3 whitespace-nowrap text-xs">
                Regional Manager
              </th>
              <th className="px-3 py-3 whitespace-nowrap text-xs">
                Clinic Name
              </th>
              <th className="px-3 py-3 whitespace-nowrap text-xs">
                Leave Date Requested
              </th>
              <th className="pr-3 pl-1 py-3 whitespace-nowrap text-xs">
                Type of Leave
              </th>
              <th className="pr-3 pl-1 py-3 whitespace-nowrap text-xs border-r border-[#D9DADF]">
                Request Decision
              </th>
              <th className="px-3 py-3 whitespace-nowrap text-xs">
                Coverage Needed
              </th>
              <th className="pr-3 pl-1 py-3 whitespace-nowrap text-xs">
                Covering Provider Type
              </th>
              <th className="pr-3 pl-1 py-3 whitespace-nowrap text-xs">
                Covering Provider Name
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  <Image
                    src={loading}
                    width={125}
                    height={125}
                    alt=""
                    className="mx-auto "
                  />
                </td>
            </tr>
              
            ) : (getReqData.length === 0 && !isLoading) ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No data found
                </td>
              </tr>
            ) : (
              <>
                {newData?.map((item) => {
                  const allPast = item.leave_date?.every((dateStr) => {
                    const date = new Date(dateStr);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  });
                  return (
                    <tr
                      className={`border-t border-[#EAECF0] ${
                        !allPast ? 'cursor-pointer' : 'cursor-not-allowed'
                      }`}
                      onClick={() => !allPast && handelClick(item)}
                    >
                      <td className="px-3 py-3 text-xs font-normal text-[#475467] whitespace-nowrap">
                        {item?.user_type?.map((date, index) => (
                          <div key={index}>{date}</div>
                        ))}
                      </td>
                      <td className="pl-3 pr-1 py-3 text-xs font-normal text-[#475467] whitespace-nowrap">
                        {item?.provider_name || ''}
                      </td>
                      <td className="pr-1 pl-2 py-3 text-xs font-normal text-[#475467] whitespace-nowrap">
                        {item?.regional_manager?.map((date, index) => (
                          <div title={date} key={index}>{date ? date.slice(0, 10) + '...' : ''}</div>
                        ))}
                      </td>
                      <td className="px-3 py-3 text-xs font-normal text-[#475467] whitespace-nowrap">
                        
                        {item?.clinic_name?.map((date, index) => (
                          <div title={date} key={index}>{date ? date.slice(0, 7) + '...' : ''}</div>
                        ))}
                      </td>
                      <td className="px-3 py-3 text-xs font-normal text-[#475467] whitespace-nowrap">
                        {item?.leave_date?.map((date, index) => (
                          <div key={index}>{date}</div>
                        ))}
                      </td>
                      <td className="pr-3 pl-1 py-3 whitespace-nowrap">
                        {item?.leave_type.map((type, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 justify-between w-full"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2 h-2 inline-block rounded-full ${
                                  type === 'emergency'
                                    ? 'bg-red-600'
                                    : 'bg-green-600'
                                }`}
                              />
                              <span className="text-xs font-normal text-[#475467]">
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </td>

                      <td className="pr-3 pl-1 py-3 text-xs font-normal text-[#475467] whitespace-nowrap border-r border-[#D9DADF]">
                        <span
                          className={`w-2 h-2 mr-[6px] inline-block rounded-full ${
                            item?.status === 'decline'
                              ? 'bg-red-600'
                              : item?.status === 'pending'
                              ? 'bg-orange-400'
                              : 'bg-green-600'
                          }`}
                        />
                        <span className="text-xs font-normal text-[#475467]">
                          {item?.status === 'decline'
                            ? 'Declined'
                            : item?.status.charAt(0).toUpperCase() +
                              item?.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-3 text-xs font-normal text-[#475467]">
                        {item?.coverage_needed.map((needed, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 justify-between w-full"
                          >
                           
                              <div className="flex gap-2 items-center">
                                <span
                                  className={`w-2 h-2 inline-block rounded-full ${
                                    needed !== true
                                      ? ' bg-green-600'
                                      : 'bg-red-600'
                                  }`}
                                />
                                <span className="text-[#475467] text-xs">
                                  {needed === true ? 'Yes' : 'No'}
                                </span>
                              </div>
                            
                          </div>
                        ))}
                      </td>

                      <td className="pr-3 pl-1 text-xs font-normal text-[#475467]">
                        {
                          item?.status === "pending" ? null :
                          <>
                            {item?.reason?.map((detail, index) => {
                              if (item.coverage_needed?.[index] === false) {
                                return (
                                  <div key={index} className='whitespace-nowrap'>
                                    {
                                      item?.status === 'decline' ? null : 
                                      <span
                                        className={`w-2 h-2 inline-block rounded-full bg-green-600 mr-1`}
                                      />
                                    }
                                    
                                    {item?.status === 'decline' ? "" : "No Coverage Needed"}
                                  </div>
                                );
                              }
                              if (
                                item.coverage_needed?.[index] === true &&
                                (!detail || detail === '')
                              ) {
                                return (
                                  <div key={index} className='whitespace-nowrap'>
                                    <span
                                      className={`w-2 h-2 inline-block rounded-full bg-orange-400 mr-1`}
                                    />
                                    Looking for Coverage
                                  </div>
                                );
                              }
                              return <div key={index}>{detail}</div>;
                            })}
                          </>
                        }
                      </td>

                      <td className="pr-3 pl-1 flex flex-col items-start gap-2 py-3 text-xs font-normal text-[#475467]">
                        {
                          item?.status === "pending" ? null :
                          <>
                            {item?.coverage_provider?.map((provider, index) => {
                              let label = provider;
                              let color = '';
                              if (item.coverage_needed?.[index] === false) {
                                label = 'No Coverage Needed';
                                color = 'bg-green-600';
                              } else if (
                                item.coverage_needed?.[index] === true &&
                                (!provider || provider === '')
                              ) {
                                label = 'Looking for Coverage';
                                color = 'bg-orange-400';
                              }

                              return (
                                <div key={index} className="flex items-center">
                                  {
                                    item?.status === 'decline' ? null : 
                                    <span
                                      className={`w-2 mr-[5px] h-2 inline-block rounded-full ${color}`}
                                    />
                                  }
                                  
                                  <span>{item?.status === 'decline' ? "" : label}</span>
                                  {item.coverage_provider?.[index] !== null &&
                                    item.coverage_provider?.[index] !==
                                      undefined && (
                                      <button
                                        type="button"
                                        className="cursor-pointer ml-2"
                                        onClick={(e) => {
                                          handleModelOpen({
                                            province_name: item.province_name,
                                            user_type: item.user_type,
                                            email: item.email,
                                            reason: item.reason,
                                            coverage_provider: provider,
                                            clinic_name: item.clinic_name,
                                            regional_manager: item.regional_manager,
                                            name: item.name
                                          });
                                          e.stopPropagation();
                                        }}
                                      >
                                        <FaEye className="text-[16px]" />
                                      </button>
                                    )}
                                </div>
                              );
                            })}
                          </>
                        }
                      </td>
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999]">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setModalOpen(false)}
          />
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow-lg p-6 z-10 min-w-[300px] max-w-[90vw]">
            <button
              className="absolute top-2 cursor-pointer right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setModalOpen(false)}
            >
              <IoClose />
            </button>
            <h2 className="text-lg font-semibold mb-4">
              Coverage Provider Details
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3">
                <strong>Provider Title:</strong>
                <p>{modelData.user_type || ""}</p>
              </div>
              <div className="flex gap-3">
                <strong>Name:</strong>
                <p>{modelData.coverage_provider || ""}</p>
              </div>
              
              <div className="flex gap-3">
                <strong>Coverage Type:</strong>
                <p>{modelData.reason || ""}</p>
              </div>
              
             
              {
                modelData.reason.includes("Internal") && (
                  <>
                    <div className="flex gap-3">
                      <strong>Province:</strong>
                      <p>{modelData.province_name || ""}</p>
                    </div>
                    <div className="flex gap-3">
                      <strong>Regional Manager:</strong>
                      <p>{modelData.regional_manager || ""}</p>
                    </div>
                    <div className="flex gap-3">
                      <strong>Clinic:</strong>
                      <p>{modelData.clinic_name || ""}</p>
                    </div>
                  </>
                )
              }
              {
                (modelData.reason.includes("ACE") || modelData.reason.includes("External")) && (
                  <div className="flex gap-3">
                    <strong>Name:</strong>
                    <p>{modelData.name}</p>
                  </div>
                )}
              

  
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
