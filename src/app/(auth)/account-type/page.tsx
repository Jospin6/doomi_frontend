import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";

export default function AccountType() {
    return <div className="h-screen">
        <div className="text-3xl h-[80px] flex items-center pl-4 font-bold"><IoArrowBack size={20} className="mr-3"/> <span>doomi</span></div>
        <div className="w-full h-[calc(100vh-80px)] flex flex-col justify-center items-center px-16">
            <div className="mb-4">
                <h1 className="text-xl font-semibold">Account type</h1>
                <h4 className="text-[14px] text-gray-600 mb-3">Choose your account type</h4>
            </div>
            <RadioGroup defaultValue="option-one" className="grid grid-cols-4 gap-6 w-full">
                <div className="col-span-2 h-[100px] p-2 rounded-xl border border-gray-400">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="PERSONNAL" id="option-one" />
                        <Label htmlFor="option-one">Personnel</Label>
                    </div>
                    <div className="text-[14px] text-gray-600 mt-3">
                        Lorem ipsum dolor sit amet, consectetur ad
                    </div>
                </div>
                <div className="col-span-2 h-[100px] p-2 rounded-xl border border-gray-400">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="BUSINESS" id="option-two" />
                        <Label htmlFor="option-two">Professionnal</Label>
                    </div>
                    <div className="text-[14px] text-gray-600 mt-3">
                        Lorem ipsum dolor sit amet, consectetur ad
                    </div>
                </div>
            </RadioGroup>
        </div>
    </div>
}