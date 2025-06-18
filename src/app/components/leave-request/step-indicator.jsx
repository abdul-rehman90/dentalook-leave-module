import { FC } from "react";
import { Check } from "lucide-react";
import Image from "next/image";
import { Done, completed, notcompleted } from "../../../common/assets/images"


const StepIndicator = ({ stepTitles, currentStep }) => {
    return (
        <div className="w-full px-2" aria-label="Step progress indicator">
            <div className="flex justify-center">
                <div className="flex items-start justify-between w-full md:max-w-full ">
                    {stepTitles.map((title, index) => (
                        <div
                            key={index}
                            className="hidden flex-1 md:flex flex-col items-center relative"
                        >
                            <div className="flex items-center justify-center relative">
                                {index < currentStep ? (
                                    <div
                                        className=" "
                                        aria-label={`Step ${index + 1}: ${title} (completed)`}
                                    >
                                        <Image height={30} width={30} src={Done} alt='icon' />
                                    </div>
                                ) : index === currentStep ? (
                                    <div
                                        className=" "
                                        aria-label={`Step ${index + 1}: ${title} (current)`}
                                        aria-current="step"
                                    >
                                        <Image height={30} width={30} src={completed} alt='icon' />
                                    </div>
                                ) : (
                                    <div
                                        className=""
                                        aria-label={`Step ${index + 1}: ${title} (not started)`}
                                    >
                                        <Image height={30} width={30} src={notcompleted} alt='icon' /></div>
                                )}

                                {index < stepTitles.length - 1 && (
                                    <div className="absolute top-1/2 left-[50px] md:left-[80px] lg:left-[100px] xl:left-[120px] transform -translate-y-1/2 translate-x-2 sm:translate-x-3  w-[26px] lg:w-[60px]">

                                        <div className="absolute inset-0 border border-dashed border-[#D9DADF] rounded-full"></div>
                                        <div
                                            className={`absolute inset-0 border border-[#00465F] border-dashed rounded-full transition-all duration-500`}
                                            style={{
                                                width:
                                                    index < currentStep
                                                        ? "100%"
                                                        : index === currentStep
                                                            ? "00%"
                                                            : "0%",
                                            }}
                                        ></div>
                                    </div>
                                )}
                            </div>
                            <span
                                className={`mt-2 text-base text-nowrap px-1 text-center font-medium block w-full ${index <= currentStep ? "text-[#030303]" : "text-[#7B7B7B]"}`}
                            >
                                {title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StepIndicator;
