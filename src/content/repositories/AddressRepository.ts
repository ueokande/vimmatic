import { provide } from "inversify-binding-decorators";

export interface AddressRepository {
  getCurrentURL(): URL;
}

export const AddressRepository = Symbol("AddressRepository");

@provide(AddressRepository)
export class AddressRepositoryImpl implements AddressRepository {
  getCurrentURL(): URL {
    return new URL(window.location.href);
  }
}
