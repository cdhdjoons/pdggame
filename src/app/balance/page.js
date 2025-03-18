'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TICKETS_UPDATE_EVENT } from '../components/clientOnlyWarpper';
import Alert from '@mui/material/Alert';

export default function Balance() {
  const [pop, setPop] = useState(false);
  const [n2o, setN2O] = useState(0);
  const [tickets, setTickets] = useState(0);


  useEffect(() => {
    // 초기 n2o 값 불러오기
    const storedN2O = localStorage.getItem("n2o");
    if (storedN2O !== null) {
      setN2O(Number(storedN2O));
    }
    // 초기 티켓 값 불러오기
    const storedTickets = localStorage.getItem("tickets");
    if (storedTickets !== null) {
      setTickets(Number(storedTickets));
    }
  }, []);

  const getTicket = (ticketNum, price) => {
    //티켓 가격보다 n2o가 작으면 팝업
    // console.log(n2o);
    if (n2o < Number(price)) {
      setPop(true);
      setTimeout(() => setPop(false), 1500); // 1.5초 후 복사 메시지 초기화
      return;
    }
    //가격이 성립하면 n2o 가격만큼 줄이고, 티켓 갯수만큼 늘어남(로컬스토리지, state 모두 업뎃)
    setN2O((prevN2O) => {
      const newN2O = prevN2O - price;
      if (newN2O < 0) {
        return prevN2O;
      }
      localStorage.setItem("n2o", newN2O);  // 로컬스토리지 업데이트
      return newN2O;  // 상태 업데이트
    });

    setTickets((prevTickets) => {
      const newTickets = prevTickets + ticketNum;
      localStorage.setItem("tickets", newTickets);  // 로컬스토리지 업데이트
      return newTickets;  // 상태 업데이트
    });

  }

  // 상태가 변경된 후에 로컬스토리지와 이벤트 디스패치 처리
  useEffect(() => {
    // tickets 상태가 변경될 때만 실행
    window.dispatchEvent(new Event(TICKETS_UPDATE_EVENT)); // footer에 ticket 값 변경 알림
  }, [tickets]);  // tickets 상태가 변경될 때만 실행

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className=" w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="bg-balanceBg w-full h-full max-w-[500px] relative flex flex-col justify-evenly " >
          <div className=" w-full flex justify-center items-center relative mb-[5%]">
            <div className="w-[35vmax] max-w-[450px] aspect-[546/401] relative ">
              <Image
                src="/image/jet_balancelogo.png"
                alt="main logo"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className=" flex justify-center w-full absolute bottom-[-11%] sm:bottom-[-9%]">
              <div className=" w-[80%] aspect-[501/113] relative">
                <Image
                  src="/image/jet_resourceinfo.png"
                  alt="ticketIcon"
                  layout="fill"
                  objectFit="cover"
                />
                <p className="mt-[2px] absolute right-[18%] top-[55%] -translate-y-1/2 text-white text-[2.5vmax] xs:text-[2.3vmax] sm:text-[2.2vmin] [-webkit-text-stroke:0.5px_black]">{n2o >= 1000000 ? `${n2o / 1000000}m` : n2o >= 1000 ? `${n2o / 1000}k` : n2o}</p>
                <p className="mt-[2px] absolute left-[25%] top-[55%] -translate-y-1/2 text-white text-[2.5vmax] xs:text-[2.3vmax] sm:text-[2.2vmin] [-webkit-text-stroke:0.4px_black]">{tickets}</p>
              </div>
            </div>
          </div>
          <p className="w-full text-center text-[4.3vmax] xs:text-[4vmax] sm:text-[4.5vmin] -rotate-2
        bg-gradient-to-r from-[#57F92F] via-[#A5FEA5] to-[#1560EB] bg-clip-text text-transparent [-webkit-text-stroke:1px_black] ">Get Sky Licence</p>
          <div className=" w-full py-[1vmin] flex gap-3 flex-col items-center justify-center">
            <div onClick={() => getTicket(1, 500)} className=" w-[36vmax] sm:w-[40vmin] aspect-[501/161] relative active:scale-90 transition-transform duration-200 ">
              <Image
                src="/image/sky1.png"
                alt="meatIcon"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div onClick={() => getTicket(3, 1300)} className="w-[36vmax] sm:w-[40vmin] aspect-[501/161] relative active:scale-90 transition-transform duration-200 ">
              <Image
                src="/image/sky2.png"
                alt="meatIcon"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div onClick={() => getTicket(5, 2000)} className="w-[36vmax] sm:w-[40vmin] aspect-[501/161] relative active:scale-90 transition-transform duration-200 ">
              <Image
                src="/image/sky3.png"
                alt="meatIcon"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
          {pop && (
            <div className=" absolute top-[10px] left-1/2 -translate-x-1/2 z-[999] "><Alert severity="error">Need more N2O.</Alert></div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
