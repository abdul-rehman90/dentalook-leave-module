'use client';

import React, { useEffect, useState } from 'react';
import StepIndicator from './step-indicator';
import Button from '../ui/button';
import StepOne from './step-one';
import StepTwo from './step-two';
import StepThree from './step-three';
import StepFour from './step-four';
import Link from 'next/link';
import Heading from '../ui/heading';
import { ArrowRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const stepTitles = [
  'Add Leave Request',
  'Review Request',
  'Secure Coverage',
  'Process Completed'
];

const LeaveRequest = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    const stepParam = parseInt(searchParams.get('step'), 10);
    const leaveRequestId =
      typeof window !== 'undefined'
        ? localStorage.getItem('leaveRequestId')
        : null;
    if (
      (!leaveRequestId && stepParam >= 2 && stepParam <= 4) ||
      isNaN(stepParam) ||
      stepParam < 1 ||
      stepParam > 4
    ) {
      const params = new URLSearchParams(searchParams);
      params.set('step', '1');
      router.replace(`?${params.toString()}`);
      if (currentStep !== 0) setCurrentStep(0);
      return;
    }
    if (!isNaN(stepParam) && stepParam >= 1 && stepParam <= 4) {
      if (currentStep !== stepParam - 1) {
        setCurrentStep(stepParam - 1);
      }
    }
  }, [searchParams, currentStep]);

  const goToStep = (step) => {
    setCurrentStep(step);
    const params = new URLSearchParams(searchParams);
    params.set('step', step + 1);
    router.replace(`?${params.toString()}`);
  };

  const handleStepOneSubmit = (e) => {
    e.preventDefault();
    goToStep(1);
  };

  const handleStepTwoSubmit = (e) => {
    e.preventDefault();
    goToStep(2);
  };

  const handleStepThreeSubmit = (e) => {
    e.preventDefault();
    goToStep(3);
  };

  // Steps as objects with component and submit handler
  const steps = [
    {
      component: (
        <StepOne onSubmit={handleStepOneSubmit} onNext={() => goToStep(1)} />
      )
    },
    {
      component: (
        <StepTwo
          onSubmit={handleStepTwoSubmit}
          onPrev={() => goToStep(0)}
          onNext={() => goToStep(2)}
          setCurrentStep={setCurrentStep}
        />
      )
    },
    {
      component: (
        <StepThree
          onSubmit={handleStepThreeSubmit}
          onPrev={() => goToStep(1)}
          onNext={() => goToStep(3)}
        />
      )
    },
    {
      component: <StepFour setCurrentStep={goToStep} />
    }
  ];

  return (
    <div className="w-full h-full ">
      <div className="flex flex-col lg:flex-row w-full h-full">
        <div className="w-full flex flex-col">
          <div className="w-full  mx-auto">
            <StepIndicator stepTitles={stepTitles} currentStep={currentStep} />
          </div>
          {/* Each step handles its own form and submit */}
          <div className="w-full p-5 border border-[#E6EAEE] rounded-2xl mt-6  mx-auto">
            {steps[currentStep].component}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
