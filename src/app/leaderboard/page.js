'use client'
import Image from "next/image";
import '../../../styles/leaderboard.css';
import { franklinGothic } from "../../../styles/fonts";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from 'framer-motion';
import rankerDb from "../db/rankerDb";

export default function LeaderBoard() {
    
    const [n2o, setN2O] = useState(0);
    const [teleId, setTeleId] = useState('unknown');
    const [rank, setRank] = useState(0);
    //홀더 숫자 상승 
    const [holderCount, setHolderCount] = useState(145.5);

    useEffect(() => {
        // 초기 n2o 값 불러오기
        const storedN2O = localStorage.getItem("n2o");
        const baseDate = new Date("2025-02-19").getTime(); // 기준 날짜
        const now = Date.now(); // 현재 시간
        const twoDays = 1000 * 60 * 60 * 24 * 2; // 2일을 밀리초로
        const dayCount = Math.floor((now - baseDate) / twoDays);

        if (storedN2O !== null) {
            setN2O(Number(storedN2O));
        }
        setHolderCount(holderCount + (dayCount / 10));
        console.log(dayCount);
    }, []);

    //랭킹 순위
    useEffect(() => {
        const randomRank = Math.floor(Math.random() * (98000 - 95000 + 1)) + 95000;

        setRank(randomRank);

    }, [n2o]);

    useEffect(() => {
        const checkTelegramSDK = () => {
            if (typeof window !== 'undefined' && window.Telegram) {
                const user = window.Telegram.WebApp.initDataUnsafe;
                if (user) {
                    console.log('Telegram User:', user);
                    if (user.user) {
                        setTeleId(user.user.first_name);
                    } else {
                        setTeleId('--')
                        setN2O(0)
                    }
                }
            } else {
                setTimeout(checkTelegramSDK, 1000); // 1초 후 다시 확인
            }
        };

        checkTelegramSDK(); // 초기 실행
    }, []);
    // console.log('its id!', teleId);
    return (
        <AnimatePresence mode="wait">
            <motion.div className=" w-full h-full bg-balanceBg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
            >
                <div className=" w-full h-full max-w-[500px] relative flex flex-col justify-evenly items-center " >
                    <div className={` relative`}>
                        <p className="w-full text-center text-[5vmax] xs:text-[4.5vmax] sm:text-[5vmin] -rotate-2
        bg-gradient-to-r from-[#2FE5F9] via-[#FED9A5] to-[#EB1595] bg-clip-text text-transparent [-webkit-text-stroke:0.6px_black] ">Leaderboard</p>
                    </div>
                    <div className=" flex flex-col items-center ">
                        <div className="w-[30vmax] sm:w-[23vmax] aspect-[324/324] relative active:scale-90 transition-transform duration-200">
                            <Image
                                src="/image/jet_rankcircle.png"
                                alt="main logo"
                                layout="fill"
                                objectFit="fill"
                            />
                            <p className=" absolute bottom-[2%] left-[50%] -translate-x-1/2 text-[#7EFFCC] text-[3.5vmin] sm:text-[1.5vmin]">{teleId === undefined ? '--' : teleId}</p>
                            <div className=" absolute bottom-[15%] left-[50%] -translate-x-1/2 flex gap-[5px]">
                                <p className=" text-[#7EFFCC] text-[2.8vmin] sm:text-[1vmin]">Rank</p>
                                <p className=" text-[#7EFFCC] text-[2.8vmin] sm:text-[1vmin]">{rank}</p>
                            </div>
                            <div className=" absolute bottom-[-8%] left-[50%] -translate-x-1/2 flex justify-between items-center gap-[5px]">
                                <p className=" text-[#7EFFCC] text-[4.8vmin] sm:text-[2vmin]">{n2o}</p>
                            </div>
                        </div>
                    </div>
                    <p className="w-full text-center text-[4vmax] sm:text-[4vmin] -rotate-2
        bg-gradient-to-r from-[#F92FA8] via-[#FED9A5] to-[#1599EB] bg-clip-text text-transparent font-bold ">{holderCount}k Holders</p>
                    <div className="  w-[90%] py-3 flex justify-center items-center max-h-[30vmax] sm:max-h-[500px] 
                     bg-[length:100%_100%] bg-no-repeat " >
                        <div className="scroll-container w-[85%] h-[95%] flex flex-col gap-3 overflow-scroll overflow-x-hidden">
                            {rankerDb.map((ranker, index) => (
                                <div key={ranker.name} className="w-full flex justify-stretch items-center " >
                                    <div className=" relative w-[20%] aspect-[77/77]">
                                        <Image
                                            src="/image/jet_rankerpic.png"
                                            alt="main logo"
                                            layout="fill"
                                            objectFit="cover"
                                        />
                                    </div>
                                    <p className=" w-[45%] text-center text-[#7EFFA5] text-[3.5vmin] sm:text-[1.5vmin]">{ranker.name}</p>
                                    <p className=" flex-1 text-center text-[#7EFFA5] text-[4vmin] sm:text-[1.5vmin]">{ranker.score}</p>
                                    <p className=" flex-1 text-center text-[#7EFFA5] text-[4vmin] sm:text-[2vmin]">{index > 8 ? `0${index + 1}` :`00${index + 1}`}</p>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
