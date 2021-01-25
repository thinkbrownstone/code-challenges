import { useEffect, useState } from "react";
import "./SeptaFareCalculator.css";
import Select from "./Select";
import Input from "./Input";
import RadioSelect from "./RadioSelect";
import logo from "./SEPTALogo.svg";

const SeptaFareCalculator = () => {
  // I tried using a global zone state that would then fill the input values with only data from that specific zone selected
  // but I realized that just keeping track of each value seprately and using it to check against the data might be
  // more flexible if data did change down the line
  const [fareInfo, setFareInfo] = useState(null);
  const [zones, setZones] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoneInput, setZoneInput] = useState(null);
  const [timeInput, setTimeInput] = useState(null);
  const [numberOfRidesInput, setNumberOfRidesInput] = useState(1);
  const [purchaseInput, setPurchaseInput] = useState(null);
  const labels = [
    "Where are you going?",
    "When are you riding?",
    "Where will you purchase the fare?",
    "How many rides will you need?",
  ];
  const purchaseOptions = [
    {
      text: "Onboard",
      value: "onboard_purchase",
    },
    {
      text: "Station Kiosk",
      value: "advance_purchase",
    },
  ];

  useEffect(() => {
    fetch(`http://my-json-server.typicode.com/zackmckenna/fares/db`)
      .then((res) => res.json())
      .then((data) => {
        let { zones, info } = data;
        setDefaultValues(zones);
        setFareInfo(info);
        setZones(zones);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
      });
  }, []);

  const setDefaultValues = (zones) => {
    const defaultZone = zones[0];
    setZoneInput(defaultZone.zone - 1);
    setTimeInput(defaultZone.fares[0].type);
    setPurchaseInput(defaultZone.fares[0].purchase);
  };

  const createOptions = (data, value, text) => {
    return data.map((item) => {
      return {
        text: item[text],
        value: item[value],
      };
    });
  };

  const cleanHyphenValues = (string) => {
    return string
      .split("_")
      .map(
        (substring) => substring.charAt(0).toUpperCase() + substring.slice(1)
      )
      .join("/");
  };

  const createTimeOptions = (fares, value, text) => {
    const filteredFares = fares.filter(
      (fare) => fare.purchase === purchaseInput
    );
    return filteredFares.map((item) => {
      return {
        text: cleanHyphenValues(item[text]),
        value: item[value],
      };
    });
  };

  const calculateTotal = () => {
    const fares = zones[Number(zoneInput)].fares;
    const fare = fares.filter(
      (fare) => fare.purchase === purchaseInput && fare.type === timeInput
    )[0];
    const total = (fare.price / fare.trips) * numberOfRidesInput;
    return total;
  };

  if (!loading) {
    return (
      <div id="septa-fare-calculator" className="septaFareCalculator">
        <div className="header">
          <p>
            <img
              width="36"
              height="36"
              className="septa-logo"
              src={logo}
              alt="Setpa Logo"
            ></img>{" "}
            Regional Rail Rates
          </p>
        </div>
        <div className="inputBlock">
          <Select
            label={labels[0]}
            options={createOptions(zones, "zone", "name")}
            onChange={(e) => setZoneInput(e.target.value - 1)}
            id="zone-select"
          />
        </div>
        <div className="inputBlock">
          <Select
            label={labels[1]}
            options={createTimeOptions(zones[zoneInput].fares, "type", "type")}
            onChange={(e) => setTimeInput(e.target.value)}
            id="time-select"
          />
          <p className="helperText">{fareInfo[`${timeInput}`]}</p>
        </div>
        <div className="radioInputBlock">
          <RadioSelect
            onChange={(e) => setPurchaseInput(e.target.value)}
            legend={labels[2]}
            options={purchaseOptions}
            id="purchase-select"
            value={purchaseInput}
          />
          <p className="helperText">{fareInfo[`${purchaseInput}`]}</p>
        </div>
        <div className="inputBlock">
          <Input
            label={labels[3]}
            type="number"
            onChange={(e) => setNumberOfRidesInput(e.target.value)}
            value={numberOfRidesInput}
            id="rides-input"
          />
        </div>
        <div className="resultBlock" id="results" aria-live="polite">
          <p>your fare will cost</p>
          <output htmlFor="septa-fare-calculator" className="totalFare">
            ${calculateTotal().toFixed(2)}
          </output>
        </div>
      </div>
    );
  } else {
    return <p>{error ? "Error loading page" : " loading..."}</p>;
  }
};

export default SeptaFareCalculator;
