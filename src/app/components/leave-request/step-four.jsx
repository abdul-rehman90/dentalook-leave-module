import React, { useEffect, useState } from "react";
import Heading from "../ui/heading";
import CustomSelector from "../ui/selector";
import Input from "../ui/input";
import { ArrowRight, Plus } from "lucide-react";
import Button from "../ui/button";
import Canvas from "./canvas";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Cookies from "js-cookie";
import loader from "../../../common/assets/icons/loader.svg";
import axios from "axios";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "../../utils/AuthContext";
import useStepThree from "./use-stepthree.hook";
import Link from "next/link";

function StepFour({setCurrentStep}) {
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
    setAllClinics
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
  ]

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
        console.log(getData?.days, "..getData?.days")
        // setRows(getData.days);
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
  }

  return (
    <>
      <>
        <div className="relative">
          <div className="">
            <div>
              <Heading
                title="Provider Requiring Coverage"
                subtitle="Please complete the form below to initiate the provider requiring coverages"
              />
              <div className="flex flex-wrap gap-6 py-5">
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
                        setAllClinics(options?.clinics)
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
              </div>

              <div className="flex flex-wrap md:flex-nowrap gap-4 w-full items-center justify-between py-4">
                <Heading title="Leave Details" />
              </div>
              {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-2 py-5"></div> */}
              <div>
                {rows?.map((row, index) => (
                  <div
                    key={index}
                    className={`flex gap-2 ${
                      index !== rows.length - 1 ? 'border-b border-[#D9DADF]' : ''
                    }`}
                  >
                    <div className="flex flex-col gap-2 md:w-[15%] w-full pb-3 pt-3">
                      {
                        index === 0 &&
                        <label className="text-[13px] text-[#373940] font-medium block">
                          Leave Date
                        </label>
                      }
                      <DatePicker
                        selected={
                          row.leave_date ? new Date(row.leave_date + 'T00:00:00') : null
                        }
                        minDate={new Date()}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="YYYY-MM-dd"
                        className="disabled:cursor-not-allowed disabled:opacity-[0.8] py-[8px] w-full px-4 text-[#1F1F1F] block placeholder:text-[#1f1f1fa9] focus:outline-0 text-sm rounded-[8px] border border-[#D9DADF]"
                        name="leave_date"
                        onChange={(date) => {
                          const formatted = date
                            ? format(date, "yyyy-MM-dd")
                            : "";
                          handleChange(index, "leave_date", formatted);
                        }}
                        disabled={step === "4" ? true : false}
                      />
                    </div>
                    <div className="md:w-[22%] w-full pb-3 md:border-[#D9DADF] md:border-r pt-3 custom__Selector">
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
                        disabled={step === "4" ? true : false}
                        className="disabled:cursor-not-allowed disabled:opacity-[0.8]"
                      />
                    </div>
                    <div className='md:w-[22%] w-full pb-3 pt-3'>
                      <CustomSelector
                        label={index === 0 && "Coverage Needed"}
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
                            : row.coverage_needed // fallback for initial empty string
                        }
                        onChange={(value) =>
                          handleChange(index, "coverage_needed", value)
                        }
                        labelKey="name"
                        valueKey="value"
                        disabled={step === "4" ? true : false}
                        className="disabled:cursor-not-allowed disabled:opacity-[0.8]"
                      />
                    </div>
                    <div className='md:w-[24%] w-full pb-3 pt-3'>
                      <CustomSelector
                        label={index === 0 && "Covering Provider Name"}
                        options={coverageProviderList}
                        placeholder="Select Type"
                        value={
                            typeof row.coverage_provider === "object" && row.coverage_provider !== null
                            ? row.coverage_provider.name
                            : row.coverage_provider
                        }
                        onChange={(value) =>
                          handleChange(index, "coverage_provider", value)
                        }
                        labelKey="name"
                        valueKey="name"
                        disabled={row.coverage_needed === "no" || step === "4" ? true : false}
                        className="disabled:cursor-not-allowed disabled:opacity-[0.8]"
                        
                      />
                    </div>
                    <div className='md:w-[20%] w-full pb-3 pt-3'>
                      <CustomSelector
                        label={index === 0 && "Coverage Type"}
                        options={[
                            { name: "Internal", value: "Internal" },
                            { name: "External", value: "External" },
                            { name: "ACE", value: "ACE" },
                          ]}
                        placeholder="Select Type"
                        value={
                            typeof row.coverage_provider === "object" && row.coverage_provider !== null
                            ? row.coverage_provider.provider_coverage
                            : row.coverage_provider
                        }
                        onChange={(value) =>
                          handleChange(index, "coverage_type", value)
                        }
                        labelKey="name"
                        valueKey="value"
                        disabled={row.coverage_needed === "no" || step === "4" ? true : false}
                        className="disabled:cursor-not-allowed disabled:opacity-[0.8]"
                      />
                    </div>

                    <div className='md:w-[20%] w-full pb-3 pt-3'>
                      <Input
                        label={index === 0 && "Coverage Found By"}
                        placeholder="Enter Coverage"
                        name="coverage_found_by"
                        value={userData?.name}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "coverage_found_by",
                            e.target.value
                          )
                        }
                        disabled
                        className="disabled:cursor-not-allowed disabled:opacity-[0.8]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
         <div className={`flex-wrap md:flex-nowrap items-center gap-2 flex justify-end`}>
                                <Button
                                    text="Go to Dashboard"
                                    textcolor={true}
                                    border={true}
                                    onClick={()=>router.push(`/view-request`)}
                                    type='button'
                                    className='w-full md:w-fit  text-[#FF0000] border border-[#FF0000]'
                                />
                                <Button
                                    text="Submit Another Leave Request"
                                    bgcolor={true}
                                    onClick={handleClick}
                                    type='button'
                                    className='w-full md:w-fit'
                                />
          </div>
      </>
    </>
  );
}

export default StepFour;
