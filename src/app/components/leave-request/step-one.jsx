"use client";
import React, { useEffect, useRef, useState } from "react";
import Heading from "../ui/heading";
import CustomSelector from "../ui/selector";
import { Plus, X } from "lucide-react";
import useLeaveReq from "./use-leave-req.hook";
import Button from "../ui/button";
import Cookies from "js-cookie";
import loading from "../../../common/assets/icons/loader.svg";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { format, set, parse } from "date-fns";
import { useRouter } from "next/navigation";
import axiosInstance from "../../../utils/axios-instance";

function StepOne({ onSubmit, onNext }) {
  const router = useRouter();
  const modalRef = useRef(null);
  const role = Cookies.get("role");
  const token = Cookies.get("access-token");
  const [writeIndex, setWriteIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [dateSelectionMode, setDateSelectionMode] = useState("individual");
  const [rangeDates, setRangeDates] = useState({
    start: "",
    end: "",
  });
  const [multiRanges, setMultiRanges] = useState([]);

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
  } = useLeaveReq();

  const handleChange = (index, field, value) => {
    setRows((prev) => {
      const updated = [...prev];

      if (selectedRows.length > 1 && selectedRows.includes(index)) {
        // Bulk update: apply to all selected rows
        selectedRows.forEach((rowIdx) => {
          updated[rowIdx] = {
            ...updated[rowIdx],
            [field]: value,
          };
        });
      } else {
        // Single row update
        updated[index] = {
          ...updated[index],
          [field]: value,
        };
      }

      return updated;
    });
  };

  // Parse a date string into a local Date (avoids timezone shifting)
  const parseLocalDate = (value) => {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (typeof value === "string") {
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const [y, m, d] = value.split("-").map(Number);
        return new Date(y, m - 1, d);
      }
      try {
        return parse(value, "MMM-dd-yyyy", new Date());
      } catch (e) {
        return new Date(value);
      }
    }
    return new Date(value);
  };

  // Ensure payload gets exact 'yyyy-MM-dd' string
  const toYMD = (val) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    return format(val, "yyyy-MM-dd");
  };

  const handleAddRow = (newType) => {
    if (rows.length === 0) {
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
      const lastRow = rows[rows.length - 1];

      if (
        newType === "single" &&
        (!lastRow.leave_date || lastRow?.leave_date?.trim() === "")
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

    setIsToggle(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      regional_manager: regionalManagersId,
      leave_requests: rows?.map((row) => {
        if (row.entry_type === "date range") {
          const { leave_date, ...rest } = row;
          return {
            ...rest,
            start_date: toYMD(row.leave_date),
            end_date: toYMD(row.end_date),
            entry_type: "date range",
          };
        }

        if (row.entry_type === "single") {
          const { end_date, ...rest } = row;
          return {
            ...rest,
            leave_date: toYMD(row.leave_date),
            entry_type: "single",
          };
        }
        if (row.entry_type === "multiple" || row.entry_type === "") {
          const { end_date, ...rest } = row;
          return {
            ...rest,
            leave_date: toYMD(row.leave_date),
            entry_type: "single",
          };
        }

        return row;
      }),
    };
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
      console.log(error, '..error')
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
        toast.error(error?.response?.data?.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLeaveRequest = async (e) => {
    e.preventDefault();
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
      regional_manager: regionalManagersId,
      leave_requests: rows?.map((row) => ({
        leave_date: toYMD(row.leave_date),
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

  const handleRowSelect = (index, checked) => {
    setSelectedRows((prev) =>
      checked ? [...prev, index] : prev.filter((i) => i !== index)
    );
  };

  const handleDateChange2 = (date) => {
    if (!date) return;

    if (dateSelectionMode === "individual") {
      const formatted = format(date, "yyyy-MM-dd");
      
      // Prevent duplicate dates within modal selection list
      if (multiDates.some((d) => d.leave_date === formatted)) {
        toast.error("This date is already selected.");
        return;
      }
      
      // Instant validate against already added rows (single and ranges)
      const conflictsWithSingles = rows.some(
        (r) =>
          r.entry_type === "single" &&
          r.leave_date &&
          new Date(r.leave_date).toDateString() ===
            new Date(formatted).toDateString()
      );
      if (conflictsWithSingles) {
        toast.error(`Date ${formatted} is already added.`);
        return;
      }
      
      const insideExistingRange = rows.some((r) => {
        if (r.entry_type !== "date range" || !r.leave_date || !r.end_date)
          return false;
        const d = new Date(formatted);
        const start = new Date(r.leave_date);
        const end = new Date(r.end_date);
        return start <= d && d <= end;
      });
      if (insideExistingRange) {
        toast.error(`Date ${formatted} is already included in a range.`);
        return;
      }
      
      // Check against existing ranges in multiRanges
      const insideMultiRange = multiRanges.some((r) => {
        const d = new Date(formatted);
        const start = new Date(r.start);
        const end = new Date(r.end);
        return start <= d && d <= end;
      });
      if (insideMultiRange) {
        toast.error(`Date ${formatted} is already included in a selected range.`);
        return;
      }
      
      const updated = [...multiDates];
      updated[writeIndex].leave_date = formatted;
      // Only add a new field if last field is filled and not a duplicate
      if (
        writeIndex === updated.length - 1 &&
        formatted &&
        !updated.some((d, idx) => d.leave_date === "" && idx !== writeIndex)
      ) {
        updated.push({ leave_date: "" });
      }
      setMultiDates(updated);
      setWriteIndex(writeIndex + 1);
    } else {
      // Multiple range selection logic
      if (Array.isArray(date) && date[0] && date[1]) {
        const start = format(date[0], "EEE, yyyy-MM-dd");
        const end = format(date[1], "EEE, yyyy-MM-dd");
        const startYMD = format(date[0], "yyyy-MM-dd");
        const endYMD = format(date[1], "yyyy-MM-dd");
        
        // Prevent duplicate ranges inside modal list
        if (multiRanges.some((r) => r.start === start && r.end === end)) {
          toast.error("This range is already selected.");
          return;
        }
        
        // Check for overlapping ranges in multiRanges
        const overlappingMultiRange = multiRanges.some((r) => {
          const newStart = new Date(startYMD);
          const newEnd = new Date(endYMD);
          const existingStart = new Date(r.start);
          const existingEnd = new Date(r.end);
          return (
            (newStart <= existingEnd && newEnd >= existingStart) ||
            (existingStart <= newEnd && existingEnd >= newStart)
          );
        });
        if (overlappingMultiRange) {
          toast.error("This range overlaps with an already selected range.");
          return;
        }
        
        // Instant validate against already added rows
        const duplicateExistingRange = rows.some(
          (r) =>
            r.entry_type === "date range" &&
            r.leave_date &&
            r.end_date &&
            new Date(r.leave_date).toDateString() ===
              new Date(startYMD).toDateString() &&
            new Date(r.end_date).toDateString() ===
              new Date(endYMD).toDateString()
        );
        if (duplicateExistingRange) {
          toast.error(`Range ${startYMD} - ${endYMD} is already added.`);
          return;
        }
        
        // Check for overlapping ranges in existing rows
        const overlappingExistingRange = rows.some((r) => {
          if (r.entry_type !== "date range" || !r.leave_date || !r.end_date)
            return false;
          const newStart = new Date(startYMD);
          const newEnd = new Date(endYMD);
          const existingStart = new Date(r.leave_date);
          const existingEnd = new Date(r.end_date);
          return (
            (newStart <= existingEnd && newEnd >= existingStart) ||
            (existingStart <= newEnd && existingEnd >= newStart)
          );
        });
        if (overlappingExistingRange) {
          toast.error("This range overlaps with an already added range.");
          return;
        }
        
        const singleInsideRange = rows.some((r) => {
          if (r.entry_type !== "single" || !r.leave_date) return false;
          const d = new Date(r.leave_date);
          const s = new Date(startYMD);
          const e = new Date(endYMD);
          return s <= d && d <= e;
        });
        if (singleInsideRange) {
          toast.error(
            `Some dates in range ${startYMD} - ${endYMD} are already added as single leave.`
          );
          return;
        }
        
        // Check if any individual dates in multiDates fall within this range
        const multiDateInRange = multiDates.some((d) => {
          if (!d.leave_date) return false;
          const date = new Date(d.leave_date);
          const s = new Date(startYMD);
          const e = new Date(endYMD);
          return s <= date && date <= e;
        });
        if (multiDateInRange) {
          toast.error(
            `Some selected individual dates fall within this range ${startYMD} - ${endYMD}.`
          );
          return;
        }
        
        setMultiRanges([...multiRanges, { start, end }]);
        setRangeDates({ start: "", end: "" }); // Reset picker for next range
      } else if (!rangeDates.start || rangeDates.end) {
        setRangeDates({
          start: format(date[0], "EEE, yyyy-MM-dd"),
          end: "",
        });
      } else {
        setRangeDates((prev) => ({
          ...prev,
          end: format(date[1], "EEE, yyyy-MM-dd"),
        }));
      }
    }
  };

  const renderModalContent = () => (
    <div
      className="relative z-10 bg-white rounded-lg shadow-lg p-6 w-[45vw] max-h-[90vh] overflow-auto"
      ref={modalRef}
    >
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={dateSelectionMode === "individual"}
            onChange={() => {
              setDateSelectionMode("individual");
              setRangeDates({ start: "", end: "" });
            }}
          />
          Individual Dates
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={dateSelectionMode === "range"}
            onChange={() => {
              setDateSelectionMode("range");
              setMultiDates([{ leave_date: "" }]);
              setWriteIndex(0);
            }}
          />
          Date Range
        </label>
      </div>

      <div className="flex gap-6">
        <DatePicker
          inline
          selected={
            dateSelectionMode === "individual"
              ? multiDates[activeIndex]?.leave_date
                ? new Date(multiDates[activeIndex]?.leave_date)
                : null
              : rangeDates.start
              ? new Date(rangeDates.start)
              : null
          }
          selectsRange={dateSelectionMode === "range"}
          showYearDropdown
          showMonthDropdown
          startDate={
            dateSelectionMode === "range" && rangeDates.start
              ? new Date(rangeDates.start)
              : null
          }
          endDate={
            dateSelectionMode === "range" && rangeDates.end
              ? new Date(rangeDates.end)
              : null
          }
          monthsShown={dateSelectionMode === "individual" ? null : 2}
          minDate={new Date()}
          dropdownMode="select"
          onChange={handleDateChange2}
        />

        <div className="flex flex-col gap-4 w-full overflow-x-auto h-[20vw]">
          {dateSelectionMode === "individual" &&
            multiDates.map((item, index) => (
              <div key={index} className="relative">
                <input
                  readOnly
                  type="text"
                  value={item.leave_date}
                  placeholder="MMM-DD-YYYY"
                  className={`w-full py-2 px-4 border rounded-md text-sm ${
                    writeIndex === index
                      ? "border-[#335679]"
                      : "border-gray-300"
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

          {dateSelectionMode === "range" &&
            multiRanges.map((range, idx) => (
              <div key={idx} className="relative">
                <input
                  readOnly
                  type="text"
                  value={`${range.start} - ${range.end}`}
                  placeholder="MMM-DD-YYYY"
                  className="w-full py-2 px-4 border rounded-md text-sm border-gray-300"
                />
                <button
                  type="button"
                  className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 text-red-500 text-sm"
                  onClick={() => {
                    setMultiRanges(multiRanges.filter((_, i) => i !== idx));
                  }}
                >
                  ✕
                </button>
              </div>
            ))}

          {dateSelectionMode === "range" &&
            rangeDates.start &&
            rangeDates.end && (
              <div className="relative">
                <input
                  readOnly
                  type="text"
                  value={`${rangeDates.start} - ${rangeDates.end}`}
                  placeholder="MMM-DD-YYYY"
                  className="w-full py-2 px-4 border rounded-md text-sm border-gray-300"
                />
                <button
                  type="button"
                  className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 text-red-500 text-sm"
                  onClick={() => {
                    setRangeDates({ start: "", end: "" });
                  }}
                >
                  ✕
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );

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
  }, []);

  useEffect(() => {
    if (writeIndex >= multiDates.length) {
      const firstEmptyIndex = multiDates?.findIndex((d) => !d.leave_date);
      setWriteIndex(
        firstEmptyIndex !== -1 ? firstEmptyIndex : multiDates.length - 1
      );
    }
  }, [multiDates]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isModel &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        let newRows = [];

        if (dateSelectionMode === "range") {
          // Add all selected ranges as rows, format as 'yyyy-MM-dd'
          newRows = multiRanges.map((range) => ({
            leave_date: format(new Date(range.start), "yyyy-MM-dd"),
            end_date: format(new Date(range.end), "yyyy-MM-dd"),
            leave_type: "",
            reason: "",
            entry_type: "date range",
          }));
        } else {
          const validDates = multiDates.filter((d) => d.leave_date);
          validDates.sort(
            (a, b) => new Date(a.leave_date) - new Date(b.leave_date)
          );

          newRows = validDates.map((d) => ({
            leave_date: d.leave_date,
            end_date: "",
            leave_type: "",
            reason: "",
            entry_type: "single",
          }));
        }

        // Filter out duplicates
        const filteredRows = newRows.filter((newRow) => {
          if (newRow.entry_type === "single") {
            // Check for duplicate single date in rows
            const exists = rows.some(
              (row) =>
                row.entry_type === "single" &&
                row.leave_date === newRow.leave_date
            );
            if (exists) {
              toast.error(`Date ${newRow.leave_date} is already added.`);
              return false;
            }
            // Check if date is inside any range
            const inRange = rows.some(
              (row) =>
                row.entry_type === "date range" &&
                row.leave_date <= newRow.leave_date &&
                row.end_date >= newRow.leave_date
            );
            if (inRange) {
              toast.error(
                `Date ${newRow.leave_date} is already included in a range.`
              );
              return false;
            }
            return true;
          } else if (newRow.entry_type === "date range") {
            // Check for duplicate range
            const exists = rows.some(
              (row) =>
                row.entry_type === "date range" &&
                row.leave_date === newRow.leave_date &&
                row.end_date === newRow.end_date
            );
            if (exists) {
              toast.error(
                `Range ${newRow.leave_date} - ${newRow.end_date} is already added.`
              );
              return false;
            }
            // Check if any single date in rows is inside this range
            const singleInRange = rows.some(
              (row) =>
                row.entry_type === "single" &&
                row.leave_date >= newRow.leave_date &&
                row.leave_date <= newRow.end_date
            );
            if (singleInRange) {
              toast.error(
                `Some dates in range ${newRow.leave_date} - ${newRow.end_date} are already added as single leave.`
              );
              return false;
            }
            return true;
          }
          return true;
        });

        const updatedRows = [...rows, ...filteredRows]
          .filter((item) => item.leave_date)
          .sort((a, b) => new Date(a.leave_date) - new Date(b.leave_date));

        setWriteIndex(0);
        setActiveIndex(0);
        setIsModel(false);
        setRows(updatedRows);
        setDateSelectionMode("individual");
        setMultiDates([{ leave_date: "" }]);
        setRangeDates({ start: "", end: "" });
        setMultiRanges([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModel, multiDates, dateSelectionMode, rows, rangeDates]);

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
      const matchedProvince = allProvinces?.find(
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
        const matchedProvince = allProvinces?.find(
          (item) => item.province_name === userData.provinces[0]?.province_name
        );
        if (matchedProvince) {
          setProvinceId(matchedProvince.province_id);
        }
      }

      if (
        userData.regional_managers &&
        userData.regional_managers[0] &&
        regionalManagers?.length > 0 &&
        !regionalManagersId
      ) {
        const matchedManager = regionalManagers?.find(
          (item) =>
            item.regional_manager_name ===
            userData.regional_managers[0]?.regional_manager_name
        );
        if (matchedManager) {
          setRegionalManagersId(matchedManager.regional_manager_id);
          setAllClinics(matchedManager.clinics);
        }
      }

      if (
        userData.regional_managers &&
        userData.regional_managers[0]?.clinics[0]?.clinic_name &&
        regionalManagers?.length > 0 &&
        !clinicId
      ) {
        const matchedManager = allClinics?.find(
          (item) =>
            item.clinic_name?.trim().toLowerCase() ===
            userData.regional_managers[0]?.clinics[0].clinic_name
              ?.trim()
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
      const matchedManager = regionalManagers?.find(
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
          (item.name?.trim().toLowerCase() ||
            item.clinic_name?.trim().toLowerCase()) ===
          getData.clinic_name?.trim().toLowerCase()
      );
      if (matchedManager) {
        setClinicId(matchedManager.clinic_id || matchedManager.id);
      }
    }

    if (getData?.provider_name && allProviders?.length > 0) {
      const matchedManager = allProviders?.find((item) => {
        const isMatch =
          item.name?.trim().toLowerCase() ===
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
                <div className="md:w-[31.5%] w-full">
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
                <div className="md:w-[31.5%] w-full">
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

            <div className="flex items-center justify-between py-5 border-[#D9DADF] border-t w-[99%]">
              <Heading title="Add Leave Details" />
              <div className="relative">
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
              <div className="relative">
                <table className="w-full">
                  <thead className="border-b-[#D9DADF] border-b border-solid">
                    <tr>
                      <th className="text-left p-1 w-[3%]">
                        <input
                          type="checkbox"
                          className="mx-2"
                          checked={
                            selectedRows.length === rows.length &&
                            rows.length > 0
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRows(rows.map((_, idx) => idx));
                            } else {
                              setSelectedRows([]);
                            }
                          }}
                        />
                      </th>
                      <th className="text-left p-1 w-[12%] text-[16px] text-[#373940] font-semibold">
                        Leave Date
                      </th>
                      <th className="text-left p-1 w-[10%] text-[16px] text-[#373940] font-semibold">
                        Leave Type
                      </th>
                      <th className="text-left p-1 w-[25%] text-[16px] text-[#373940] font-semibold">
                        Reason
                      </th>
                      <th className="text-left p-1 w-[5%]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows?.map((row, index) => {
                      const isSelected = selectedRows.includes(index);
                      const isRange = row.entry_type === "date range";
                      return (
                        <tr
                          key={index}
                          className={`${
                            index !== 0 ? "border-t border-[#E6EAEE]" : ""
                          } hover:shadow-[0_2px_4px_0_rgba(60,64,67,0.1),0_2px_6px_2px_rgba(60,64,67,0.15)] hover:transition-all hover:duration-200 hover:z-10`}
                        >
                          <td className="p-1">
                            <input
                              type="checkbox"
                              className="mx-2"
                              checked={isSelected}
                              onChange={(e) =>
                                handleRowSelect(index, e.target.checked)
                              }
                            />
                          </td>
                          <td className="p-1">
                            <DatePicker
                              name="leave_date"
                              minDate={new Date()}
                              dropdownMode="select"
                              selectsRange={isRange}
                              showYearDropdown
                              showMonthDropdown
                              dateFormat="yyyy-MM-dd"
                              endDate={isRange ? parseLocalDate(row.end_date) : null}
                              startDate={
                                isRange ? parseLocalDate(row.leave_date) : null
                              }
                              selected={
                                !isRange
                                  ? row.leave_date
                                    ? parseLocalDate(row.leave_date)
                                    : null
                                  : null
                              }
                              className="py-[6px] w-full px-4 bg-white text-[#000] placeholder:text-[#1f1f1fa9] focus:outline-0 text-sm rounded-[8px] border border-[#D9DADF]"
                              onChange={(date) => {
                                if (!isRange) {
                                  const formatted = date
                                    ? format(date, "yyyy-MM-dd")
                                    : "";
                                  handleChange(index, "leave_date", formatted);
                                } else {
                                  const [start, end] = date;
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
                                }
                              }}
                            />
                          </td>
                          <td className="p-1">
                            <CustomSelector
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
                            />
                          </td>
                          <td className="p-1">
                            <textarea
                              rows={1}
                              value={row.reason}
                              placeholder="Enter Reason"
                              className="bg-white disabled:cursor-not-allowed text-[#000] w-full py-[6px] px-4 placeholder:text-[#1f1f1fa9] focus:outline-0 text-sm rounded-[8px] border border-[#D9DADF] mt-[6px]"
                              onChange={(e) =>
                                handleChange(index, "reason", e.target.value)
                              }
                            />
                          </td>
                          <td className="p-1">
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
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => {
              setIsModel(false);
              setActiveIndex(0);
              setDateSelectionMode("individual");
              setMultiDates([{ leave_date: "" }]);
              setRangeDates({ start: "", end: "" });
            }}
          />
          {renderModalContent()}
        </div>
      )}
    </div>
  );
}

export default StepOne;
