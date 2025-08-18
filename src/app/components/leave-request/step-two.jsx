import React, { useEffect, useRef, useState } from 'react';
import Heading from '../ui/heading';
import CustomSelector from '../ui/selector';
import Button from '../ui/button';
import useSteptwo from './use-steptwo.hook';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import loader from '../../../common/assets/icons/blue-loader.svg';
import Image from 'next/image';
import { Plus, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import axiosInstance from '../../../utils/axios-instance';
import useLeaveReq from './use-leave-req.hook';
import toast from 'react-hot-toast';
import loading from '../../../common/assets/icons/loader.svg';

const rightSideSteps = [
  {
    title: '1. Review the Provider Contract',
    description: 'Verify the vacation entitlement as outlined in the contract'
  },
  {
    title: '2. Confirm Vacation Allowance',
    description: 'Check the remaining vacation days available to the provider'
  },
  {
    title: '3. Assess Notification Requirement ',
    description:
      'Review the required notice period for leave requests as stipulated in the contract'
  },
  {
    title: '4. Connect with the provider',
    description:
      'Get in touch with the provider to understand their reason for the request'
  },
  {
    title: '5. Decide on Approval',
    description: 'Approve or decline the request based on the evaluation'
  }
];

const statusOptions = [
  { name: 'Approve', value: 'approve' },
  { name: 'Decline', value: 'decline' }
];

function StepTwo({ onPrev, onNext, setCurrentStep }) {
  const router = useRouter();
  const modalRef = useRef(null);
  const param = useSearchParams();
  const role = Cookies.get('role');
  const { formId } = useLeaveReq();
  const getStatusParam = param.get('status');
  const [isModel, setIsModel] = useState(false);
  const [formData1, setFormData2] = useState([]);
  const [writeIndex, setWriteIndex] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const savedClinicId = localStorage.getItem('clinicId');
  const [isEditLoading, setIsEditLoading] = useState(false);
  const savedProviderId = localStorage.getItem('providerId');
  const [dateSelectionMode, setDateSelectionMode] = useState('individual');
  const [rangeDates, setRangeDates] = useState({
    start: '',
    end: ''
  });
  const {
    getData,
    isLoading,
    multiDates,
    declineReq,
    handleStatus,
    setMultiDates,
    loadingButton
  } = useSteptwo({ onNext });

  const handleChange = (index, field, value) => {
    setFormData2((prev) => {
      const updated = [...prev];

      if (selectedRows.length > 1 && selectedRows.includes(index)) {
        // Bulk update: apply to all selected rows
        selectedRows.forEach((rowIdx) => {
          updated[rowIdx] = {
            ...updated[rowIdx],
            [field]: value
          };
        });
      } else {
        // Single row update
        updated[index] = {
          ...updated[index],
          [field]: value
        };
      }

      return updated;
    });
  };

  const handleStatusChange = (index, value) => {
    setFormData2((prev) => {
      const updated = [...prev];

      if (selectedRows.length > 1 && selectedRows.includes(index)) {
        selectedRows.forEach((rowIdx) => {
          updated[rowIdx] = {
            ...updated[rowIdx],
            status: value
          };
        });
      } else {
        updated[index] = {
          ...updated[index],
          status: value
        };
      }

      return updated;
    });
  };

  const handleRowSelect = (index, checked) => {
    setSelectedRows((prev) =>
      checked ? [...prev, index] : prev.filter((i) => i !== index)
    );
  };

  const handleClick = () => {
    localStorage.removeItem('leaveRequestId');
    setCurrentStep(0);
    router.replace('/leave-request');
  };

  const handleDateChange2 = (date) => {
    if (!date) return;

    if (dateSelectionMode === 'individual') {
      const formatted = format(date, 'EEE, MMM-dd-yyyy');
      const updated = [...multiDates];
      updated[writeIndex].leave_date = formatted;
      if (writeIndex === updated.length - 1) {
        updated.push({ leave_date: '' });
      }
      setMultiDates(updated);
      setWriteIndex(writeIndex + 1);
    } else {
      if (!rangeDates.start || rangeDates.end) {
        setRangeDates({
          start: format(date[0], 'EEE, MMM-dd-yyyy'),
          end: ''
        });
      } else {
        setRangeDates((prev) => ({
          ...prev,
          end: format(date[1], 'EEE, MMM-dd-yyyy')
        }));
      }
    }
  };

  const handleUpdateLeaveRequest = async (e) => {
    // e.preventDefault();
    for (let i = 0; i < formData1.length; i++) {
      const row = formData1[i];
      if (!row.leave_date || row.leave_date === '') {
        toast.error(`Please select Leave Date for row ${i + 1}`);
        return;
      }
      if (!row.leave_type || row.leave_type === '') {
        toast.error(`Please select Leave Type for row ${i + 1}`);
        return;
      }
      if (!row.reason || row.reason === '') {
        toast.error(`Please enter Reason for row ${i + 1}`);
        return;
      }
    }
    setIsEditLoading(true);
    const paylaod = {
      clinic: Number(savedClinicId),
      provider: Number(savedProviderId),
      leave_requests: formData1?.map((row) => ({
        leave_date: format(row.leave_date, 'yyyy-MM-dd'),
        leave_type: row.leave_type,
        reason: row.reason
      }))
    };
    try {
      const response = await axiosInstance.patch(
        `api/v1/update-leave-request/${formId}/`,
        paylaod
      );
      if (response.status === 200) {
        toast.success('Leave Request is successfully updated');
      }
    } catch (error) {
      toast.error(error.response?.data?.error);
    } finally {
      setIsEditing(false);
      setIsEditLoading(false);
    }
  };

  const renderModalContent = () => (
    <div
      ref={modalRef}
      className="relative z-10 bg-white rounded-lg shadow-lg p-6 w-[45vw] max-h-[90vh] overflow-auto"
    >
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={dateSelectionMode === 'individual'}
            onChange={() => {
              setDateSelectionMode('individual');
              setRangeDates({ start: '', end: '' });
            }}
          />
          Individual Dates
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={dateSelectionMode === 'range'}
            onChange={() => {
              setDateSelectionMode('range');
              setMultiDates([{ leave_date: '' }]);
            }}
          />
          Date Range
        </label>
      </div>

      <div className="flex gap-6">
        <DatePicker
          inline
          selected={
            dateSelectionMode === 'individual'
              ? multiDates[activeIndex]?.leave_date
                ? new Date(multiDates[activeIndex]?.leave_date)
                : null
              : rangeDates.start
              ? new Date(rangeDates.start)
              : null
          }
          selectsRange={dateSelectionMode === 'range'}
          startDate={
            dateSelectionMode === 'range' && rangeDates.start
              ? new Date(rangeDates.start)
              : null
          }
          endDate={
            dateSelectionMode === 'range' && rangeDates.end
              ? new Date(rangeDates.end)
              : null
          }
          monthsShown={dateSelectionMode === 'individual' ? null : 2}
          minDate={new Date()}
          dropdownMode="select"
          onChange={handleDateChange2}
        />

        <div className="flex flex-col gap-4 w-full overflow-x-auto h-[20vw]">
          {dateSelectionMode === 'individual' &&
            multiDates.map((item, index) => (
              <div key={index} className="relative">
                <input
                  readOnly
                  type="text"
                  value={item.leave_date}
                  placeholder="MMM-DD-YYYY"
                  className={`w-full py-2 px-4 border rounded-md text-sm ${
                    writeIndex === index
                      ? 'border-[#335679]'
                      : 'border-gray-300'
                  }`}
                />
                {multiDates.length > 1 && (
                  <button
                    type="button"
                    className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 text-red-500 text-sm"
                    onClick={() => {
                      const updated = multiDates.filter((_, i) => i !== index);
                      let newWriteIndex = writeIndex;
                      if (index < writeIndex) {
                        newWriteIndex = writeIndex - 1;
                      } else if (
                        index === writeIndex &&
                        writeIndex === updated.length
                      ) {
                        newWriteIndex = updated.length - 1;
                      }
                      setMultiDates(updated);
                      setWriteIndex(Math.max(newWriteIndex, 0));
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

          {dateSelectionMode === 'range' && (
            <div className="relative">
              <input
                readOnly
                type="text"
                placeholder="MMM-DD-YYYY"
                value={
                  rangeDates.start && rangeDates.end
                    ? `${rangeDates.start} - ${rangeDates.end}`
                    : ''
                }
                className="w-full py-2 px-4 border rounded-md text-sm border-gray-300"
              />
              {rangeDates.start && rangeDates.end && (
                <button
                  type="button"
                  className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 text-red-500 text-sm"
                  onClick={() => {
                    setRangeDates({
                      start: '',
                      end: ''
                    });
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const providerInfo = [
    { label: 'Provider Title', value: getData?.provider_name?.user_type },
    { label: 'Provider Name', value: getData?.provider_name?.name }
  ];

  const locationInfo = [
    { label: 'Province', value: getData?.province },
    { label: 'Regional Manager', value: getData?.regional_manager },
    { label: 'Clinic', value: getData?.clinic_name }
  ];

  useEffect(() => {
    const days = getData?.days || [];
    if (days?.length > 0) {
      setFormData2(
        days.map((day) => ({
          id: day.id,
          status: 'decline',
          leave_date: day.leave_date,
          leave_type: day.leave_type,
          reason: day.reason,
          start_date: day.start_date,
          end_date: day.end_date,
          entry_type: day.entry_type
        }))
      );
    }
  }, [getData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isModel &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        let newRows = [];

        if (dateSelectionMode === 'range') {
          newRows = [
            {
              leave_date: rangeDates.start,
              end_date: rangeDates.end,
              start_date: rangeDates.start,
              leave_type: '',
              reason: '',
              status: 'decline',
              entry_type: 'date range'
            }
          ];
        } else {
          const validDates = multiDates.filter((d) => d.leave_date);
          validDates.sort(
            (a, b) => new Date(a.leave_date) - new Date(b.leave_date)
          );

          newRows = validDates.map((d) => ({
            leave_date: d.leave_date,
            end_date: '',
            start_date: '',
            leave_type: '',
            reason: '',
            status: 'decline',
            entry_type: ''
          }));
        }

        const updatedRows = [...formData1, ...newRows]
          .filter((item) => item.leave_date)
          .sort((a, b) => new Date(a.leave_date) - new Date(b.leave_date));

        setWriteIndex(0);
        setActiveIndex(0);
        setIsModel(false);
        setFormData2(updatedRows);
        setDateSelectionMode('individual');
        setMultiDates([{ leave_date: '' }]);
        setRangeDates({ start: '', end: '' });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModel, multiDates, dateSelectionMode, formData1, rangeDates]);

  return (
    <div className="">
      <Heading
        title="Review Leave Request Details"
        subtitle="Please review the leave request before taking any decision."
      />
      <form>
        <div className="grid grid-cols-12 gap-6 py-5">
          {isLoading ? (
            <div className="col-span-8">
              <Image src={loader} alt="" width={80} height={80} />
            </div>
          ) : (
            <div className="col-span-8 flex justify-between flex-col h-full gap-8">
              <div>
                <div className="grid grid-cols-2 md:grid-cols-3 justify-between w-full mb-4 mt-4.5">
                  {locationInfo.map((item, index) => (
                    <div className="flex flex-col gap-2" key={index}>
                      <p className="font-medium text-[#979797] text-sm">
                        {item.label}
                      </p>
                      <h2 className="font-medium text-base">{item.value}</h2>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full justify-start">
                  {providerInfo?.map((item, index) => (
                    <div className="flex flex-col gap-2" key={index}>
                      <p className="font-medium text-[#979797] text-sm">
                        {item.label}
                      </p>
                      <h2 className="font-medium text-base">{item.value}</h2>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-7">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModel(true);
                    }}
                    className="rounded-xl border flex disabled:cursor-not-allowed cursor-pointer items-center p-2 gap-1 w-full md:w-fit border-[#D0D5DD]"
                  >
                    <Plus className={`text-[#7DB02D]`} />
                    Add Leave Day(s)
                  </button>
                </div>

                <div className="relative addBorderClass mt-7">
                  <div className="relative">
                    <table className="w-full">
                      <thead className="border-b-[#D9DADF] border-b border-solid">
                        <tr>
                          <th className="text-left p-1 w-[3%]">
                            <input
                              type="checkbox"
                              className="mx-2"
                              checked={
                                selectedRows.length === formData1.length &&
                                formData1.length > 0
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedRows(
                                    formData1.map((_, idx) => idx)
                                  );
                                } else {
                                  setSelectedRows([]);
                                }
                              }}
                            />
                          </th>
                          <th className="text-left p-1 w-[15%] text-[13px] text-[#373940] font-semibold">
                            Leave Date
                          </th>
                          <th className="text-left p-1 w-[12%] text-[13px] text-[#373940] font-semibold">
                            Leave Type
                          </th>
                          <th className="text-left p-1 w-[15%] text-[13px] text-[#373940] font-semibold">
                            Reason
                          </th>
                          <th className="text-left p-1 w-[10%] text-[13px] text-[#373940] font-semibold">
                            Status
                          </th>
                          <th className="text-left p-1 w-[5%]"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData1?.map((day, dayIdx) => {
                          const isSelected = selectedRows.includes(dayIdx);
                          const isRange = day.entry_type === 'date range';
                          return (
                            <tr
                              key={dayIdx}
                              className={`${
                                dayIdx !== 0 ? 'border-t border-[#E6EAEE]' : ''
                              } hover:shadow-[0_2px_4px_0_rgba(60,64,67,0.1),0_2px_6px_2px_rgba(60,64,67,0.15)] hover:transition-all hover:duration-200 hover:z-10`}
                            >
                              <td className="p-1">
                                <input
                                  type="checkbox"
                                  className="mx-2"
                                  checked={isSelected}
                                  onChange={(e) =>
                                    handleRowSelect(dayIdx, e.target.checked)
                                  }
                                />
                              </td>
                              <td className="p-1">
                                <DatePicker
                                  disabled
                                  name="leave_date"
                                  minDate={new Date()}
                                  dropdownMode="select"
                                  selectsRange={isRange}
                                  dateFormat="yyyy-MM-dd"
                                  endDate={
                                    isRange ? new Date(day.end_date) : null
                                  }
                                  startDate={
                                    isRange ? new Date(day.start_date) : null
                                  }
                                  selected={
                                    !isRange
                                      ? day.leave_date
                                        ? new Date(day.leave_date)
                                        : null
                                      : null
                                  }
                                  className="py-[6px] w-full px-4 bg-white text-[#000] placeholder:text-[#1f1f1fa9] focus:outline-0 text-sm rounded-[8px] border border-[#D9DADF]"
                                  onChange={(date) => {
                                    if (!isRange) {
                                      const formatted = date
                                        ? format(date, 'yyyy-MM-dd')
                                        : '';
                                      handleChange(
                                        dayIdx,
                                        'leave_date',
                                        formatted
                                      );
                                    } else {
                                      const [start, end] = date;
                                      handleChange(
                                        dayIdx,
                                        'leave_date',
                                        start ? format(date, 'yyyy-MM-dd') : ''
                                      );
                                      handleChange(
                                        dayIdx,
                                        'end_date',
                                        end ? format(date, 'yyyy-MM-dd') : ''
                                      );
                                    }
                                  }}
                                />
                              </td>
                              <td className="p-1">
                                <CustomSelector
                                  options={[
                                    { name: 'Emergency', value: 'emergency' },
                                    { name: 'Planned', value: 'planned' }
                                  ]}
                                  value={day.leave_type}
                                  onChange={(value) =>
                                    handleChange(dayIdx, 'leave_type', value)
                                  }
                                  labelKey="name"
                                  disabled={!isEditing}
                                  className="disabled:opacity-[0.9] disabled:cursor-not-allowed"
                                />
                              </td>
                              <td className="p-1">
                                <div>
                                  <textarea
                                    disabled={!isEditing}
                                    rows={1}
                                    value={day.reason}
                                    typ="text"
                                    placeholder="Enter Reason"
                                    name="reason"
                                    className="mt-[5px] disabled:cursor-not-allowed bg-white text-[#000] resize-none w-full disabled:opacity-[0.9] py-[6px] px-4 placeholder:text-[#1f1f1fa9] focus:outline-0 text-sm rounded-[8px] border border-[#D9DADF]"
                                    onChange={(e) =>
                                      handleChange(
                                        dayIdx,
                                        'reason',
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </td>
                              <td className="p-1">
                                <CustomSelector
                                  options={statusOptions}
                                  value={day.status}
                                  onChange={(value) =>
                                    handleStatusChange(dayIdx, value)
                                  }
                                  labelKey="name"
                                  valueKey="value"
                                  className="w-full"
                                />
                              </td>
                              <td className="p-1">
                                {dayIdx > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newRows = [...formData1];
                                      newRows.splice(dayIdx, 1);
                                      setFormData2(newRows);
                                      setSelectedRows((prev) =>
                                        prev.filter((i) => i !== dayIdx)
                                      );
                                    }}
                                    className="mx-2 float-right text-red-500 hover:bg-red-50 rounded-full cursor-pointer"
                                  >
                                    <X className="w-5 h-5" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="col-span-4 bg-[#F8F8F8] px-3 border-l border-[#D9DADF]">
            {rightSideSteps.map((step, index) => (
              <div className={`mt-${index === 0 ? '0' : '5'}`} key={index}>
                <h2 className="text-base font-medium text-[#111B2B]">
                  {step.title}
                </h2>
                <p className="text-[#67728A] text-sm ml-4.5">
                  {step.description}
                </p>
              </div>
            ))}
            <div className="mt-5 flex gap-2 items-center">
              <input
                id="check"
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <label
                htmlFor="check"
                className="text-black font-medium text-base"
              >
                I acknowledge that I've reviewed the above points for the
                following leave request.
              </label>
            </div>
          </div>
        </div>
        <div
          className={`justify-between flex flex-wrap md:flex-nowrap w-full items-end gap-3.5 md:py-4 mt-5`}
        >
          <Button
            type="button"
            bgcolor={true}
            disabled={isEditLoading}
            className="!w-full max-w-[270px] flex justify-center md:w-fit py-[6px] md:py-[11px] rounded-xl text-base bg-[#335679] text-[#fff] font-medium px-[75px] disabled:cursor-not-allowed disabled:opacity-[0.6]"
            text={
              isEditLoading ? (
                <Image src={loading} alt="loading" width={24} height={24} />
              ) : isEditing ? (
                'Update Request'
              ) : (
                'Edit Request'
              )
            }
            onClick={() => {
              if (!isEditing) {
                setIsEditing(true);
                onPrev();
              } else {
                handleUpdateLeaveRequest();
              }
            }}
          />

          {getStatusParam === 'decline' || declineReq === true ? (
            <div className="flex flex-col gap-2 items-end">
              <p className="text-red-600">
                The Leave Request has been declined.
              </p>
              <div
                className={`flex flex-wrap md:flex-nowrap items-center gap-2`}
              >
                <Button
                  text="Go to Dashboard"
                  textcolor={true}
                  border={true}
                  onClick={() => router.push(`/view-request`)}
                  type="button"
                  className="w-full md:w-fit text-[#FF0000] border border-[#FF0000]"
                />
                <Button
                  text="Submit Another Leave Request"
                  bgcolor={true}
                  onClick={handleClick}
                  type="button"
                  className="w-full md:w-fit"
                />
              </div>
            </div>
          ) : (
            <div
              className={`${
                role === 'PM' ? 'hidden' : 'block'
              } flex flex-wrap md:flex-nowrap items-center gap-4`}
            >
              <Button
                type="button"
                text={'Save Request'}
                onClick={() => handleStatus(formData1)}
                disabled={loadingButton || !isChecked}
                className="w-full !bg-green-600 disabled:cursor-not-allowed disabled:opacity-[0.6] md:w-fit"
              />
            </div>
          )}
        </div>
      </form>
      {isModel && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999]">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => {
              setIsModel(false);
              setActiveIndex(0);
              setDateSelectionMode('individual');
              setMultiDates([{ leave_date: '' }]);
              setRangeDates({ start: '', end: '' });
            }}
          />
          {renderModalContent()}
        </div>
      )}
    </div>
  );
}

export default StepTwo;
