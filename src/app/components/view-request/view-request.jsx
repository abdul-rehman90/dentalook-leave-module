"use client";

import { useState } from "react";
import Heading from "../ui/heading";
import Button from "../ui/button";
import CustomSelector from "../ui/selector";
import Input from "../ui/input";
import DataTabel from "./data-table";
import useViewReq from "./use-view-req.hook";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import loading from "../../../common/assets/icons/loader.svg";
import useWindowWidth from "../../utils/use-width.hook";

function ViewRequest() {
  const {
    provinceId,
    setProvinceId,
    allProvinces,
    clinicId,
    setClinicId,
    allClinics,
    regionalManagers,
    regionalManagersId,
    setRegionalManagersId,
    docName,
    setDocName,
    allProviders,
    providerId,
    setProviderId,
    getReqData,
    isLoading,
    role,
    allClicnicData,
    handleDateChange,
    startDate,
    endDate,
    setDateRange,
    setAllClinics,
    leavePlanned,
    setLeavePlanned,
    leaveStatus,
    setLeaveStatus,
    coverageNeeded,
    setCoverageNeeded,
    handleProvice,
    handleChangeRM,
    clinics,
    handleChangeClinic,
    handleChangeProvider,
    handleChangeProviderName,
  } = useViewReq();
  const [filterLoader, setFilterLoader] = useState(false);
  const handleClearFilter = () => {
    setFilterLoader(true);
    if (role === "LT") {
      setProvinceId("");
      setRegionalManagersId("");
      setClinicId("");
      setAllClinics([]);
      setDocName("");
      setProviderId("");
      setLeaveStatus("");
      setLeavePlanned("");
      setCoverageNeeded(null);
      setDateRange([null, null]);
    } else if (role === "RM") {
      setClinicId("");
      setAllClinics([]);
      setDocName("");
      setProviderId("");
      setLeaveStatus("");
      setLeavePlanned("");
      setCoverageNeeded(null);
      setDateRange([null, null]);
    } else if (role === "PM") {
      setDocName("");
      setProviderId("");
      setLeaveStatus("");
      setLeavePlanned("");
      setCoverageNeeded(null);
      setDateRange([null, null]);
    }
    setTimeout(() => {
      setFilterLoader(false);
    }, 1000);
  };

  const width = useWindowWidth();

  return (
    <div>
      <div className="p-5 border border-[#E6EAEE] rounded-2xl mt-2 w-full max-w-[1230px] mx-auto">
        <div>
          <div className="flex justify-between md:flex-row flex-col gap-4 w-full">
            <div>
              <Heading
                title="View all Leave Requests here"
                subtitle="Review all the leave requests submitted here"
              />
            </div>
            <div>
              <Button
                // text="Clear filters"
                text={
                  filterLoader ? (
                    <Image src={loading} alt="loading" width={24} height={24} />
                  ) : (
                    "Clear filters"
                  )
                }
                bgcolor={true}
                type="button"
                disabled={filterLoader}
                onClick={handleClearFilter}
                className="disabled:opacity-[0.8] disabled:cursor-not-allowed"
              />
            </div>
          </div>
          <div className="py-5">
            <div className="grid md:grid-cols-5 grid-cols-1 gap-2 mb-4">
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
                    placeholder={width > 1100 ? "Select Provider Title" : " Select Provider..."}
                    labelKey="name"
                    value={docName}
                    className="disabled:opacity-[0.8] disabled:cursor-not-allowed"
                />

                <CustomSelector
                    onChange={(value, options) => {
                    setProviderId(value);
                    role === "LT" && handleChangeProviderName(value, options);
                    }}
                    label="Provider Name"
                    options={allClicnicData}
                    placeholder={width > 1100 ? "Select Provider Name" : " Select Provider..."}
                    labelKey="name"
                    valueKey="id"
                    value={providerId}
                    showSearch={true}
                    className="disabled:opacity-[0.8] disabled:cursor-not-allowed"
                />

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
                    disabled={role === "RM" || role === "PM" ? true : false}
                    className="disabled:opacity-[0.8] disabled:cursor-not-allowed"
                />

                <CustomSelector
                    onChange={(value, options) => {
                    setRegionalManagersId(value);
                    role === "LT" && handleChangeRM(value);
                    // setAllClinics(options?.clinics)
                    }}
                    label="Regional Manager"
                    options={regionalManagers}
                    placeholder={width > 1100 ? "Select Regional Manager" : " Select Regional..."}
                    labelKey={role === "PM" ? "regional_manager_name" : "name"}
                    valueKey={role === "PM" ? "regional_manager_id" : "id"}
                    showSearch={true}
                    value={regionalManagersId}
                    disabled={role === "RM" || role === "PM" ? true : false}
                    className="disabled:opacity-[0.8] disabled:cursor-not-allowed"
                />

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
                    value={clinicId}
                    showSearch={true}
                    disabled={role === "PM" ? true : false}
                    className="disabled:opacity-[0.8] disabled:cursor-not-allowed"
                />
            </div>

            <div className="grid md:grid-cols-4 grid-cols-1 gap-2">
              <div className="request_Datepicker">
                <label className="text-[13px] mb-[5px] block font-semibold text-[#373940]">
                  Leave Request Date
                </label>
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="MMM-dd-yyyy"
                  onChange={(update) => {
                    setDateRange(update);
                    handleDateChange(update);
                  }}
                  isClearable={true}
                  className="w-full flex rounded-[8px] bg-white text-[#000] items-center justify-between border border-[#D9DADF] px-4 py-2 text-sm font-medium focus:outline-none"
                />
              </div>
              <div>
                <CustomSelector
                  label="Leave Type"
                  options={[
                    { name: "Emergency", value: "emergency" },
                    { name: "Planned", value: "planned" },
                  ]}
                  placeholder="Select Leave Type"
                  labelKey="name"
                  valueKey="value"
                  value={leavePlanned}
                  onChange={(value) => setLeavePlanned(value)}
                />
              </div>
              <div>
                <CustomSelector
                  label="Status"
                  options={[
                    { name: "Pending", value: "pending" },
                    { name: "Declined", value: "decline" },
                    { name: "Approved", value: "approved" },
                  ]}
                  placeholder="Select Status"
                  labelKey="name"
                  valueKey="value"
                  value={leaveStatus}
                  onChange={(value) => setLeaveStatus(value)}
                />
              </div>
              <div>
                <CustomSelector
                  label="Coverage Needed"
                  options={[
                    { name: "Yes", value: true },
                    { name: "No", value: false }
                  ]}
                  placeholder="Select Coverage Needed"
                  labelKey="name"
                  valueKey="value"
                  value={coverageNeeded}
                  onChange={(value) => setCoverageNeeded(value)}
                />
              </div>
            </div>
          </div>
          <div className="overflow-auto">
            <DataTabel getReqData={getReqData} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewRequest;
