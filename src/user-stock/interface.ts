interface Stock {
  Symbol: string;
  Date: string;
  Time: string;
  Open: string;
  High: string;
  Low: string;
  Close: string;
  Volume: string;
  Name: string;
}

interface Stats {
  stock: string;
  requested_times: number;
}

export { Stock, Stats };
