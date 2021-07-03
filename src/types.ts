interface ServiceInit {
  status: 'init';
}
interface ServiceLoading {
  status: 'loading';
}
interface ServiceLoaded<T> {
  status: 'loaded';
  payload: T;
}
interface ServiceError {
  status: 'error';
  error: Error;
}
export type Service<T> =
  | ServiceInit
  | ServiceLoading
  | ServiceLoaded<T>
  | ServiceError;
  
export interface Info {
  anytime: string;
  weekday: string;
  evening_weekend: string;
  advance_purchase: string;
  onboard_purchase: string;
}

export interface Fare {
  type: string;
  purchase: string;
  trips: number;
  price: number;
}

export interface Zone {
  name: string;
  zone: number;
  fares: Fare[];
}

export interface FaresData {
  info: Info;
  zones: Zone[];
}