export type Duplex<Req = undefined, Resp = void> = {
  Request: Req;
  Response: Resp;
};

export type Simplex<Req = undefined> = {
  Request: Req;
};
