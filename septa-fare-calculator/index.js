let zonesList = []
let ridingTimes = []
let purchaseTypes = []
let rateTotal = []

const jsonUrl = './fares.json'
let jsonPayload

fetch(jsonUrl)
  .then((response) => response.json())
  .then((data) => {
    jsonPayload = data
    jsonPayload.zones.map(({ zone, name, fares }) => {
      zonesList = [...zonesList, { key: name, value: zone }]
      fares.map(({ type, purchase }) => {
        const noRidingTime = !ridingTimes.filter(
          (ridingTime) => ridingTime.key === type
        ).length

        const noPurchaseTypes = !purchaseTypes.filter(
          (purchaseType) => purchaseType.key === purchase
        ).length

        if (noRidingTime) ridingTimes.push({ key: type, value: type })
        if (noPurchaseTypes)
          purchaseTypes.push({ key: purchase, value: purchase })
      })
    })

    zonesList.map(({ key, value }) =>
      generateOptionElement('#zone-field-select', key, value)
    )

    ridingTimes.map(({ key, value }) =>
      generateOptionElement('#riding-time-select', key, value)
    )

    purchaseTypes.map((purchaseType, index) =>
      generatePurchaseElement(purchaseType, index)
    )
  })

const generateOptionElement = (selector, text, value) => {
  const newOptionEl = document.createElement('option')
  newOptionEl.text = text
  newOptionEl.value = value
  return document.querySelector(selector).appendChild(newOptionEl)
}

const generatePurchaseElement = (purchaseType, index) => {
  const labelContainer = document.createElement('div')
  const purchaseTypeEl = document.getElementById('purchase-type-el')
  const newPurchaseLabel = document.createElement('label')
  newPurchaseLabel.style.fontSize = '1.5rem'
  newPurchaseLabel.style.margin = '0 0 0 0.5rem'
  newPurchaseLabel.textContent = purchaseType.key
  newPurchaseLabel.htmlFor = 'purchase-type'
  const newPurchaseInput = document.createElement('input')
  newPurchaseInput.checked = index === 0
  newPurchaseInput.value = purchaseType.key
  newPurchaseInput.id = 'purchase-type-field'
  newPurchaseInput.onchange = 'calculateTotal()'
  newPurchaseInput.type = 'radio'
  newPurchaseInput.name = 'purchase-type'
  labelContainer.appendChild(newPurchaseInput)
  labelContainer.appendChild(newPurchaseLabel)
  return purchaseTypeEl.appendChild(labelContainer)
}

const updateTotal = () => {
  const currentZone = document.getElementById('zone-field-select').value
  const ridingTimeType = document.getElementById('riding-time-select').value
  const currentPurchase = document.getElementById('purchase-type-field').value
  const tripCount = document.querySelector('.ride__count').value
  const currentTotalEl = document.querySelector('.widget__footer__total')

  const zoneResult = jsonPayload.zones.filter(
    ({ zone }) => zone === parseInt(currentZone)
  )

  const fare = zoneResult[0].fares.filter(
    ({ type, purchase }) =>
      type === ridingTimeType && purchase === currentPurchase
  )

  calculateTotal(fare, tripCount)
  return (currentTotalEl.textContent = rateTotal)
}

const calculateTotal = (fare, tripCount) => {
  const defaultTripCount = 1
  const currentTripCount = fare[0].trips

  if (currentTripCount > defaultTripCount) {
    rateTotal = 0
    const pricePerTrip = fare[0].price / fare[0].trips
    rateTotal = pricePerTrip * tripCount
    currentTotalEl.textContent = rateTotal
  }
  rateTotal = fare[0].price * tripCount
}
