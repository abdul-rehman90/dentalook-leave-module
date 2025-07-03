import React, { Suspense } from "react";
import LeaveRequest from "../components/leave-request/index";
function Leave() {
  return (
    <Suspense>
      <div className="p-3 md:p-6">
        <LeaveRequest />
      </div>
    </Suspense>
  );
}

export default Leave;
