export type Currency = {
  id: string;
  name: string;
  code: string;
  type: CurrencyType;
  rate: number;
};

export type CurrencyType = "FIAT" | "CRYPTO";
