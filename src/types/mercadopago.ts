export interface MercadoPagoPreference {
  id: string;
  init_point: string;
  sandbox_init_point: string;
}

export interface MercadoPagoItem {
  id: string;
  title: string;
  description?: string;
  quantity: number;
  currency_id: string;
  unit_price: number;
}

export interface MercadoPagoPayer {
  name: string;
  surname?: string;
  email: string;
  phone?: {
    area_code: string;
    number: string;
  };
}

export interface MercadoPagoPayment {
  id: string;
  status:
    | "pending"
    | "approved"
    | "authorized"
    | "in_process"
    | "in_mediation"
    | "rejected"
    | "cancelled"
    | "refunded"
    | "charged_back";
  status_detail: string;
  payment_method_id: string;
  payment_type_id: string;
  transaction_amount: number;
  currency_id: string;
  date_created: string;
  date_approved?: string;
  payer: {
    id: string;
    email: string;
    identification?: {
      type: string;
      number: string;
    };
  };
}

export interface CreatePreferenceRequest {
  items: MercadoPagoItem[];
  payer: MercadoPagoPayer;
  back_urls: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return: "approved" | "all";
  external_reference: string;
  notification_url?: string;
}

export interface subscriptionData {
  amount: number;
  reason: string;
  free_trial: number;
}
