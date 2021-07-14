var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
Hello Thinkers! Maybe Thinksters? Thinkadelphians? Whatever you call yourselves.
Thanks for the opportunity to apply for working at your company.
I wanted to explain a few of my decisions:
- The solution is built using React. As I got into it I realized that the nature of the calcualtor is well suited for React's approach to state management.
- To keep things simple, React is loaded via CDN, You shouldn't need any dependencies to run the solution.
- I focused on making the calculator more functional than the styling (it's pretty obvious!).
- That being said, here's some things I would tackle next if I were to take more time.
    1. The calculator doesn't account for the anytime rides
    2. I think the code in the calculator could be refactored to be more performant with less state variables, etc.
    3. The outside border should be different than the inner ones.
    4. The top/bottom margin of the total cost is much too big
    5. The ticket input box needs it width constrained
    6. The radio buttons could use some custom styling
    7. My solution is missing helper text
    8. Add javascript to selects to customize their styling
    9. Get more accurate on the typeface
    10. Accurately size the form questions
    11. Change the text color
    12. Just do it all better!

Thanks for the opportunity!
*/

var _React = React,
    createElement = _React.createElement,
    Fragment = _React.Fragment,
    useEffect = _React.useEffect,
    useState = _React.useState;

var e = createElement;

var FareWidget = function FareWidget() {
  var _useState = useState([{
    name: "CCP/1",
    zone: 1,
    fares: [{
      type: "weekday",
      purchase: "advance_purchase",
      trips: 1,
      price: 4.75
    }]
  }]),
      _useState2 = _slicedToArray(_useState, 2),
      zones = _useState2[0],
      setZones = _useState2[1];

  var _useState3 = useState({
    zone: 1,
    time: "weekday",
    purchaseLocation: "advance_purchase",
    rides: 0
  }),
      _useState4 = _slicedToArray(_useState3, 2),
      formState = _useState4[0],
      setFormState = _useState4[1];

  var _useState5 = useState([{
    type: "weekday",
    purchase: "advance_purchase",
    trips: 1,
    price: 4.75
  }]),
      _useState6 = _slicedToArray(_useState5, 2),
      fareTypes = _useState6[0],
      setFareTypes = _useState6[1];

  var _useState7 = useState({
    type: "weekday",
    purchase: "advance_purchase",
    trips: 1,
    price: 4.75
  }),
      _useState8 = _slicedToArray(_useState7, 2),
      fare = _useState8[0],
      setFare = _useState8[1];

  var _useState9 = useState(0),
      _useState10 = _slicedToArray(_useState9, 2),
      cost = _useState10[0],
      setCost = _useState10[1];

  var handleChange = function handleChange(e) {
    setFormState(Object.assign({}, formState, _defineProperty({}, e.target.name, e.target.value)));
  };

  useEffect(function () {
    var ajaxRequest = new XMLHttpRequest();
    ajaxRequest.onreadystatechange = function () {
      if (ajaxRequest.readyState == 4) {
        if (ajaxRequest.status == 200) {
          var response = JSON.parse(ajaxRequest.responseText);
          setZones(response.zones);
        }
      }
    };
    ajaxRequest.open("GET", "../fares.json");
    ajaxRequest.send();
  }, []);

  useEffect(function () {
    var foundZone = zones.find(function (zone) {
      return parseInt(formState.zone) === zone.zone;
    });
    var filteredZone = foundZone.fares.filter(function (fareObject) {
      return fareObject.purchase === formState.purchaseLocation;
    });
    setFareTypes(filteredZone);

    var foundFare = filteredZone.find(function (fare) {
      return fare.type === formState.time;
    });
    setFare(foundFare);
  }, [formState, zones]);

  useEffect(function () {
    var totalCost = fare.price * parseInt(formState.rides);
    setCost(totalCost);
  }, [formState]);

  return React.createElement(
    Fragment,
    null,
    React.createElement(
      "section",
      { className: "fare_widget" },
      React.createElement(
        "div",
        { className: "header" },
        React.createElement("img", { className: "logo", src: "./img/septa-logo.png", alt: "Septa Logo" }),
        React.createElement(
          "h1",
          null,
          "Regional Rail Fares"
        )
      ),
      React.createElement(
        "div",
        { className: "form_field" },
        React.createElement(
          "h1",
          null,
          "Where Are You Going?"
        ),
        React.createElement(
          "select",
          {
            className: "dropdown",
            id: "zoneSelect",
            name: "zone",
            value: formState.zone,
            onChange: handleChange
          },
          zones.map(function (singleZone, index) {
            return React.createElement(
              "option",
              { key: "zone" + index, value: singleZone.zone },
              singleZone.name
            );
          })
        )
      ),
      React.createElement(
        "div",
        { className: "form_field" },
        React.createElement(
          "h1",
          null,
          "When Are You Riding?"
        ),
        React.createElement(
          "select",
          {
            className: "dropdown",
            id: "timeSelect",
            name: "time",
            value: formState.time,
            onChange: handleChange
          },
          fareTypes.map(function (singleFare, index) {
            return React.createElement(
              "option",
              { key: "zone" + index, value: singleFare.type },
              singleFare.type
            );
          })
        )
      ),
      React.createElement(
        "div",
        { className: "form_field" },
        React.createElement(
          "h1",
          null,
          "Where Will You Purchase the Fares?"
        ),
        React.createElement(
          "label",
          null,
          "Onboard",
          React.createElement("input", {
            type: "radio",
            name: "purchaseLocation",
            value: "onboard_purchase",
            checked: formState.purchaseLocation === "onboard_purchase",
            onChange: handleChange
          })
        ),
        React.createElement(
          "label",
          null,
          "Advance",
          React.createElement("input", {
            type: "radio",
            name: "purchaseLocation",
            value: "advance_purchase",
            checked: formState.purchaseLocation === "advance_purchase",
            onChange: handleChange
          })
        )
      ),
      React.createElement(
        "div",
        { className: "form_field" },
        React.createElement(
          "h1",
          null,
          "How Many Rides Will You Need?"
        ),
        React.createElement("input", {
          type: "number",
          name: "rides",
          value: formState.rides,
          onChange: handleChange
        })
      ),
      React.createElement(
        "div",
        { className: "footer" },
        React.createElement(
          "h1",
          null,
          "Your Fare Will Cost"
        ),
        React.createElement(
          "h1",
          { className: "total_cost" },
          "$ ",
          cost
        )
      )
    )
  );
};

var domContainer = document.querySelector("#fare_widget_container");
ReactDOM.render(e(FareWidget), domContainer);