export interface IInfo {
  anytime: string;
  weekday: string;
  evening_weekend: string;
  advance_purchase: string;
  onboard_purchase: string;
}

export interface IZone {
  name: string;
  zone: number;
  fares: IFare[];
}

export interface IFare {
  type: string;
  purchase: string;
  trips: number;
  price: number;
}
