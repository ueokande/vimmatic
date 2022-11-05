type Entries = { [name: string]: string };

export default class Search {
  constructor(public defaultEngine: string, public engines: Entries) {}
}
