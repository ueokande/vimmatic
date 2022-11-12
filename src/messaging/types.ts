export type Duplex<
  Req extends unknown = undefined,
  Resp extends unknown = void
> = {
  Request: Req;
  Response: Resp;
};

export type Simplex<Req extends unknown = undefined> = {
  Request: Req;
};
