const fetchData = async () => {
  let data = null;

  await axios
    .get('./fares.json')
    .then((res) => {
      data = res.data;
    })
    .catch((err) => {
      data = null;
    });

  return data;
};

// utility functions
const populateZones = (data) => {
  const selectTarget = document.querySelector('#zone');

  for (let i = 0; i < data.zones.length; i++) {
    const option = document.createElement('option');

    option.className = 'zone-option';
    option.value = data.zones[i].name;
    option.innerHTML = data.zones[i].name;

    selectTarget.appendChild(option);
  }
};

const populateSchedules = (data) => {
  const selectTarget = document.querySelector('#schedule');

  const duplicateTracker = new Set();

  for (let sched of data.zones[0].fares) {
    if (!duplicateTracker.has(sched.type)) {
      const option = document.createElement('option');

      option.className = 'schedule-option';
      option.value = sched.type;
      //   format type
      const formattedType = sched.type.split('_');

      for (let i = 0; i < formattedType.length; i++) {
        let copyType = formattedType[i];
        formattedType[i] = copyType.charAt(0).toUpperCase() + copyType.slice(1);
      }

      option.innerHTML = formattedType.join(' ');
      duplicateTracker.add(sched.type);

      selectTarget.appendChild(option);
    }
  }
};

const populateInfo = (data) => {
  const ul = document.querySelector('.helper-info');

  for (let info in data.info) {
    const li = document.createElement('li');

    //   format type
    const formattedKey = info.split('_');

    for (let i = 0; i < formattedKey.length; i++) {
      let copyKey = formattedKey[i];
      formattedKey[i] = copyKey.charAt(0).toUpperCase() + copyKey.slice(1);
    }

    li.className = 'info-item';
    li.innerHTML = `${formattedKey.join(' ')} - ${data.info[info]}`;

    ul.appendChild(li);
  }
};

const populateResult = (data) => {
  const zone = document.querySelector('#zone');
  const schedule = document.querySelector('#schedule');
  const kiosk = document.querySelector('#station-kiosk');
  const onboard = document.querySelector('#onboard');
  const numOfRides = document.querySelector('#num-of-rides');
  const price = document.querySelector('.result-price');

  let result = 0.0;

  let selectedZone = data.zones.find((z) => zone.value === z.name);
  let selectedSched = schedule.value !== 'null' ? schedule.value : null;
  let selectedPurchaseType = null;
  let selectedNumOfRides = numOfRides.value;

  if (kiosk.checked) {
    selectedPurchaseType = kiosk.value;
  } else if (onboard.checked) {
    selectedPurchaseType = onboard.value;
  }

  if (selectedZone && selectedSched && selectedPurchaseType) {
    const fare = selectedZone.fares.find(
      (sched) =>
        sched.type === selectedSched && sched.purchase === selectedPurchaseType
    );

    result = selectedNumOfRides * (fare.price / fare.trips);
  }

  price.innerHTML = `$ ${result.toFixed(2)}`;
};

// attach event listeners
window.addEventListener('load', async () => {
  const data = await Promise.resolve(fetchData());

  populateZones(data);
  populateSchedules(data);
  populateInfo(data);
  populateResult(data);
});

const zone = document.querySelector('#zone');
const schedule = document.querySelector('#schedule');
const kiosk = document.querySelector('#station-kiosk');
const onboard = document.querySelector('#onboard');
const numOfRides = document.querySelector('#num-of-rides');

zone.addEventListener('change', async () => {
  const data = await Promise.resolve(fetchData());
  populateResult(data);
});

schedule.addEventListener('change', async () => {
  const data = await Promise.resolve(fetchData());

  //   there won't be an option for onboard purchase if riding anytime
  if (schedule.value === 'anytime') {
    onboard.disabled = true;

    if (onboard.checked === true) {
      onboard.checked = false;
    }
  } else {
    onboard.disabled = false;
  }

  populateResult(data);
});

kiosk.addEventListener('change', async () => {
  const data = await Promise.resolve(fetchData());
  populateResult(data);
});

onboard.addEventListener('change', async () => {
  const data = await Promise.resolve(fetchData());
  populateResult(data);
});

numOfRides.addEventListener('change', async () => {
  const data = await Promise.resolve(fetchData());
  populateResult(data);
});
