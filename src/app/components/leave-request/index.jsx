// "use client";

// import React, { useEffect, useState } from "react";
// import StepIndicator from "./step-indicator";
// import Button from "../ui/button";
// import StepOne from "./step-one";
// import StepTwo from "./step-two";
// import StepThree from "./step-three";
// import StepFour from "./step-four";
// import Link from "next/link";
// import Heading from "../ui/heading";
// import { ArrowRight } from "lucide-react";

// const stepTitles = [
//     "Add Leave Request",
//     "Review Request",
//     "Secure Coverage",
//     "Process Completed",

// ];
// const LeaveRequest = () => {
//     const [currentStep, setCurrentStep] = useState(0);
//     console.log(currentStep, 'my current step')
//     const handleFileChange = (e) => {
//         const files = e.target.files;
//         if (!files || files.length === 0) return;

//         setFormData(prev => ({
//             ...prev,
//             [field]: field === 'documents' ? Array.from(files) : files[0]
//         }));
//     };

//     const addReference = () => {
//         setFormData(prev => ({
//             ...prev,
//             references: [...prev.references, '']
//         }));
//     };

//     const handleReferenceChange = (index, value) => {
//         setFormData(prev => {
//             const newReferences = [...prev.references];
//             newReferences[index] = value;

//             return { ...prev, references: newReferences };
//         });
//     };

//     const handleSubmit = (e) => {
//         console.log('Form submitted:', e);
//         e.preventDefault();
//         if (currentStep < stepTitles.length - 1) {
//             setCurrentStep(currentStep + 1);
//         } else {
//             console.log('Form submitted:', formData);
//         }
//     };

//     const renderStep = () => {
//         switch (currentStep) {
//             case 0:
//                 return (
//                     <>
//                         <StepOne />
//                         <div className="flex justify-end gap-3.5 py-4 mt-0 md:mt-5">
//                             <Button
//                                 text='Next'
//                                 bgcolor={true}
//                                 type='submit'

//                             />
//                         </div>
//                     </>
//                 );
//             case 1:
//                 return (
//                     <>
//                         <StepTwo />
//                         <div className="flex flex-wrap md:flex-nowrap justify-between w-full items-center gap-3.5 md:py-4 mt-5">
//                             <button
//                                 type='button'
//                                 className='w-full md:w-fit py-[6px] md:py-[11px] rounded-xl text-base text-[#335679] font-medium px-[75px] cursor-pointer border border-[#D0D5DD]'
//                                 onClick={() => setCurrentStep(currentStep - 1)}

//                             >Edit Request</button>
//                             <div className='flex flex-wrap md:flex-nowrap items-center gap-2'>
//                                 <Button
//                                     text='Cancel'
//                                     textcolor={true}
//                                     border={true}
//                                     onClick={() => setCurrentStep(currentStep - 1)}
//                                     type='button'
//                                     className='w-full md:w-fit'
//                                 />
//                                 <Button
//                                     text='Next'
//                                     bgcolor={true}
//                                     type='submit'
//                                     className='w-full md:w-fit'
//                                 />
//                             </div>
//                         </div>
//                     </>
//                 );

//             case 2:
//                 return (
//                     <>
//                         <StepThree />
//                         <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-end gap-3.5 py-4 mt-0 md:mt-5">
//                             <Button
//                                 className='!text-[#335679] w-full md:!w-fit text-nowrap !px-6'
//                                 text='No Coverage Secured'
//                                 textcolor={true}
//                                 border={true}
//                                 onClick={() => setCurrentStep(currentStep - 1)}
//                                 type='button'
//                             />
//                             <Button
//                                 className='!text-red-600 w-full md:!w-fit text-nowrap !bg-transparent !border !border-red-600 !px-6'
//                                 text='Partial Coverage Secured'
//                                 bgcolor={true}
//                                 type='submit'

//                             />
//                             <Button
//                                 className='w-full md:!w-fit text-nowrap !px-6'
//                                 text='All Coverage Secured'
//                                 bgcolor={true}
//                                 type='submit'

//                             />
//                         </div>
//                     </>
//                 );

//             case 3:
//                 return (
//                     <>
//                         <div className='flex items-center flex-col justify-center'>
//                             <Heading
//                                 titleClass='font-medium text-center text-2xl text-black group-hover:text-[#335679] font-jakarta transition-colors duration-300'
//                                 title='We have recieved your Leave Request'
//                             />
//                             <div>
//                                 <button onClick={() => setCurrentStep(0)}

//                                     className='!p-0'>
//                                     <div className='group w-full hover:shadow-lg max-w-md mx-auto mt-6 px-6 py-12 border-2 relative rounded-2xl shadow border-white hover:border-[#335679] transition-all duration-300 ease-in-out'>
//                                         <Heading
//                                             titleClass='font-medium text-lg text-black group-hover:text-[#335679] font-jakarta transition-colors duration-300'
//                                             title='Submit Provider Leave Request'

//                                         />
//                                         <div className='absolute hidden group-hover:block top-3 right-3 group-hover:text-[#335679] -rotate-45'>
//                                             <ArrowRight />
//                                         </div>
//                                     </div>
//                                 </button>


//                                 <Link href='/view-request'>
//                                     <div className='group w-full relative hover:shadow-lg max-w-md mx-auto mt-6 px-6 py-12 border-2 rounded-2xl shadow border-white hover:border-[#335679] transition-all duration-300 ease-in-out'>
//                                         <Heading
//                                             titleClass='font-medium text-center text-lg text-black group-hover:text-[#335679] font-jakarta transition-colors duration-300'
//                                             title='View Leave Requests'

//                                         />
//                                         <div className='absolute hidden group-hover:block top-3 right-3 group-hover:text-[#335679] -rotate-45'>
//                                             <ArrowRight />
//                                         </div>
//                                     </div>
//                                 </Link>
//                             </div>
//                         </div>
//                         {/* <StepFour /> */}
//                         {/* <div className="flex flex-wrap md:flex-nowrap justify-end gap-3.5 py-4 mt-0 md:mt-5">
//                             <Button
//                                 text='Cancel'
//                                 textcolor={true}
//                                 border={true}
//                                 type='button'
//                                 onClick={() => setCurrentStep(currentStep - 1)}
//                                 className='w-full md:w-fit'
//                             />
//                             <Link className="w-full md:w-fit" href='/view-request'>
//                                 <Button
//                                     className='w-full md:w-fit'
//                                     text='Next'
//                                     bgcolor={true}
//                                     type='button'
//                                 />
//                             </Link>
//                         </div> */}
//                     </>
//                 );

//             default:
//                 return null;
//         }
//     };

//     return (
//         <div className="w-full h-full ">
//             <div className="flex flex-col lg:flex-row w-full h-full">
//                 <div className="w-full flex flex-col">
//                     <div className="w-full max-w-[1230px] mx-auto">
//                         <StepIndicator
//                             stepTitles={stepTitles}
//                             currentStep={currentStep}
//                         />
//                     </div>
//                     <form onSubmit={handleSubmit} className="w-full p-5 border border-[#E6EAEE] rounded-2xl mt-6">
//                         {renderStep()}
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LeaveRequest;



"use client";

import React, { useState } from "react";
import StepIndicator from "./step-indicator";
import Button from "../ui/button";
import StepOne from "./step-one";
import StepTwo from "./step-two";
import StepThree from "./step-three";
import StepFour from "./step-four";
import Link from "next/link";
import Heading from "../ui/heading";
import { ArrowRight } from "lucide-react";

const stepTitles = [
    "Add Leave Request",
    "Review Request",
    "Secure Coverage",
    "Process Completed",
];

const LeaveRequest = () => {
    const [currentStep, setCurrentStep] = useState(1);

    // Example submit handlers for each step
    const handleStepOneSubmit = (e) => {
        e.preventDefault();
        setCurrentStep(1);
    };

    const handleStepTwoSubmit = (e) => {
        e.preventDefault();
        setCurrentStep(2);
    };

    const handleStepThreeSubmit = (e) => {
        e.preventDefault();
        setCurrentStep(3);
    };

    // Steps as objects with component and submit handler
    const steps = [
        {
            component: (
                <StepOne
                    onSubmit={handleStepOneSubmit}
                    onNext={() => setCurrentStep(1)}
                />
            ),
        },
        {
            component: (
                <StepTwo
                    onSubmit={handleStepTwoSubmit}
                    onPrev={() => setCurrentStep(0)}
                    onNext={() => setCurrentStep(2)}
                />
            ),
        },
        {
            component: (
                <StepThree
                    onSubmit={handleStepThreeSubmit}
                    onPrev={() => setCurrentStep(1)}
                    onNext={() => setCurrentStep(3)}
                />
            ),
        },
        {
            component: (
                <div className='flex items-center flex-col justify-center'>
                    <Heading
                        titleClass='font-medium text-center text-2xl text-black group-hover:text-[#335679] font-jakarta transition-colors duration-300'
                        title='We have received your Leave Request'
                    />
                    <div>
                        <button onClick={() => setCurrentStep(0)} className='!p-0'>
                            <div className='group w-full hover:shadow-lg max-w-md mx-auto mt-6 px-6 py-12 border-2 relative rounded-2xl shadow border-white hover:border-[#335679] transition-all duration-300 ease-in-out'>
                                <Heading
                                    titleClass='font-medium text-lg text-black group-hover:text-[#335679] font-jakarta transition-colors duration-300'
                                    title='Submit Provider Leave Request'
                                />
                                <div className='absolute hidden group-hover:block top-3 right-3 group-hover:text-[#335679] -rotate-45'>
                                    <ArrowRight />
                                </div>
                            </div>
                        </button>
                        <Link href='/view-request'>
                            <div className='group w-full relative hover:shadow-lg max-w-md mx-auto mt-6 px-6 py-12 border-2 rounded-2xl shadow border-white hover:border-[#335679] transition-all duration-300 ease-in-out'>
                                <Heading
                                    titleClass='font-medium text-center text-lg text-black group-hover:text-[#335679] font-jakarta transition-colors duration-300'
                                    title='View Leave Requests'
                                />
                                <div className='absolute hidden group-hover:block top-3 right-3 group-hover:text-[#335679] -rotate-45'>
                                    <ArrowRight />
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            ),
        },
    ];

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
                    {/* Each step handles its own form and submit */}
                    <div className="w-full p-5 border border-[#E6EAEE] rounded-2xl mt-6">
                        {steps[currentStep].component}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaveRequest;