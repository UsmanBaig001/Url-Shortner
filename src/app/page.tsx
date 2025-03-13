import Link from "next/link";
import { CiLogin } from "react-icons/ci";
import CustomText from "@/components/customText/CustomText";
import CustomSlugInput from "@/components/customSlugInput/CustomSlugInput";
import TrialTable from "@/components/trialTable/TrialTable";
import AutoPasteClipboard from "@/components/autoPasteClipboard/AutoPasteClipboard";
import { THEME_COLORS } from "@/constants/constants";

export default function TrialPage() {
  return (
    <div className={`min-h-screen text-gray-100`}>
      <nav className="relative z-10 flex justify-between items-center p-6">
        <h1 className={`text-[34px] font-[700] text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] to-[#0066FF]`}>
          Linkly
        </h1>
        <div className="flex gap-4">
          <button className={`px-6 bg-[${THEME_COLORS.BG_DARKER}] rounded-[25px] py-2 flex text-[15px] items-center gap-2 text-gray-300 hover:text-white`}>
            <Link href="./signin">Login</Link>
            <CiLogin size={25} color='white' />
          </button>
          <div className="hidden md:block">
            <button className={`px-7 py-3 rounded-[30px] bg-blue-500`}>
              <Link href="./signup">Register Now</Link>
            </button>
          </div>
        </div>
      </nav>
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <CustomText
          title="Shorten Your Loooong Links :)"
          description="Linkly is an efficient and easy-to-use URL shortening service that streamlines your online experience."
        />
        <div className="max-w-[100%] md:max-w-[80%] flex flex-col justify-center items-center mx-auto mb-8">
          <CustomSlugInput
            title="Shorten Now!"
            placeholder="Enter the link here"
            fetchAction="trial"
          />
          <AutoPasteClipboard />
        </div>
        <TrialTable />
      </main>
    </div>
  );
}