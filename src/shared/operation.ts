type Props = Record<string, string | number | boolean>;

export interface Operation {
  type: string;
  props: Props;
}
