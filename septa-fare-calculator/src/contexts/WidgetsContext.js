import React, { useState } from "react";

export const WidgetContext = React.createContext();
export const ZONES = "zones",
  WHEN = "when",
  PURCHASE = "purchase",
  QUANTITY = "quantity",
  FAREDATA = "faredata";

export const WidgetProvider = (props) => {
  // dropdown widgets

  const [zoneSelected, setZoneSelected] = useState(0);
  const [whenSelected, setWhenSelected] = useState(0);

  // radio buttonsPoint of Sale (pos)
  const [purchaseSelected, setPurchaseSelected] = useState(null);
  // text entry

  const [textEntered, setTextEntered] = useState("1");

  //  fare data
  const [fareData, setFareData] = useState(null);

  const Widgets = {
    zones: [zoneSelected, setZoneSelected],
    when: [whenSelected, setWhenSelected],
    purchase: [purchaseSelected, setPurchaseSelected],
    quantity: [textEntered, setTextEntered],
    faredata: [fareData, setFareData],
  };

  return (
    <WidgetContext.Provider value={Widgets}>
      {props.children}
    </WidgetContext.Provider>
  );
};
