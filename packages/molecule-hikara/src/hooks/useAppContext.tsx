import { useContext } from "react";
import { AppContext, MyContext } from "../contexts/MyContext";

export const useAppContext = (): AppContext => (useContext(MyContext))
