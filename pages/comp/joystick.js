import { useRef, useEffect } from "react"
import arrow from "../img/Red_Arrow.png"

export default function JoyStick(props) {

    useEffect(() => {
        document.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        });
        return () => {
            document.removeEventListener("contextmenu", (e) => {
                e.preventDefault();
            });
        }
    });

    return (
        <div style={{position: "absolute", left: "2vw", bottom:"2vw"}}>
            <img src={arrow.src} alt="joystick" style={{ display: "block", height: "10vh",transform: "rotate(90deg)" }} onTouchStart={(e)=> {
                e.preventDefault();
                props.key_pressed.current["w"] = true;
            }} onTouchEnd={()=> {
                    props.key_pressed.current["w"] = false;
            }}/>
            <img src={arrow.src} alt="joystick" style={{ display: "block", height: "10vh",transform: "rotate(-90deg)" }} onTouchStart={(e)=> {
                e.preventDefault();
                props.key_pressed.current["s"] = true;
            }} onTouchEnd={()=> {
                    props.key_pressed.current["s"] = false;
            }}/>
        </div>
    )
}