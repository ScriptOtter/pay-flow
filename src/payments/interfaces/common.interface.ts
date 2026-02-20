// Enum для типа валюты
export enum CurrencyType {
  Crypto = 'crypto',
  Fiat = 'fiat',
}

// Enum для поддерживаемых криптовалют
export enum CryptoAsset {
  USDT = 'USDT',
  TON = 'TON',
  BTC = 'BTC',
  ETH = 'ETH',
  LTC = 'LTC',
  BNB = 'BNB',
  TRX = 'TRX',
  USDC = 'USDC',
  JET = 'JET',
}

// Enum для поддерживаемых фиатных валют
export enum FiatCurrency {
  USD = 'USD',
  EUR = 'EUR',
  RUB = 'RUB',
  BYN = 'BYN',
  UAH = 'UAH',
  GBP = 'GBP',
  CNY = 'CNY',
  KZT = 'KZT',
  UZS = 'UZS',
  GEL = 'GEL',
  TRY = 'TRY',
  AMD = 'AMD',
  THB = 'THB',
  INR = 'INR',
  BRL = 'BRL',
  IDR = 'IDR',
  AZN = 'AZN',
  AED = 'AED',
  PLN = 'PLN',
  ILS = 'ILS',
}

// Enum для поддерживаемых активов для swap
export enum SwapAsset {
  USDT = 'USDT',
  TON = 'TON',
  TRX = 'TRX',
  ETH = 'ETH',
  SOL = 'SOL',
  BTC = 'BTC',
  LTC = 'LTC',
}

// Enum для названий кнопок после оплаты
export enum PaidButtonName {
  ViewItem = 'viewItem', // “View Item”
  OpenChannel = 'openChannel', // “View Channel”
  OpenBot = 'openBot', // “Open Bot”
  Callback = 'callback', // “Return”
}

// Интерфейс для параметров счета (инвойса)
export interface InvoiceParams {
  /**
   * Type of the price, can be “crypto” or “fiat”. Defaults to crypto.
   */
  currency_type?: CurrencyType;

  /**
   * Required if currency_type is “crypto”.
   * Cryptocurrency alphabetic code.
   * Supported assets: “USDT”, “TON”, “BTC”, “ETH”, “LTC”, “BNB”, “TRX” and “USDC”.
   */
  asset?: CryptoAsset;

  /**
   * Required if currency_type is “fiat”.
   * Fiat currency code.
   */
  fiat?: FiatCurrency;

  /**
   * List of cryptocurrency alphabetic codes separated comma.
   * Assets which can be used to pay the invoice.
   * Available only if currency_type is “fiat”.
   * Defaults to all currencies.
   */
  accepted_assets?: string; // Comma-separated list of CryptoAsset values

  /**
   * Amount of the invoice in float. For example: 125.50
   */
  amount: string;

  /**
   * The asset that will be attempted to be swapped into after the user makes a payment.
   * The swap is not guaranteed.
   */
  swap_to?: SwapAsset;

  /**
   * Description for the invoice.
   * User will see this description when they pay the invoice.
   * Up to 1024 characters.
   */
  description?: string;

  /**
   * Text of the message which will be presented to a user after the invoice is paid.
   * Up to 2048 characters.
   */
  hidden_message?: string;

  /**
   * Label of the button which will be presented to a user after the invoice is paid.
   */
  paid_btn_name?: PaidButtonName;

  /**
   * Required if paid_btn_name is specified.
   * URL opened using the button which will be presented to a user after the invoice is paid.
   * You can set any callback link (for example, a success link or link to homepage).
   * Starts with https or http.
   */
  paid_btn_url?: string;

  /**
   * Any data you want to attach to the invoice (for example, user ID, payment ID, etc).
   * Up to 4kb.
   */
  payload?: string;

  /**
   * Allow a user to add a comment to the payment. Defaults to true.
   */
  allow_comments?: boolean;

  /**
   * Allow a user to pay the invoice anonymously. Defaults to true.
   */
  allow_anonymous?: boolean;

  /**
   * You can set a payment time limit for the invoice in seconds.
   * Values between 1-2678400 are accepted.
   */
  expires_in?: number; // Range: 1-2678400
}

// Тип для создания счета (может использоваться как альтернатива интерфейсу)
export type CreateInvoicePayload = {
  currency_type?: CurrencyType;
  asset?: CryptoAsset;
  fiat?: FiatCurrency;
  accepted_assets?: string;
  amount: string;
  swap_to?: SwapAsset;
  description?: string;
  hidden_message?: string;
  paid_btn_name?: PaidButtonName;
  paid_btn_url?: string;
  payload?: string;
  allow_comments?: boolean;
  allow_anonymous?: boolean;
  expires_in?: number;
};

// Тип для ответа при создании счета (пример)
export interface InvoiceResponse {
  invoice_id: number;
  hash: string;
  asset: CryptoAsset;
  amount: string;
  pay_url: string;
  status: 'active' | 'paid' | 'expired';
  created_at: string;
  allow_comments?: boolean;
  allow_anonymous?: boolean;
  description?: string;
  hidden_message?: string;
  paid_btn_name?: PaidButtonName;
  paid_btn_url?: string;
  payload?: string;
  expires_in?: number;
}

// Вспомогательный тип для проверки корректности полей в зависимости от currency_type
export type ValidInvoiceParams =
  | (InvoiceParams & {
      currency_type?: CurrencyType.Crypto;
      asset: CryptoAsset;
      fiat?: never;
    })
  | (InvoiceParams & {
      currency_type: CurrencyType.Fiat;
      fiat: FiatCurrency;
      asset?: never;
    })
  | (InvoiceParams & {
      currency_type?: never;
      asset?: CryptoAsset;
      fiat?: never;
    }); // Default case (crypto)

export interface CryptoResponse<T> {
  ok: boolean;
  result: T;
}
