type Entries = { [name: string]: string };

export default class Search {
  constructor(public defaultEngine: string, public engines: Entries) {
    for (const [name, url] of Object.entries(engines)) {
      if (!/^[a-zA-Z0-9]+$/.test(name)) {
        throw new TypeError("Search engine's name must be [a-zA-Z0-9]+");
      }
      const matches = url.match(/{}/g);
      if (matches === null) {
        throw new TypeError(`No {}-placeholders in URL of "${name}"`);
      } else if (matches.length > 1) {
        throw new TypeError(`Multiple {}-placeholders in URL of "${name}"`);
      }
    }
    if (!Object.keys(engines).includes(defaultEngine)) {
      throw new TypeError(`Default engine "${defaultEngine}" not found`);
    }
  }
}
