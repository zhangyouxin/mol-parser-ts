import React, { useState } from "react";

export type AppContext = {
  mol: string;
  schema: string;
  data: string;
}

export const defaultAppContext:AppContext  = { mol: '', schema: '', data: '' }

export const MyContext = React.createContext<AppContext>(defaultAppContext);
MyContext.displayName = "MyContext";

export const MyContextProvider: React.FC<{ children: any}> = (props) => {
  const [context, setContext] = useState<AppContext>(defaultAppContext);

  return (
    <MyContext.Provider value={context}>{props.children}</MyContext.Provider>
  )
};