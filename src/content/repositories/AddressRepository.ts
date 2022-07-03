import { injectable } from "inversify";

export default interface AddressRepository {
  getCurrentURL(): URL;
}

@injectable()
export class AddressRepositoryImpl implements AddressRepository {
  getCurrentURL(): URL {
    return new URL(window.location.href);
  }
}
