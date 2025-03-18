"use client";

import Link from "next/link";
import Image from "next/image";
import { Libre_Caslon_Text } from "next/font/google"
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from 'framer-motion';

const libreCaslon = Libre_Caslon_Text({
    subsets: ["latin"],
    weight: ["400", "700"], // Regular (400) & Bold (700)
    display: "swap",
});

export default function ClaimTimer() {
    const TIMER_DURATION = 21600; // 6 hours in seconds

    const [time, setTime] = useState(TIMER_DURATION); // 10초 타이머
    const [onClaim, setOnClaim] = useState(true);
    const [n2o, setN2O] = useState(0);
    const timerRef = useRef(null);
    const hasFinished = useRef(false);



    useEffect(() => {
        // localStorage에서 시작 시간 불러오기
        const storedStartTime = localStorage.getItem("timerStartTime");
        const lastCompletionTime = localStorage.getItem("lastCompletionTime");//timer 만료 후 체크위한 값

        if (storedStartTime) {
            const elapsedTime = Math.floor((Date.now() - Number(storedStartTime)) / 1000);
            const remainingTime = Math.max(TIMER_DURATION - elapsedTime, 0);

            if (remainingTime > 0) {
                setTime(remainingTime);
                setOnClaim(false);
                startInterval(remainingTime);
            } else {
                // Timer has finished while away
                if (!lastCompletionTime || lastCompletionTime !== storedStartTime) {
                    // Only increment N2O if we haven't recorded this completion
                    handleN2O();
                    localStorage.setItem("lastCompletionTime", storedStartTime);
                }
                localStorage.removeItem("timerStartTime");
                setOnClaim(true);
            }
        }

        // 초기 n2o 값 불러오기
        const storedN2O = localStorage.getItem("n2o");
        if (storedN2O) {
            setN2O(Number(storedN2O));
        }

        // Cleanup interval on unmount
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const startInterval = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        timerRef.current = setInterval(() => {
            setTime((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setOnClaim(true);
                    const currentStartTime = localStorage.getItem("timerStartTime");
                    localStorage.setItem("lastCompletionTime", currentStartTime);
                    localStorage.removeItem("timerStartTime");
                    if (!hasFinished.current) {
                        handleN2O();
                        hasFinished.current = true;
                    }
                    return 0; // Return 0 instead of 10
                }
                return prev - 1;
            });
        }, 1000);
    };

    const startTimer = () => {
        setOnClaim(false);
        setTime(TIMER_DURATION);
        hasFinished.current = false;
        localStorage.setItem("timerStartTime", Date.now().toString());
        startInterval();
    };

    const handleN2O = () => {
        const currentN2O = localStorage.getItem("n2o");
        const newN2O = (Number(currentN2O) || 0) + 2000; // 🔥 기존 값에 1000 더함
        localStorage.setItem("n2o", newN2O); // 🔥 업데이트된 값 저장
        setN2O(newN2O); // 🔥 상태 업데이트

    };



    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };


    // 프로그레스 바 너비 계산 (0% ~ 100%)

    const progressWidth = onClaim ? '0%' : `${((TIMER_DURATION - time) / TIMER_DURATION) * 100}%`;


    return (
        <AnimatePresence mode="wait">
            <motion.div className=" flex flex-col h-full justify-evenly items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="w-full h-[40%] flex justify-center items-center relative">
                    <div className=" bg-boxBg w-[90%] h-full max-w-[450px] rounded-[23px] flex flex-col justify-between overflow-hidden">
                        <div className="w-full max-w-[450px] px-[3%] py-[2%] rounded-[23px] flex items-center  relative active:scale-95 transition-transform duration-100 ">
                            <div className="w-[5vmax] aspect-[59/59] relative">
                                <Image
                                    src="/image/p_icon2.png"
                                    alt="main logo"
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                            <div className=" w-full flex flex-col px-[5%]">
                                <div className="flex justify-between items-center">
                                    <p className={` text-white text-[1.8vmax] sm:text-[2vmin]
               mt-1 `}>{n2o >= 1000000 ? `${n2o / 1000000}m` : n2o >= 1000 ? `${n2o / 1000}k` : n2o} PDG</p>
                                    <p className="text-white text-[1.6vmax] sm:text-[2vmin] opacity-20">Score</p>
                                </div>
                                <div className=" flex justify-around">
                                    <p className="w-full text-[1.6vmax] sm:text-[2vmin] -rotate-0 text-white bg-clip-text text-transparent ">Check your Score</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-[80%] relative bg-white">
                            <Image
                                src="/image/pdg_main.png"
                                alt="main logo"
                                layout="fill"
                                objectFit="contain"
                            />
                        </div>
                    </div>
                </div>
                <div className="w-full h-[30%] flex justify-center items-center relative  ">
                    <div className="w-[90%] py-[2%] h-full sm:w-[90%] relative flex flex-col justify-between rounded-[23px] bg-boxBg">
                        <div className="w-full flex justify-around items-center  ">
                            <p className="  text-[#06F7A1] text-[4.5vmin] sm:text-[2.5vmin] font-bold">Earn 2000 PDG</p>
                            <p className=" text-[#808080] text-[4.5vmin] sm:text-[2.5vmin] font-bold ">{formatTime(time)}</p>
                        </div>
                        <p className="text-white opacity-50 text-center text-[3vmin] sm:text-[1.5vmin]">Enter your favorite restaurant name and get PDG.</p>
                        <div className="w-full relative flex justify-center py-[2%] items-end ">
                            <div className="w-[65%] h-[1vmin] xs:h-[0.8vmin] sm:h-[0.7vmin] rounded-3xl bg-[#787880] relative ">
                                <div className="w-full bg-[#007AFF] rounded-3xl h-full absolute left-0" style={{ width: progressWidth }}></div>
                                <div className="w-[4vmin] sm:w-[2.5vmin] aspect-[1/1] bg-white rounded-full absolute -top-[150%] xs:-top-[200%] sm:-top-[150%]" style={{ left: progressWidth }}></div>
                            </div>
                        </div>
                        {onClaim ? <p onClick={startTimer} className=" border-t-[0.5px] border-t-borderBlack text-center text-[#007AFF] text-[2.3vmax] xs:text-[2.35vmax] sm:text-[1.5vmax]
                        active:scale-90 transition-transform duration-200">Claim now</p>
                            :
                            <p onClick={startTimer} className=" border-t-[0.5px] border-t-borderBlack text-center text-[#646464] text-[2.3vmax] xs:text-[2.35vmax] sm:text-[1.5vmax]
                        active:scale-90 transition-transform duration-200">Claim now</p>}
                    </div>
                </div>

                <Link href="/balance" className=" py-[3%] bg-boxBg rounded-[23px] w-[90%] sm:w-[90%] flex flex-col justify-center items-center relative">
                    <p className=" text-white text-[2.3vmax] xs:text-[2.35vmax] sm:text-[1.5vmax] z-10 font-bold">Get More Tickets</p>
                    <p className=" text-white opacity-50 text-[3vmin] sm:text-[1.3vmin] z-10 ">Exchange your PDG for tickets to enter the game.</p>
                    <p className=" w-full py-[2%] mt-[4%] border-t-[0.5px] border-t-borderBlack text-center text-[#FF453A] text-[2.3vmax] xs:text-[2.35vmax] sm:text-[1.5vmax]
                        active:scale-90 transition-transform duration-200">Go to get tickets</p>
                </Link>
            </motion.div>
        </AnimatePresence>
    );
};

