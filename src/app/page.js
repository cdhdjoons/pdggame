import Image from "next/image";
import Link from "next/link";
import ClaimTimer from "./components/claimtimer";


export default function Home() {
  return (
    <div className=" w-full h-full">
      <div className=" w-full h-full max-w-[500px] pt-[10%] relative flex flex-col justify-evenly " >
        <div className="w-full flex justify-center items-center relative">
          <div className="w-[45vmax] max-w-[400px] aspect-[543/183] relative ">
            <Image
              src="/image/jet_logo.png"
              alt="main logo"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </div>
        <div className="w-full flex justify-center items-center relative">
          <a href="https://x.com/JFT_official_X" target="_blank" rel="noopener noreferrer">
            <div className="w-[35vmax] max-w-[450px] flex items-center aspect-[501/87] relative active:scale-95 transition-transform duration-100 ">
              <Image
                src="/image/jet_btn.png"
                alt="main logo"
                fill
                style={{ objectFit: "cover" }}
                priority
              />
              <p className="w-full text-center text-[1.6vmax] sm:text-[2vmin] -rotate-0
        bg-gradient-to-r from-[#A9FF8A] via-[#77FF8B] to-[#45C060] bg-clip-text text-transparent ">To Earn Coin, Join in Twitter</p>
            </div>
          </a>
        </div>
        <ClaimTimer />
        
      </div>
    </div>
  );
}
