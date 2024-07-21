import { injectable } from "inversify";

export interface AddressRepository {
  getCurrentURL(): URL;
}

export const AddressRepository = Symbol("AddressRepository");

@injectable()
export class AddressRepositoryImpl implements AddressRepository {
  getCurrentURL(): URL {
    return new URL(window.location.href);
  }
}
