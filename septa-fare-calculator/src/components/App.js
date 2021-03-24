import React, { useEffect, useContext, useState } from "react";

import CalcFare from "./CalcFare";
import Dropdown from "./Dropdown";
import Radio from "./Radio";
import Text from "./Text";
import {
  WidgetContext,
  FAREDATA,
  ZONES,
  WHEN,
  PURCHASE,
} from "../contexts/WidgetsContext";
import { loading } from "../data/initialValues";
import "./App.css";
import getAxiosData from "../apis/getAxiosData";
import { API_FARES } from "../apis/config";
import { titleCase } from "../utils/utils";
const App = () => {
  const [fareData, setFareData] = useContext(WidgetContext)[FAREDATA];
  const [zonesData, setZonesData] = useState(null);
  const [whenData, setWhenData] = useState(null);
  const [purchaseOptions, setPurchaseOptions] = useState(null);

  useEffect(() => {
    if (fareData === null) {
      getAxiosData(API_FARES, setFareData);
    } else {
      if (zonesData === null) {
        loadUIData(fareData);
      }
    }
  }, [fareData]);

  const loadZonesData = (fareData) => {
    const zones = fareData.zones.map((zone, index) => {
      return { label: zone.name, value: index };
    });

    setZonesData(zones);
  };

  const loadZoneDetails = (zones) => {
    const whenHash = {};
    const purchaseHash = {};
    zones.map((zone) => {
      // filter unique types to populate the when (travel time, weekday, weekend...)dropdown
      zone.fares.filter((fare) => {
        if (!whenHash[fare.type]) {
          whenHash[fare.type] = titleCase(fare.type);
        }
        if (!purchaseHash[fare.purchase]) {
          purchaseHash[fare.purchase] = titleCase(fare.purchase);
        }
      });
    });

    const whenOptions = Object.entries(whenHash).map((when) => {
      return { label: when[1], value: when[0] };
    });
    setWhenData(whenOptions);
    const purchaseOptions = Object.entries(purchaseHash).map((purchase) => {
      return { label: purchase[1], value: purchase[0] };
    });
    setPurchaseOptions(purchaseOptions);
  };

  const loadUIData = (fareData) => {
    loadZonesData(fareData);
    loadZoneDetails(fareData.zones);
  };

  return (
    <div className="ui container rail-fares">
      <section className="header">
        <h1>Regional Rail Fares</h1>
      </section>
      <section className="content">
        <div className="input-container">
          <Dropdown
            label="Where are you going?"
            options={zonesData !== null ? zonesData : loading}
            contextName={ZONES}
          />
        </div>
        <div className="input-container">
          <Dropdown
            label="When are you riding?"
            options={whenData !== null ? whenData : loading}
            contextName={WHEN}
          />
          Anytime tickets are available through Advanced Purchase only and are
          good for 10 rides.
        </div>
        <div className="input-container">
          {purchaseOptions !== null ? (
            <Radio
              label="Where will you purchase the fare?"
              options={purchaseOptions}
              contextName={PURCHASE}
            />
          ) : (
            <div></div>
          )}
        </div>
        <div className="input-container">
          <Text label="How many rides will you need?" />
        </div>
        <div className="footer">
          <CalcFare />
        </div>
      </section>
    </div>
  );
};
export default App;
