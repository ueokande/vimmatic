type FindQuery = {
  keyword: string;
  mode: "normal" | "regexp";
  ignoreCase: boolean;
};

export default FindQuery;
