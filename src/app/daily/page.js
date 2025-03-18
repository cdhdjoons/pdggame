'use client'

import Image from "next/image";
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Wallet from "../components/wallet";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

export default function DailyTask() {
    const router = useRouter(); // useRouter로 router 객체 가져오기
    //task list 버튼 관리
    const [disabledTask, setDisabledTask] = useState([true, true, true]);
    //daily reward 관리
    const [disabledDaily, setDisabledDaily] = useState([true, true]);
    //1/24 표시 관리
    const [remainHours, setRemainHours] = useState(null);
    //invite 버튼 5번 클릭 시 포인트 지급 및 비활성화 관리
    const [inviteCount, setInviteCount] = useState(0);

    const manifestUrl = "https://jetfuelgame.vercel.app/tonconnect-manifest.json";


    useEffect(() => {
        // localStorage에서 task 버튼 상태 불러오기
        const storedState = localStorage.getItem("DisabledTask");
        // localStorage에서 daily 시간 가져오기 및 비교
        const lastUpdateDaily = localStorage.getItem("last_update_day1"); //daily
        const lastUpdateRetweet = localStorage.getItem("last_update_day2"); //retweet
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD 형식
        // 현재 시간 표시
        const nowHours = new Date().getHours();
        //invite 카운트 가져오기
        const savedCount = localStorage.getItem("clickCount");
        // console.log(nowHours);
        setRemainHours(24 - nowHours);

        setDisabledDaily([
            lastUpdateDaily !== today,
            lastUpdateRetweet === today ? false : true
        ]);

        if (storedState) {
            setDisabledTask(JSON.parse(storedState));
        }

        if (savedCount) {
            setInviteCount(Number(savedCount));
        }
    }, []);

    //daily 클릭 시 상태 업데이트 
    const dailyHandleClick = (index, reward) => {
        const nowN2O = Number(localStorage.getItem("n2o"));
        setDisabledDaily(prev => {
            const newState = [...prev];
            newState[index] = false;
            return newState;
        });
        localStorage.setItem(`last_update_day${index + 1}`, new Date().toISOString().split("T")[0]); // 클릭한 날짜 저장
        localStorage.setItem("n2o", nowN2O + reward);
    }

    // task list 버튼 클릭 시 상태 업데이트 및 저장
    const handleClick = (index, reward) => {
        if (index === 1 && inviteCount < 5) {
            setInviteCount((prev) => {
                const newCount = prev + 1;
                localStorage.setItem("clickCount", newCount);
                // ✅ inviteCount가 4에서 5로 증가할 때 즉시 실행
                if (newCount === 5) {
                    setDisabledTask((prev) => {
                        const newState = [...prev];
                        newState[1] = false;
                        localStorage.setItem("DisabledTask", JSON.stringify(newState));
                        return newState;
                    });
                }
                return newCount;
            });
            // 이동을 위한 타이머를 설정
            router.push("/invite");
        } else {
            const nowN2O = Number(localStorage.getItem("n2o"));
            setDisabledTask((prev) => {
                const newState = [...prev];
                newState[index] = false; // 클릭된 버튼 비활성화
                localStorage.setItem("DisabledTask", JSON.stringify(newState)); // localStorage에 저장
                return newState;
            });
            localStorage.setItem("n2o", nowN2O + reward);
        }
    };

    return (
        <TonConnectUIProvider manifestUrl={manifestUrl}>
            <AnimatePresence mode="wait">
                <motion.div className={` w-full h-full bg-balanceBg`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                >

                    <div className=" w-full h-full max-w-[500px] relative flex flex-col justify-evenly items-center bg-cover bg-no-repeat " >
                        <div className={` max-w-[500px] relative `} >
                            <p className="w-full text-center text-[6vmax] sm:text-[5vmin] -rotate-2
        bg-gradient-to-r from-[#2FE5F9] via-[#FED9A5] to-[#EB1595] bg-clip-text text-transparent [-webkit-text-stroke:0.6px_black] ">Sky Task</p>
                        </div>
                        <div className=" w-full flex flex-col items-center relative ">
                            <div className=" w-[36vmax] sm:w-[20vmax] aspect-[509/170] relative">
                                <Image
                                    src="/image/jet_taskinfo.png"
                                    alt="main logo"
                                    layout="fill"
                                    objectFit="cover"
                                />
                                <p className="absolute top-[18%] left-[8%] text-[2.6vmax] sm:text-[2vmax] text-[#D0D0D0] font-normal">DAILY TASK</p>
                                <p className="absolute bottom-[5%] left-[8%] text-[2vmax] sm:text-[1.3vmax] text-[#FFB625] font-normal">EARN EVERYDAY</p>
                                <p className="absolute bottom-[5%] right-[8%] text-[2vmax] sm:text-[1.3vmax] text-[#D0D0D0] font-normal">{remainHours}/24h</p>
                            </div>
                            {disabledDaily[0] ? <div onClick={() => dailyHandleClick(0, 100)} className=" bg-taskBg w-[36vmax] sm:w-[20vmax] aspect-[439/101] relative active:scale-90 transition-transform duration-200">
                                <Image
                                    src="/image/jet_dailyreward1.png"
                                    alt="main logo"
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div> :
                                <div className=" bg-taskBg w-[36vmax] sm:w-[20vmax] aspect-[439/101] relative active:scale-90 transition-transform duration-200">
                                    <Image
                                        src="/image/jet_dailyreward1_off.png"
                                        alt="main logo"
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>}
                            <div className="relative my-[1.5%] w-[36vmax] sm:w-[20vmax] max-w-[450px] aspect-[482/5]">
                                <Image
                                    src="/image/jet_taskpartition.png"
                                    alt="main logo"
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                            {disabledDaily[1] ?
                                <a href="https://x.com/JFT_official_X" target="_blank" rel="noopener noreferrer">
                                    <div onClick={() => dailyHandleClick(1, 1000)} className=" bg-taskBg w-[36vmax] sm:w-[20vmax] aspect-[439/101] relative active:scale-90 transition-transform duration-200">
                                        <Image
                                            src="/image/jet_dailyreward2.png"
                                            alt="main logo"
                                            layout="fill"
                                            objectFit="cover"
                                        />
                                    </div>
                                </a>
                                :
                                <div className="bg-taskBg w-[36vmax] sm:w-[20vmax] aspect-[439/101] relative active:scale-90 transition-transform duration-200">
                                    <Image
                                        src="/image/jet_dailyreward2_off.png"
                                        alt="main logo"
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>
                            }

                        </div>

                        <div className=" w-full flex flex-col items-center relative">
                            <div className=" w-[36vmax] sm:w-[20vmax] aspect-[509/170] relative">
                                <Image
                                    src="/image/jet_taskinfo2.png"
                                    alt="main logo"
                                    layout="fill"
                                    objectFit="cover"
                                />
                                <p className="absolute top-[18%] left-[8%] text-[2.6vmax] sm:text-[2vmax] text-[#D0D0D0] font-bold">OPTION TASK</p>
                                <p className="absolute bottom-[5%] left-[8%] text-[2vmax] sm:text-[1.3vmax] text-[#FFB625] font-normal">EARN 1 time</p>

                            </div>
                            {disabledTask[0] ? <a href="https://x.com/JFT_official_X" target="_blank" rel="noopener noreferrer">
                                <div onClick={() => handleClick(0, 1000)} className=" bg-taskBg2 w-[36vmax] sm:w-[20vmax] aspect-[438/101] relative active:scale-90 transition-transform duration-200">
                                    <Image
                                        src="/image/jet_taskx.png"
                                        alt="main logo"
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div></a> :
                                <div className=" bg-taskBg2 w-[36vmax] sm:w-[20vmax] aspect-[438/101] relative active:scale-90 transition-transform duration-200">
                                    <Image
                                        src="/image/jet_taskx_off.png"
                                        alt="main logo"
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>}
                            <div className="relative my-[1.5%] w-[36vmax] sm:w-[20vmax] max-w-[450px] aspect-[482/5]">
                                <Image
                                    src="/image/jet_taskpartition.png"
                                    alt="main logo"
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                            <Wallet />
                            <div className="relative my-[1.5%] w-[36vmax] sm:w-[20vmax] max-w-[450px] aspect-[482/5]">
                                <Image
                                    src="/image/jet_taskpartition.png"
                                    alt="main logo"
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                            {disabledTask[1] ?
                                <div onClick={() => handleClick(1, 5000)} className=" bg-taskBg2 w-[36vmax] sm:w-[20vmax] aspect-[438/101] relative active:scale-90 transition-transform duration-200">
                                    <Image
                                        src="/image/jet_taskinvite.png"
                                        alt="main logo"
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                    <p className="absolute top-[5%] right-[10.5%] text-[2.2vmax] sm:text-[1.2vmin] text-[#D0D0D0] font-normal">{inviteCount}/5</p>
                                </div>
                                :
                                <div className=" bg-taskBg2 w-[36vmax] sm:w-[20vmax] aspect-[438/101] relative active:scale-90 transition-transform duration-200">
                                    <Image
                                        src="/image/jet_taskinvite_off.png"
                                        alt="main logo"
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                    <p className="absolute bottom-[5%] right-[5%] text-[2.5vmax] sm:text-[1.5vmin] text-[#D0D0D0] font-bold">5/5</p>
                                </div>
                            }

                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </TonConnectUIProvider>
    );
}
