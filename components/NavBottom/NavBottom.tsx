import { Fragment, MouseEvent, useRef, useState } from "react"
import { BiCart, BiSearchAlt, BiStore } from "react-icons/bi"
import { MdRestaurantMenu } from "react-icons/md"
import { BsPersonCircle } from "react-icons/bs"
import style from "./NavBottom.module.scss"
import Link from "next/link"

export default function NavBottom() {
   const buttons = [
      { name: "Cardápio", icon: <MdRestaurantMenu />, link: '/' },
      { name: "Pedidos", icon: <BiCart />, link: '/checkout' },
      { name: "Sobre nós", icon: <BiStore />, link: '/aboutus' },
      { name: "Perfil", icon: <BsPersonCircle />, link: '/login' },
   ]

   const [theStyle, setTheStyle] = useState("none")

   const buttonTags = useRef<any[]>([])
   const appendTester = (el: any) => {
      if (el && !buttonTags.current.includes(el)) buttonTags.current.push(el)
   }

   const activeClass = (event: MouseEvent) => {
      const currElId = event.currentTarget.id
      buttonTags.current.forEach((el) => {
         el.id === currElId
            ? (el.className = `${style.button} ${style.active}`)
            : (el.className = style.button)
      })

      setTheStyle(`translateX(calc(4.4rem * ${event.currentTarget.id}))`)
   }

   return (
      <div
         className={`${style.navigation} m-auto lg:w-1/2 fixed -bottom-12 flex justify-center items-center h-32 rounded-t-3xl bg-white w-full`}
      >
         <div className={`flex`}>
            {buttons.map((button, index) => (
               <Fragment key={button.name}>
                  <div id={String(index)} className={`${style.button} relative ${index === 0 && style.active}`} ref={appendTester} onClick={activeClass}>
                     <Link href={button.link}>
                        <a className="relative flex justify-center items-center flex-col w-full text-center font-light">
                           <span className={`${style.icon} relative block text-center`}>{button.icon}</span>
                           <span className={`${style.text} absolute font-bold tracking-wider opacity-0`}>{button.name}</span>
                        </a>
                     </Link>
                  </div>
               </Fragment>
            ))}
            <div className={`${style.indicator} absolute`} style={{ transform: theStyle }}></div>
         </div>
      </div>
   )
}
