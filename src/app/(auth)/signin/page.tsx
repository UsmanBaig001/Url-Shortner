import Link from "next/link";
import CustomText from "@/components/customText/CustomText";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignInForm from "@/components/signInForm/SignInForm";
import React from "react";

export default function Page() {
  return (
    <main className="min-h-screen  flex flex-col items-center justify-between relative overflow-hidden">
      <div className="z-10 mt-5">
        <ToastContainer />
        <h1 className={`text-[25px] font-semibold mb-6 bg-gradient-to-r from-[#EB568E] to-[#144EE3] text-transparent bg-clip-text`}>
          Linkly
        </h1>
      </div>
      <div className="relative z-10 w-full px-4 flex flex-col items-center">
        <CustomText
          title="Shorten Your Loooong Links :)"
          description="Linkly is an efficient and easy-to-use URL shortening service that streamlines your online experience."
        />
        <SignInForm />
      </div>
      <div className={`text-gray-400 text-sm z-10 mb-5`}>
        <Link href="/signup" className={`text-blue-500 hover:underline`}>
          Register
        </Link>{" "}
        if not already registered
      </div>
    </main>
  );
}