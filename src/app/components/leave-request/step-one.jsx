"use client";
import React, { useEffect, useRef, useState } from "react";
import Heading from "../ui/heading";
import CustomSelector from "../ui/selector";
import Input from "../ui/input";
import { Plus, X } from "lucide-react";
import useLeaveReq from "./use-leave-req.hook";
import Button from "../ui/button";
import axios from "axios";
import Cookies from "js-cookie";
import loading from "../../../common/assets/icons/loader.svg";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { format, set } from "date-fns";
import { useRouter } from "next/navigation";
import axiosInstance from "../../../utils/axios-instance";

function StepOne({ onSubmit, onNext }) {
  const router = useRouter();
  const token = Cookies.get("access-token");
  const role = Cookies.get("role");
  const [isLoading, setIsLoading] = useState(false);

  const {
    allProvinces,
    setProvinceId,
    setClinicId,
    allClinics,
    clinicId,
    allProviders,
    rows,
    setRows,
    providerId,
    setProviderId,
    provinceId,
    getData,
    regionalManagers,
    regionalManagersId,
    setRegionalManagersId,
    formId,
    allClicnicData,
    docName,
    setDocName,
    setAllClinics,
    userData,
    handleProvice,
    handleChangeRM,
    clinics,
    handleChangeClinic,
    handleChangeProvider,
    handleChangeProviderName,
    isToggle,
    setIsToggle,
    isModel,
    setIsModel,
    setButtonName,
    buttonName,
    multiDates,
    setMultiDates,
    endDate,
    startDate,
    handleDateChange,
    setDateRange,
  } = useLeaveReq();

  // Update field values
  const handleChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const handleAddRow = (newType) => {
    if (rows.length === 0) {
      // No rows yet — just add the first one
      setRows([
        {
          leave_date: "",
          end_date: "",
          leave_type: "",
          reason: "",
          entry_type: newType,
        },
      ]);
    } else if (rows[0].entry_type === newType) {
      // Same type — clone only if last row has a valid leave_date
      const lastRow = rows[rows.length - 1];

      if (
        newType === "single" &&
        (!lastRow.leave_date || lastRow.leave_date.trim() === "")
      ) {
        toast.error("Please select a Leave Date before adding a new row.");
        return;
      }

      if (
        newType === "date range" &&
        (!lastRow.leave_date || !lastRow.end_date)
      ) {
        toast.error("Please select a complete Leave Request Date range.");
        return;
      }

      setRows([
        ...rows,
        {
          leave_date: "",
          end_date: "",
          leave_type: "",
          reason: "",
          entry_type: newType,
        },
      ]);
    } else {
      setRows([
        {
          leave_date: "",
          end_date: "",
          leave_type: "",
          reason: "",
          entry_type: newType,
        },
      ]);
    }

    setButtonName(
      newType === "single"
        ? "Single Leave"
        : newType === "date range"
        ? "Leave Range"
        : "Multiple Leaves"
    );

    setIsToggle(false);
  };

  useEffect(() => {
    setRows([
      {
        leave_date: "",
        end_date: "",
        leave_type: "",
        reason: "",
        entry_type: "single",
      },
    ]);
    setButtonName("Single Leave");
  }, []);

  const lastRow = rows[rows.length - 1];
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Sequential validation
    if (!provinceId) {
      toast.error("Please select Province");
      return;
    }
    if (!regionalManagersId) {
      toast.error("Please select Regional Manager");
      return;
    }
    if (!clinicId) {
      toast.error("Please select Clinic");
      return;
    }
    if (!docName) {
      toast.error("Please select Provider Title");
      return;
    }
    if (!providerId) {
      toast.error("Please select Provider Name");
      return;
    }
    // Validate leave rows
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row.leave_date || row.leave_date === "") {
        toast.error(`Please select Leave Date for row ${i + 1}`);
        return;
      }
      if (!row.leave_type || row.leave_type === "") {
        toast.error(`Please select Leave Type for row ${i + 1}`);
        return;
      }
      if (!row.reason || row.reason === "") {
        toast.error(`Please enter Reason for row ${i + 1}`);
        return;
      }
    }
    setIsLoading(true);
    const payload = {
      clinic: clinicId,
      provider: providerId,
      leave_requests: rows?.map((row) => {
        if (row.entry_type === "date range") {
          const { leave_date, ...rest } = row;
          return {
            ...rest,
            start_date: row.leave_date,
            entry_type: "date range",
          };
        }

        if (row.entry_type === "single") {
          const { end_date, ...rest } = row;
          return {
            ...rest,
            leave_date: row.leave_date,
            entry_type:
              row.entry_type === "multiple" ? "single" : row.entry_type,
          };
        }

        if (row.entry_type === "multiple") {
          const { end_date, ...rest } = row;
          return {
            ...rest,
            leave_date: row.leave_date,
            entry_type: "single",
          };
        }

        // Default: return as-is
        return row;
      }),
    };
    console.log(payload, "rows");

    try {
      const response = await axiosInstance.post(
        `api/v1/leave-requests/`,
        payload
      );
      if (response.status === 201) {
        localStorage.setItem("leaveRequestId", response.data?.id);
        onNext();
        router.replace(`${window.location.pathname}?step=2`);
      }
    } catch (error) {
      const errors = error?.response?.data?.leave_requests;
      if (Array.isArray(errors)) {
        errors.forEach((errObj) => {
          Object.values(errObj).forEach((msgArr) => {
            if (Array.isArray(msgArr)) {
              msgArr.forEach((msg) => toast.error(msg));
            } else {
              toast.error(msgArr);
            }
          });
        });
      } else {
        toast.error("An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLeaveRequest = async (e) => {
    e.preventDefault();
    // Validate leave rows
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      if (!row.leave_date || row.leave_date === "") {
        toast.error(`Please select Leave Date for row ${i + 1}`);
        return;
      }
      if (!row.leave_type || row.leave_type === "") {
        toast.error(`Please select Leave Type for row ${i + 1}`);
        return;
      }
      if (!row.reason || row.reason === "") {
        toast.error(`Please enter Reason for row ${i + 1}`);
        return;
      }
    }
    setIsLoading(true);
    const paylaod = {
      clinic: clinicId,
      provider: providerId,
      leave_requests: rows?.map((row) => ({
        leave_date: row.leave_date,
        leave_type: row.leave_type,
        reason: row.reason,
      })),
    };
    try {
      const response = await axiosInstance.patch(
        `api/v1/update-leave-request/${formId}/`,
        paylaod
      );
      if (response.status === 200) {
        toast.success(response?.data?.detail);
        onNext();
      }
    } catch (error) {
      toast.error(error.response?.data?.error);
    } finally {
      setIsLoading(false);
    }
  };

  const providerTitleOptions = [
    { name: "DDS", value: "DDS" },
    { name: "RDH", value: "RDH" },
    { name: "RDT", value: "RDT" },
  ];
  useEffect(() => {
    if (role === "RM") {
      setProvinceId(allProvinces[0]?.id);
      if (typeof window !== "undefined") {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData) {
          setRegionalManagersId(userData?.id);
          const rmObj = regionalManagers?.find((rm) => rm.id === userData?.id);
          if (rmObj && rmObj.clinics) {
            setAllClinics(rmObj.clinics);
          }
        }
      }
    }

    if (getData?.province && allProvinces?.length > 0) {
      const matchedProvince = allProvinces.find(
        (item) => item.name === getData.province
      );
      if (matchedProvince) {
        setProvinceId(matchedProvince.id);
      }
    }

    if (role === "PM") {
      if (
        userData.provinces &&
        userData.provinces[0] &&
        allProvinces?.length > 0
      ) {
        const matchedProvince = allProvinces.find(
          (item) => item.province_name === userData.provinces[0]?.province_name
        );
        if (matchedProvince) {
          setProvinceId(matchedProvince.province_id);
        }
      }
      // =================

      if (
        userData.regional_managers &&
        userData.regional_managers[0] &&
        regionalManagers?.length > 0 &&
        !regionalManagersId
      ) {
        const matchedManager = regionalManagers.find(
          (item) =>
            item.regional_manager_name ===
            userData.regional_managers[0]?.regional_manager_name
        );
        if (matchedManager) {
          setRegionalManagersId(matchedManager.regional_manager_id);
          setAllClinics(matchedManager.clinics);
        }
      }
      // ====================
      if (
        userData.regional_managers &&
        userData.regional_managers[0]?.clinics[0]?.clinic_name &&
        regionalManagers?.length > 0 &&
        !clinicId
      ) {
        const matchedManager = allClinics?.find(
          (item) =>
            item.clinic_name.trim().toLowerCase() ===
            userData.regional_managers[0]?.clinics[0].clinic_name
              .trim()
              .toLowerCase()
        );
        if (matchedManager) {
          setClinicId(matchedManager.clinic_id);
        }
      }
    }

    if (
      getData?.regional_manager &&
      regionalManagers?.length > 0 &&
      !regionalManagersId
    ) {
      const matchedManager = regionalManagers.find(
        (item) => item.name === getData?.regional_manager
      );
      if (matchedManager) {
        setRegionalManagersId(matchedManager.id);
        setAllClinics(matchedManager.clinics);
      }
    }

    if (getData?.clinic_name && regionalManagers?.length > 0 && !clinicId) {
      const matchedManager = allClinics?.find(
        (item) =>
          item.name.trim().toLowerCase() ===
          getData.clinic_name.trim().toLowerCase()
      );

      if (matchedManager) {
        setClinicId(matchedManager.id);
      }
    }

    if (getData?.provider_name && allProviders?.length > 0) {
      const matchedManager = allProviders?.find((item) => {
        const isMatch =
          item.name.trim().toLowerCase() ===
          getData?.provider_name?.name?.trim().toLowerCase();
        return isMatch;
      });
      if (matchedManager) {
        setProviderId(matchedManager.id);
      }
    }

    if (getData?.provider_name && providerTitleOptions?.length > 0) {
      const matchedManager = providerTitleOptions?.find(
        (item) =>
          item.name?.trim().toLowerCase() ===
          getData.provider_name?.user_type?.trim().toLowerCase()
      );
      if (matchedManager) {
        setDocName(matchedManager.value);
      }
    }

    if (getData?.days && getData.days.length > 0) {
      setRows(getData.days);
    }
  }, [role, getData, allProvinces, regionalManagers, allClinics, allProviders]);

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const isAllSelected = rows.length > 0 && selectedRows.length === rows.length;

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(rows.map((_, idx) => idx));
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (index, checked) => {
    setSelectedRows((prev) =>
      checked ? [...prev, index] : prev.filter((i) => i !== index)
    );
  };

  const handleBatchChange = (field, value) => {
    const updatedRows = rows.map((row, index) =>
      selectedRows.includes(index) ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
  };

  const datePickerRefs = useRef([]);
  const scrollContainerRef = useRef(null);

  // Focus the last date picker
  useEffect(() => {
    const lastIndex = multiDates.length - 1;
    if (datePickerRefs.current[lastIndex]) {
      datePickerRefs.current[lastIndex].setFocus?.();
    }
  }, [multiDates]);
  useEffect(() => {
  if (scrollContainerRef.current) {
    scrollContainerRef.current.scrollTo({
      left: scrollContainerRef.current.scrollWidth,
      behavior: "smooth",
    });
  }
}, [multiDates]);

  return (
    <div>
      <form onSubmit={formId ? handleUpdateLeaveRequest : handleSubmit}>
        <div className="rounded-2xl">
          <div>
            <Heading
              title="Provider Leave Request Form"
              subtitle="Please complete the form below to initiate the provider leave request process"
            />

            <div className="flex flex-wrap gap-5 py-5">
              <div className="flex flex-wrap md:flex-nowrap items-center gap-6 md:w-[99%] w-full">
                <div className="w-full">
                  <CustomSelector
                    onChange={(value) => {
                      setDocName(value);
                      role === "LT" && handleChangeProvider(value);
                    }}
                    label="Provider Title"
                    options={[
                      { name: "DDS", value: "DDS" },
                      { name: "RDH", value: "RDH" },
                      { name: "RDT", value: "RDT" },
                    ]}
                    placeholder="Select Provider Title"
                    labelKey="name"
                    value={docName}
                    disabled={formId ? true : false}
                    className="disabled:opacity-[0.8] disabled:cursor-not-allowed"
                  />
                </div>
                <div className="w-full">
                  <CustomSelector
                    onChange={(value, options) => {
                      setProviderId(value);
                      role === "LT" && handleChangeProviderName(value, options);
                    }}
                    label="Provider Name"
                    options={allClicnicData}
                    placeholder="Select Provider Name"
                    labelKey="name"
                    valueKey="id"
                    value={providerId}
                    showSearch={true}
                    disabled={formId ? true : false}
                    className="disabled:opacity-[0.8] disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="md:w-[31.5%] w-full">
                <CustomSelector
                  onChange={(value) => {
                    setProvinceId(value);
                    role === "LT" && handleProvice(value);
                  }}
                  label="Province"
                  options={allProvinces}
                  placeholder="Select Province"
                  labelKey={role === "PM" ? "province_name" : "name"}
                  valueKey={role === "PM" ? "province_id" : "id"}
                  value={provinceId}
                  disabled={
                    role === "RM" || role === "PM"
                      ? true
                      : false || (formId ? true : false)
                  }
                  className="disabled:opacity-[0.8] disabled:cursor-not-allowed"
                />
              </div>
              <div className="md:w-[31.5%] w-full">
                <CustomSelector
                  onChange={(value, options) => {
                    setRegionalManagersId(value);
                    role === "LT" && handleChangeRM(value);
                    // setAllClinics(options?.clinics)
                  }}
                  label="Regional Manager"
                  options={regionalManagers}
                  placeholder="Select Regional Manager"
                  labelKey={role === "PM" ? "regional_manager_name" : "name"}
                  valueKey={role === "PM" ? "regional_manager_id" : "id"}
                  value={regionalManagersId}
                  showSearch={true}
                  disabled={
                    role === "RM" || role === "PM"
                      ? true
                      : false || (formId ? true : false)
                  }
                  className="disabled:opacity-[0.8] disabled:cursor-not-allowed"
                />
              </div>
              <div className="md:w-[31.5%] w-full">
                <CustomSelector
                  onChange={(value, options) => {
                    setClinicId(value);
                    role === "LT" && handleChangeClinic(value, options);
                  }}
                  label="Clinic"
                  options={role === "LT" ? clinics : allClinics}
                  placeholder="Select Clinic"
                  labelKey={
                    role === "LT"
                      ? "name"
                      : role === "PM" || role === "RM"
                      ? "clinic_name"
                      : "name"
                  }
                  valueKey={
                    role === "LT"
                      ? "id"
                      : role === "PM" || role === "RM"
                      ? "clinic_id"
                      : "id"
                  }
                  showSearch={true}
                  value={clinicId}
                  disabled={
                    role === "PM" ? true : false || (formId ? true : false)
                  }
                  className="disabled:opacity-[0.8] disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Plus Button */}
            <div className="flex items-center justify-between py-5 border-[#D9DADF] border-t w-[99%]">
              <Heading title="Add Leave Details" />
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsToggle(!isToggle)}
                  className="rounded-xl border flex disabled:cursor-not-allowed cursor-pointer items-center p-2 gap-1 w-full md:w-fit border-[#D0D5DD]"
                >
                  <Plus className={`text-[#7DB02D]`} />
                  Add Leave Day(s)
                </button>

                {isToggle && (
                  <div className="absolute bg-white rounded-xl p-2 border-[#D0D5DD] border z-[9]">
                    <button
                      type="button"
                      onClick={() => handleAddRow("single")}
                      className="cursor-pointer"
                    >
                      Single Leave
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddRow("date range")}
                      className="cursor-pointer"
                    >
                      Leave Range
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsModel(true);
                        setIsToggle(false);
                        setButtonName("Multiple Leaves");
                      }}
                      className="cursor-pointer"
                    >
                      Multiple Leaves
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="relative addBorderClass">
              <div className="border-to__Top absolute top-[49px] left-0 right-0 h-[1px] bg-[#D9DADF] w-full"></div>

              <div className="relative addBorderClass">
                <div className="border-to__Top absolute top-[49px] left-0 right-0 h-[1px] bg-[#D9DADF] w-full"></div>

                {/* Select All Checkbox */}
                <div className="flex items-center gap-2 py-3">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                  <label className="!mb-0 font-semibold">Select All</label>
                </div>

                {rows?.map((row, index) => {
                  const isSelected = selectedRows.includes(index);
                  return (
                    <div
                      key={index}
                      className={`flex flex-wrap gap-6 py-5 relative items-center ${
                        index !== 0 && "border-t border-[#E6EAEE]"
                      }`}
                    >
                      <div
                        className={`w-[2%] flex items-center gap-2 ${
                          index === 0 ? "md:mt-[46px]" : "md:mt-[12px]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) =>
                            handleRowSelect(index, e.target.checked)
                          }
                        />
                      </div>

                      {/* Leave Date */}
                      {buttonName.includes("Leave Range") ? (
                        <div className="request_Datepicker md:w-[31.5%] w-full">
                          {index === 0 && (
                            <label className="text-[13px] text-[#373940] font-semibold block">
                              Leave Date
                            </label>
                          )}
                          <DatePicker
                            selectsRange
                            startDate={
                              row.leave_date
                                ? new Date(row.leave_date + "T00:00:00")
                                : null
                            }
                            endDate={
                              row.end_date
                                ? new Date(row.end_date + "T00:00:00")
                                : null
                            }
                            minDate={new Date()}
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="yyyy-MM-dd"
                            isClearable={true}
                            className="w-full flex rounded-[8px] bg-white text-[#000] items-center justify-between border border-[#D9DADF] px-4 py-2 text-sm font-medium focus:outline-none"
                            onChange={(dates) => {
                              const [start, end] = dates;
                              handleChange(
                                index,
                                "leave_date",
                                start ? format(start, "yyyy-MM-dd") : ""
                              );
                              handleChange(
                                index,
                                "end_date",
                                end ? format(end, "yyyy-MM-dd") : ""
                              );
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          className={`flex flex-col gap-2 ${
                            buttonName.includes("Leave Range")
                              ? "md:w-[26.5%]"
                              : "md:w-[20.5%]"
                          } w-full`}
                        >
                          {index === 0 && (
                            <label className="text-[13px] text-[#373940] font-semibold block">
                              Leave Date
                            </label>
                          )}
                          <DatePicker
                            selected={
                              row.leave_date
                                ? new Date(row.leave_date + "T00:00:00")
                                : null
                            }
                            minDate={new Date()}
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="yyyy-MM-dd"
                            className="py-[8px] w-full px-4 bg-white text-[#000] placeholder:text-[#1f1f1fa9] focus:outline-0 text-sm rounded-[8px] border border-[#D9DADF]"
                            name="leave_date"
                            onChange={(date) => {
                              const formatted = date
                                ? format(date, "yyyy-MM-dd")
                                : "";
                              handleChange(index, "leave_date", formatted);
                            }}
                          />
                        </div>
                      )}

                      {/* Leave Type */}
                      <div className="md:w-[22%] w-full">
                        <CustomSelector
                          label={index === 0 && "Leave Type"}
                          options={[
                            { name: "Emergency", value: "emergency" },
                            { name: "Planned", value: "planned" },
                          ]}
                          placeholder="Select Leave Type"
                          value={row.leave_type}
                          onChange={(value) =>
                            handleChange(index, "leave_type", value)
                          }
                          labelKey="name"
                          valueKey="value"
                          className="disabled:cursor-not-allowed"
                          disabled={isSelected}
                        />
                      </div>

                      {/* Reason */}
                      <div
                        className={`${
                          buttonName.includes("Leave Range")
                            ? "md:w-[36.5%]"
                            : "md:w-[46.5%]"
                        }`}
                      >
                        {index === 0 && (
                          <label className="text-[13px] text-[#373940] font-semibold block">
                            Reason
                          </label>
                        )}
                        <textarea
                          rows={1}
                          value={row.reason}
                          placeholder="Enter Reason"
                          className="bg-white disabled:cursor-not-allowed text-[#000] mt-[10px] w-full py-[8px] px-4  placeholder:text-[#1f1f1fa9] focus:outline-0 text-sm rounded-[8px] border border-[#D9DADF]"
                          onChange={(e) =>
                            handleChange(index, "reason", e.target.value)
                          }
                          disabled={isSelected}
                        />
                      </div>

                      {/* Remove Button */}
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newRows = [...rows];
                            newRows.splice(index, 1);
                            setRows(newRows);
                            setSelectedRows((prev) =>
                              prev.filter((i) => i !== index)
                            );
                          }}
                          className="absolute right-[11px] top-0 text-red-500 hover:bg-red-50 rounded-full cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  );
                })}

                {selectedRows.length > 0 && (
                  <div className="flex flex-wrap gap-6 py-4 border border-dashed border-[#ccc] rounded-md p-4 mb-4 bg-[#f9f9f9]">
                    <div className="md:w-[25%] w-full">
                      <CustomSelector
                        label={`Leave Type (${
                          isAllSelected ? "All" : selectedRows.length
                        } Selected)`}
                        options={[
                          { name: "Emergency", value: "emergency" },
                          { name: "Planned", value: "planned" },
                        ]}
                        placeholder="Select Leave Type"
                        onChange={(value) => {
                          setSelectedId(value);
                          handleBatchChange("leave_type", value);
                        }}
                        labelKey="name"
                        valueKey="value"
                        value={selectedId}
                      />
                    </div>
                    <div className="md:w-[45%] w-full">
                      <label className="text-[13px] text-[#373940] font-semibold block">
                        Reason ({isAllSelected ? "All" : selectedRows.length}{" "}
                        Selected)
                      </label>
                      <textarea
                        rows={1}
                        placeholder="Enter Reason"
                        className="bg-white text-[#000] mt-[10px] w-full py-[8px] px-4  placeholder:text-[#1f1f1fa9] focus:outline-0 text-sm rounded-[8px] border border-[#D9DADF]"
                        onChange={(e) =>
                          handleBatchChange("reason", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {formId ? (
            <div className="flex justify-end gap-3.5 py-4 mt-0 md:mt-5">
              <Button
                text={
                  isLoading ? (
                    <Image src={loading} alt="loading" width={24} height={24} />
                  ) : (
                    "Update"
                  )
                }
                bgcolor={true}
                disabled={isLoading}
                className="disabled:opacity-[0.7] disabled:cursor-not-allowed"
                type="submit"
              />
            </div>
          ) : (
            <div className="flex justify-end gap-3.5 py-4 mt-0 md:mt-5">
              <Button
                text={
                  isLoading ? (
                    <Image src={loading} alt="loading" width={24} height={24} />
                  ) : (
                    "Submit for Review"
                  )
                }
                bgcolor={true}
                disabled={isLoading}
                className="disabled:opacity-[0.7] disabled:cursor-not-allowed"
                type="submit"
              />
            </div>
          )}
        </div>
      </form>
      {isModel && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999]">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => {
              setIsModel(false);
              setMultiDates([{ leave_date: "" }]);
            }}
          />

          <div className="relative bg-white rounded-lg shadow-lg p-[43px] z-10 min-w-[250px] h-[31vw] max-w-[42vw] w-full max-h-[90vh] overflow-auto">
            <label className="text-[13px] mb-2 block text-[#373940] font-semibold">
              Leave Date
            </label>

           <div
  ref={scrollContainerRef}
  className="flex gap-3 overflow-x-auto border border-[#D9DADF] rounded-md p-1"
  style={{ whiteSpace: "nowrap" }}
>
  {multiDates.map((item, index) => (
    <div key={index}>
      <DatePicker
        ref={(el) => (datePickerRefs.current[index] = el)}
        selected={item.leave_date ? new Date(item.leave_date) : null}
        onFocus={(e) => e.target.blur()}
        minDate={new Date()}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        dateFormat="yyyy-MM-dd"
        className={`py-[8px] px-[12px] bg-white text-[#000] placeholder:text-[#1f1f1fa9] focus:outline-0 text-sm rounded-[8px] transition-all duration-300 ease-in-out ${
          item.leave_date ? "w-[160px]" : "w-[280px]"
        }`}
        onChange={(date) => {
          const formatted = date ? format(date, "yyyy-MM-dd") : "";
          const updated = [...multiDates];
          updated[index].leave_date = formatted;
          setMultiDates(updated);

          if (
            index === multiDates.length - 1 &&
            formatted &&
            !multiDates.some(
              (d, i) => i !== index && d.leave_date === ""
            )
          ) {
            setMultiDates([...updated, { leave_date: "" }]);
          }
        }}
      />
    </div>
  ))}
</div>



            {multiDates[0]?.leave_date && (
              <button
                type="button"
                className="mt-4 bg-[#335679] text-white px-4 py-2 rounded cursor-pointer"
                onClick={() => {
                  const validDates = multiDates.filter((d) => d.leave_date);
                  if (validDates.length === 0) {
                    toast.error("Please select at least one date.");
                    return;
                  }
                  const firstDate = validDates[0];
                  const extraDates = validDates.slice(1);
                  const updatedFirstRow = {
                    ...rows[0],
                    leave_date: firstDate.leave_date,
                    end_date: "",
                    leave_type: "",
                    reason: "",
                    entry_type: "multiple",
                  };
                  const newRows = extraDates.map((d) => ({
                    leave_date: d.leave_date,
                    end_date: "",
                    leave_type: "",
                    reason: "",
                    entry_type: "multiple",
                  }));

                  setRows([updatedFirstRow, ...rows.slice(1), ...newRows]);
                  setIsModel(false);
                  setMultiDates([{ leave_date: "" }]);
                  setButtonName("Multiple Leaves");
                }}
              >
                Add Leaves
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StepOne;
