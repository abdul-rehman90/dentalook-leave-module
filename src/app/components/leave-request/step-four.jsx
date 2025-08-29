import React, { useEffect, useState } from "react";
import Heading from "../ui/heading";
import CustomSelector from "../ui/selector";
import Input from "../ui/input";
import Button from "../ui/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../utils/AuthContext";
import useStepThree from "./use-stepthree.hook";
import blueLoader from "../../../common/assets/icons/blue-loader.svg";

function StepFour({ setCurrentStep }) {
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
    coverageProviderList,
    setAllClinics,
    getDataLoader
  } = useStepThree();
  const router = useRouter();
  const [docName, setDocName] = useState("");
  const token = Cookies.get("access-token");
  const { userData } = useAuth();
  const searchParams = useSearchParams();
  const step = searchParams.get("step");

  const providerTitleOptions = [
    { name: "DDS", value: "DDS" },
    { name: "RDH", value: "RDH" },
    { name: "RDT", value: "RDT" },
  ];

  useEffect(() => {
    if (getData?.province && allProvinces?.length > 0) {
      const matchedProvince = allProvinces.find(
        (item) => item.name === getData.province
      );
      if (matchedProvince) {
        setProvinceId(matchedProvince.id);
      }
    }

    if (getData?.regional_manager && regionalManagers?.length > 0) {
      const matchedManager = regionalManagers.find(
        (item) => item.name === getData.regional_manager
      );
      if (matchedManager) {
        setRegionalManagersId(matchedManager.id);
        setAllClinics(matchedManager.clinics);
      }
    }

    if (getData?.clinic_name && regionalManagers?.length > 0 && !clinicId) {
      const matchedManager = allClinics?.find(
        (item) => item.clinic_name === getData.clinic_name
      );
      if (matchedManager) {
        setClinicId(matchedManager.clinic_id);
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

    if (getData?.days && getData?.days?.length > 0) {
      setRows(
        getData.days.map((row) => ({
          ...row,
          coverage_needed: row.coverage_needed ? "yes" : "no",
        }))
      );
    }
  }, [getData, allProvinces, regionalManagers, allClinics, allProviders]);

  // Update field values
  const handleChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };
  const handleClick = () => {
    localStorage.removeItem("leaveRequestId");
    setCurrentStep(0);
    router.replace("/leave-request");
  };

  return (

    <>
      {
        getDataLoader ?
        <Image src={blueLoader} alt="" className='w-[70px] h-[70px] block m-auto' /> :
        <>
          <div className="relative">
            <div className="">
              <div>
                <Heading title="Provider Requiring Coverage" subtitle="" />
                <div className="flex flex-wrap gap-6 py-5">
                  <div className="flex flex-wrap md:flex-nowrap items-center gap-6 md:w-[99%] w-full">
                    <div className="w-full">
                      <CustomSelector
                        onChange={(value) => setDocName(value)}
                        label="Provider Title"
                        options={providerTitleOptions}
                        placeholder="Select Provider Name"
                        labelKey="name"
                        value={docName || getData?.provider_type}
                        disabled={step === "4" ? true : false}
                        className="disabled:cursor-not-allowed disabled:opacity-[0.8]"
                      />
                    </div>
                    <div className="w-full">
                      <CustomSelector
                        onChange={(value) => setProviderId(value)}
                        label="Provider Name"
                        options={allProviders}
                        placeholder="Select Provider Title"
                        labelKey="name"
                        valueKey="id"
                        value={providerId}
                        disabled={step === "4" ? true : false}
                        className="disabled:cursor-not-allowed disabled:opacity-[0.8]"
                      />
                    </div>
                  </div>
                  <div className="md:w-[24%] w-full">
                    <CustomSelector
                      onChange={(value) => {
                        setProvinceId(value);
                      }}
                      label="Province"
                      options={allProvinces}
                      placeholder="Select Provider Title"
                      labelKey="name"
                      valueKey="id"
                      value={provinceId || getData?.province}
                      disabled={step === "4" ? true : false}
                      className="disabled:cursor-not-allowed disabled:opacity-[0.8]"
                    />
                  </div>
                  <div className="md:w-[35%] w-full">
                    <CustomSelector
                      onChange={(value, options) => {
                        setRegionalManagersId(value);
                        setAllClinics(options?.clinics);
                      }}
                      label="Regional Manager"
                      options={regionalManagers}
                      placeholder="Surya Rana"
                      labelKey="name"
                      valueKey="id"
                      value={regionalManagersId}
                      disabled={step === "4" ? true : false}
                      className="disabled:cursor-not-allowed disabled:opacity-[0.8]"
                    />
                  </div>
                  <div className="md:w-[35%] w-full">
                    <CustomSelector
                      onChange={(value) => {
                        setClinicId(value);
                      }}
                      label="Clinic"
                      options={allClinics}
                      placeholder="Select Clinic"
                      labelKey="clinic_name"
                      valueKey="clinic_id"
                      value={clinicId}
                      disabled={step === "4" ? true : false}
                      className="disabled:cursor-not-allowed disabled:opacity-[0.8]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap md:flex-nowrap gap-4 w-full items-center justify-between py-4">
                  <Heading title="Covering Provider Details" />
                </div>
                <div>
                  
                  <table className="w-full border-collapse">
                    <thead className="border-b border-[#D9DADF]">
                      <tr>
                        <th className="text-left p-1 text-[11px] font-bold text-[#373940]">Leave Date</th>
                        <th className="text-left p-1 text-[11px] font-bold text-[#373940]">Leave Type</th>
                        <th className="text-left p-1 text-[11px] font-bold text-[#373940]">Coverage Needed</th>
                        <th className="text-left p-1 text-[11px] font-bold text-[#373940]">Covering Provider Name</th>
                        <th className="text-left p-1 text-[11px] font-bold text-[#373940]">Coverage Type</th>
                        <th className="text-left p-1 text-[11px] font-bold text-[#373940]">Coverage Found By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows?.map((row, index) => (
                        <tr
                    key={index}
                    className={`${
                      index !== rows.length - 1
                        ? 'border-b border-[#E6EAEE]'
                        : ''
                    } hover:shadow-[0_2px_4px_0_rgba(60,64,67,0.1),0_2px_6px_2px_rgba(60,64,67,0.15)] hover:transition-all hover:duration-200 hover:z-10`}
                  >
                          {/* Leave Date */}
                          <td className="p-1">
                            {row.entry_type?.includes("date range") ? (
                              <DatePicker
                                selectsRange
                                startDate={
                                  row.start_date ? new Date(row.start_date + "T00:00:00") : null
                                }
                                endDate={
                                  row.end_date ? new Date(row.end_date + "T00:00:00") : null
                                }
                                minDate={new Date()}
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="MMM-dd-yyyy"
                                isClearable={false}
                                className="w-full flex rounded-[8px] bg-white text-[#000] items-center justify-between border border-[#D9DADF] px-4 py-2 text-sm font-medium focus:outline-none"
                              />
                            ) : (
                              <DatePicker
                                disabled
                                selected={
                                  row.leave_date ? new Date(row.leave_date + "T00:00:00") : null
                                }
                                minDate={new Date()}
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="yyyy-MM-dd"
                                className="py-[8px] bg-white text-[#000] disabled:cursor-not-allowed w-full px-4 block placeholder:text-[#1f1f1fa9] focus:outline-0 text-sm rounded-[8px] border border-[#D9DADF]"
                                name="leave_date"
                                onChange={(date) => {
                                  const formatted = date ? format(date, "yyyy-MM-dd") : "";
                                  handleChange(index, "leave_date", formatted);
                                }}
                              />
                            )}
                          </td>

                          {/* Leave Type */}
                          <td className="p-1">
                            <CustomSelector
                              options={[
                                { name: "Emergency", value: "emergency" },
                                { name: "Planned", value: "planned" },
                              ]}
                              placeholder="Select Leave Type"
                              value={row.leave_type}
                              onChange={(value) => handleChange(index, "leave_type", value)}
                              labelKey="name"
                              valueKey="value"
                              disabled={step === "4"}
                              className="disabled:cursor-not-allowed disabled:opacity-[0.8]"
                            />
                          </td>

                          {/* Coverage Needed */}
                          <td className="p-1">
                            <CustomSelector
                              options={[
                                { name: "Yes", value: "yes" },
                                { name: "No", value: "no" },
                              ]}
                              placeholder="Select Type"
                              value={
                                row.coverage_needed === true
                                  ? "yes"
                                  : row.coverage_needed === false
                                  ? "no"
                                  : row.coverage_needed
                              }
                              onChange={(value) => handleChange(index, "coverage_needed", value)}
                              labelKey="name"
                              valueKey="value"
                              disabled={step === "4"}
                              className="disabled:cursor-not-allowed disabled:opacity-[0.8]"
                            />
                          </td>

                          {/* Covering Provider */}
                          <td className="p-1">
                            <Input
                              placeholder="Enter Coverage"
                              name="coverage_provider"
                              value={
                                row.coverage_needed === false || row.coverage_needed === "no"
                                  ? null
                                  : typeof row.coverage_provider === "object" &&
                                    row.coverage_provider !== null
                                  ? row.coverage_provider.name
                                  : row.coverage_provider
                              }
                              disabled
                              className="disabled:cursor-not-allowed disabled:opacity-[0.8]"
                            />
                          </td>

                          {/* Coverage Type */}
                          <td className="p-1">
                            <CustomSelector
                              options={[
                                { name: "Internal", value: "Internal" },
                                { name: "External", value: "External" },
                                { name: "ACE", value: "ACE" },
                              ]}
                              placeholder="Select Type"
                              value={
                                typeof row.coverage_provider === "object" &&
                                row.coverage_provider !== null
                                  ? row.coverage_provider.provider_coverage
                                  : row.coverage_provider
                              }
                              onChange={(value) => handleChange(index, "coverage_type", value)}
                              labelKey="name"
                              valueKey="value"
                              disabled={row.coverage_needed === "no" || step === "4"}
                              className="disabled:cursor-not-allowed disabled:opacity-[0.8]"
                            />
                          </td>

                          {/* Coverage Found By */}
                          <td className="p-2">
                            <Input
                              placeholder="Enter Coverage"
                              name="coverage_found_by"
                              value={userData?.name}
                              onChange={(e) =>
                                handleChange(index, "coverage_found_by", e.target.value)
                              }
                              disabled
                              className="disabled:cursor-not-allowed disabled:opacity-[0.8]"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                </div>
              </div>
            </div>
          </div>
          <div
            className={`flex-wrap md:flex-nowrap items-center gap-2 flex justify-end`}
          >
            <Button
              text="Go to Dashboard"
              textcolor={true}
              border={true}
              onClick={() => router.push(`/view-request`)}
              type="button"
              className="w-full md:w-fit  text-[#FF0000] border border-[#FF0000]"
            />
            <Button
              text="Submit Another Leave Request"
              bgcolor={true}
              onClick={handleClick}
              type="button"
              className="w-full md:w-fit"
            />
          </div>
        </>
      }
    </>

  );
}

export default StepFour;
