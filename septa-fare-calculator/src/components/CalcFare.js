import React, { useContext, useEffect, useState } from "react";
import {
  WidgetContext,
  ZONES,
  WHEN,
  PURCHASE,
  QUANTITY,
  FAREDATA,
} from "../contexts/WidgetsContext";

import "./CalcFare.css";

const CalcFare = () => {
  const [fares] = useContext(WidgetContext)[FAREDATA];
  const [zoneSelected] = useContext(WidgetContext)[ZONES];
  const [whenSelected] = useContext(WidgetContext)[WHEN];
  const [purchaseSelected] = useContext(WidgetContext)[PURCHASE];
  const [textEntered] = useContext(WidgetContext)[QUANTITY];
  const [total, setTotal] = useState(0);
  const [fareHash, setFareHash] = useState({});
  const [errorMessage, setErrorMessage] = useState(
    "Anytime tickets are available through Advanced Purchase only."
  );

  useEffect(() => {
    if (textEntered.length === 0) {
      setTotal(0);
      setErrorMessage("Enter a number between 1 and 100");
    } else if (
      zoneSelected.value !== null &&
      whenSelected.value &&
      purchaseSelected &&
      purchaseSelected.value &&
      textEntered
    ) {
      if (Object.keys(fareHash).length === 0) {
        // make a hash table to look up rates
        let fareHashLocal = {};
        fares.zones.map((zone, index) => {
          if (!fareHashLocal[zone.zone]) {
            fareHashLocal[zone.zone] = {};
            zone.fares.forEach((fare) => {
              if (!fareHashLocal[zone.zone][fare.type]) {
                fareHashLocal[zone.zone][fare.type] = {};
              }

              fareHashLocal[zone.zone][fare.type][fare.purchase] = {
                trips: fare.trips,
                price: fare.price,
              };
            });
          }
        });

        setFareHash(fareHashLocal);
      }
      if (Object.keys(fareHash).length !== 0) {
        if (
          fareHash[zoneSelected.value + 1][whenSelected.value][
            purchaseSelected.value
          ]
        ) {
          const newTotal =
            fareHash[zoneSelected.value + 1][whenSelected.value][
              purchaseSelected.value
            ].price * +textEntered;

          setTotal(newTotal);
        } else {
          setTotal(0);
        }
      }
    }
  }, [
    fareHash,
    fares,
    zoneSelected,
    whenSelected,
    purchaseSelected,
    textEntered,
    total,
  ]);
  return (
    <div>
      <h3>Your fare will cost</h3>
      <div className={total ? "calc-fare calc-footer-total" : ""}>{`${
        total ? "$ " + total : errorMessage
      }`}</div>
    </div>
  );
};
export default CalcFare;
