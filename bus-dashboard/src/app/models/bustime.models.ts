// BusTime API response models

export interface Route {
  rt: string;
  rtnm: string;
  rtclr: string;
  rtdd?: string;
}

export interface RoutesResponse {
  'bustime-response': {
    routes?: Route[];
    error?: ErrorResponse[];
  };
}

export interface Prediction {
  tmstmp: string;
  typ: string;
  stpnm: string;
  stpid: string;
  vid: string;
  dstp: number;
  rt: string;
  rtdd: string;
  rtdir: string;
  des: string;
  prdtm: string;
  tablockid: string;
  tatripid: string;
  dly: boolean;
  prdctdn: string;
  zone?: string;
}

export interface PredictionsResponse {
  'bustime-response': {
    prd?: Prediction[];
    error?: ErrorResponse[];
  };
}

export interface ErrorResponse {
  msg: string;
  rt?: string;
  stpid?: string;
}
