"use client";

import React, { useEffect, useState } from "react";
import StepIndicator from "./step-indicator";
import Button from "../ui/button";
import Heading from "../ui/heading";
import CustomSelector from "../ui/selector";
import Input from "../ui/input";
import { Plus } from "lucide-react";
import DateInput from "../ui/date-input";
import StepOne from "./step-one";
import StepTwo from "./step-two";
import StepThree from "./step-three";
import StepFour from "./step-four";



const stepTitles = [
    "Add Leave Request",
    "Review Request",
    "Secure Coverage",
    "Process Completed",

];

const LeaveRequest = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const handleFileChange = (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setFormData(prev => ({
            ...prev,
            [field]: field === 'documents' ? Array.from(files) : files[0]
        }));
    };

    const addReference = () => {
        setFormData(prev => ({
            ...prev,
            references: [...prev.references, '']
        }));
    };

    const handleReferenceChange = (index, value) => {
        setFormData(prev => {
            const newReferences = [...prev.references];
            newReferences[index] = value;

            return { ...prev, references: newReferences };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentStep < stepTitles.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            console.log('Form submitted:', formData);
        }
    };






    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <>
                        <StepOne />
                        <div className="flex justify-end gap-3.5 py-4 mt-5">
                            <Button
                                text='Cancel'
                                textcolor={true}
                                border={true}
                                // onClick={() => setCurrentStep(currentStep - 1)}
                                href='/leave-request'
                                type='button'
                            />
                            <Button
                                text='Next'
                                bgcolor={true}
                                type='submit'

                            />
                        </div>
                    </>
                );
            case 1:
                return (
                    <>
                        <StepTwo />
                        <div className="flex justify-end gap-3.5 py-4 mt-5">
                            <Button
                                text='Cancel'
                                textcolor={true}
                                border={true}
                                onClick={() => setCurrentStep(currentStep - 1)}
                                type='button'
                            />
                            <Button
                                text='Next'
                                bgcolor={true}
                                type='submit'

                            />
                        </div>
                    </>
                );

            case 2:
                return (
                    <>
                        <StepThree />
                        <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-end gap-3.5 py-4 mt-5">
                            <Button
                                className='!text-[#335679] w-full md:!w-fit text-nowrap !px-6'
                                text='No Coverage Secured'
                                textcolor={true}
                                border={true}
                                onClick={() => setCurrentStep(currentStep - 1)}
                                type='button'
                            />
                            <Button
                                className='!text-red-600 w-full md:!w-fit text-nowrap !bg-transparent !border !border-red-600 !px-6'
                                text='Partial Coverage Secured'
                                bgcolor={true}
                                type='submit'

                            />
                            <Button
                                className='w-full md:!w-fit text-nowrap !px-6'
                                text='All Coverage Secured'
                                bgcolor={true}
                                type='submit'

                            />
                        </div>
                    </>
                );

            case 3:
                return (
                    <>
                        <StepFour />
                        <div className="flex justify-end gap-3.5 py-4 mt-5">
                            <Button
                                text='Cancel'
                                textcolor={true}
                                border={true}
                                type='button'
                                onClick={() => setCurrentStep(currentStep - 1)}
                            />
                            <Button
                                text='Next'
                                bgcolor={true}
                                type='submit'
                            />
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className="w-full h-full ">
            <div className="flex flex-col lg:flex-row w-full h-full">
                <div className="w-full flex flex-col">
                    <div className="w-full max-w-[1230px] mx-auto">
                        <StepIndicator
                            stepTitles={stepTitles}
                            currentStep={currentStep}
                        />
                    </div>
                    <form onSubmit={handleSubmit} className="w-full">
                        {renderStep()}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LeaveRequest;
