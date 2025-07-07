import React, { useEffect, useState } from "react";
import Heading from "../ui/heading";
import CustomSelector from "../ui/selector";
import Input from "../ui/input";
import { Plus } from "lucide-react";
import DateInput from "../ui/date-input";
import Button from "../ui/button";
import useSteptwo from "./use-steptwo.hook";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import loader from "../../../common/assets/icons/blue-loader.svg";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

function StepTwo({ onPrev, onNext,setCurrentStep }) {
  const [formData, setFormData] = useState({});
  const param = useSearchParams();
  const getIdParam = param.get("leaveRequestId");
  const getStatusParam = param.get("status");
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();

  const { getData, isLoading, handleStatus, loadingButton, declineReq } =
    useSteptwo({ onNext });

  const [formData1, setFormData2] = useState([]);
  useEffect(() => {
    const days = getData?.days || [];
    if (days?.length > 0) {
      setFormData2(
        days.map((day) => ({
          leave_date: day.leave_date,
          leave_type: day.leave_type,
          reason: day.reason,
        }))
      );
    }
  }, [getData]);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const rightSideSteps = [
    {
      title: "1. Review the Provider Contract",
      description:
        "Verify the vacation entitlement as outlined in the contract",
    },
    {
      title: "2. Confirm Vacation Allowance",
      description:
        "Check the remaining vacation days available to the provider",
    },
    {
      title: "3. Assss Notification Requirement ",
      description:
        "Review the required notice period for leave requests as stipulated in the contract",
    },
    {
      title: "4. Connect with the provider",
      description:
        "Get in touch with the provider to understand their reason for the request",
    },
    {
      title: "5. Decide on Approval",
      description: "Approve or decline the request based on the evaluation",
    },
  ];

  const providerInfo = [
    { label: "Provider Title", value: getData?.provider_name?.user_type },
    { label: "Provider’s Name", value: getData?.provider_name?.name },
  ];

  const locationInfo = [
    { label: "Province", value: getData?.province },
    { label: "Regional Manager", value: getData?.regional_manager },
    { label: "Clinic", value: getData?.clinic_name },
  ];

    const handleClick = () => {
        localStorage.removeItem("leaveRequestId");
        setCurrentStep(0);
        router.replace("/leave-request");
    }

  return (
    <div className="">
      <Heading
        title="Review Leave Request"
        subtitle="Please review the leave request before taking any decision."
      />
      <form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-5">
          {isLoading ? (
            <Image src={loader} alt="" width={80} height={80} />
          ) : (
            <div className="flex justify-between flex-col h-full gap-8">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 py-2 md:py-5">
                  {formData1?.map((day, dayIdx) => (
                    <React.Fragment key={dayIdx}>
                      <div className="flex flex-col gap-2">
                        <label className="text-[13px] text-[#373940] font-medium block">
                          Leave Date
                        </label>
                        <DatePicker
                          selected={
                            day.leave_date ? new Date(day.leave_date) : null
                          }
                          minDate={new Date()}
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          dateFormat="YYYY-MM-dd"
                          className="py-[8px] w-full px-4 disabled:opacity-50 disabled:cursor-not-allowed text-[#1F1F1F] block placeholder:text-[#1f1f1fa9] focus:outline-0 text-sm rounded-xl border border-[#D9DADF]"
                          name="leave_date"
                          placeholderText="Leave Date"
                          onChange={(date) => {
                            const updated = [...formData1];
                            updated[dayIdx].leave_date = date
                              ? format(date, "yyyy-MM-dd")
                              : "";
                            setFormData2(updated);
                          }}
                          disabled
                        />
                      </div>
                      <CustomSelector
                        label="Leave Type"
                        options={[
                          { name: "Emergency", value: "emergency" },
                          { name: "Planned", value: "planned" },
                        ]}
                        value={day.leave_type}
                        onChange={(value, option) => {
                          const updated = [...formData1];
                          updated[dayIdx].leave_type = value;
                          setFormData2(updated);
                        }}
                        labelKey="name"
                        disabled
                        className="disabled:opacity-50 disabled:cursor-not-allowed"
                      />

                      <Input
                        label="Reason"
                        placeholder="Reason"
                        value={day.reason}
                        onChange={(e) => {
                          const updated = [...formData1];
                          updated[dayIdx].reason = e.target.value;
                          setFormData2(updated);
                        }}
                        disabled
                        className="disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="bg-[#F8F8F8] p-4.5 rounded-xl">
            {rightSideSteps.map((step, index) => (
              <div className={`mt-${index === 0 ? "0" : "5"}`} key={index}>
                <h2 className="text-base font-medium text-[#111B2B]">
                  {step.title}
                </h2>
                <p className="text-[#67728A] text-sm">{step.description}</p>
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
          className={`justify-between flex flex-wrap md:flex-nowrap  w-full items-end gap-3.5 md:py-4 mt-5`}
        >
          <button
            type="button"
            className={` w-full md:w-fit py-[6px] md:py-[11px] rounded-xl text-base text-[#335679] font-medium px-[75px] cursor-pointer border border-[#D0D5DD]`}
            onClick={() => {
              onPrev();
              router.replace("/leave-request?step=1");
            }}
          >
            Edit Request
          </button>
          {getStatusParam === "decline" || declineReq === true ? (
            <div className="flex flex-col gap-2 items-end">
              <p className="text-red-600">Your Request has been declined.</p>
              <div
                className={`flex flex-wrap md:flex-nowrap items-center gap-2`}
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
            </div>
          ) : (
            <div className={`flex flex-wrap md:flex-nowrap items-center gap-2`}>
              <Button
                text={
                  loadingButton === "decline"
                    ? "Declining..."
                    : "Decline Request"
                }
                // textcolor={true}
                bgcolor={true}
                onClick={() => handleStatus("decline")}
                type="button"
                disabled={loadingButton !== null || !isChecked}
                className="w-full disabled:cursor-not-allowed disabled:opacity-[0.7] md:w-fit"
              />
              <Button
                text={
                  loadingButton === "approved"
                    ? "Approving..."
                    : "Approve Request"
                }
                bgcolor={true}
                onClick={() => handleStatus("approved")}
                type="button"
                disabled={loadingButton !== null || !isChecked}
                className="w-full disabled:cursor-not-allowed disabled:opacity-[0.7] md:w-fit"
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default StepTwo;
