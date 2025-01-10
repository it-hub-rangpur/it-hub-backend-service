export interface ICenter {
  id: number;
  c_name: string;
  prefix: string;
  is_delete: number;
  is_open: boolean;
}

export interface IIvac {
  id: number;
  center_info_id: number;
  ivac_name: string;
  address: string;
  prefix: string;
  ceated_on: string;
  visa_fee: number;
  is_delete: number;
  app_key: string;
  charge: number;
  new_visa_fee: number;
  old_visa_fee: number;
  new_fees_applied_from: string;
  notify_fees_from: string;
  max_notification_count: number;
  allow_old_amount_until_new_date: number;
  notification_text_beside_amount: string;
  notification_text_popup: string;
  created_at?: string;
  updated_at?: string;
  contact_number?: string;
  created_by?: string;
}

export interface IVisaType {
  id: number;
  type_name: string;
  order: number;
  is_active: number;
  $$hashKey?: string;
}

export interface IAmountChangeData {
  allow_old_amount_until_new_date: number;
  max_notification_count: number;
  old_visa_fees: string;
  new_fees_applied_from: string;
  notice: boolean;
  notice_short: string;
  notice_popup: string;
  new_visa_fee: string;
}

export const centers: { [key: number]: ICenter } = {
  1: {
    id: 1,
    c_name: "Dhaka",
    prefix: "D",
    is_delete: 0,
    is_open: true,
  },
  3: {
    id: 3,
    c_name: "Rajshahi",
    prefix: "R",
    is_delete: 0,
    is_open: true,
  },
};

export const ivacs: { [key: number]: IIvac } = {
  2: {
    id: 2,
    center_info_id: 3,
    ivac_name: "IVAC , RAJSHAHI",
    address:
      "Morium Ali Tower,Holding No-18, Plot No-557, 1ST Floor,Old Bilsimla, Greater Road,Barnali More, 1ST Floor, Ward No-10,Rajshahi.",
    prefix: "R",
    ceated_on: "2017-08-30 13:06:20",
    visa_fee: 800.0,
    is_delete: 0,
    app_key: "IVACRAJSHAHI",
    charge: 3,
    new_visa_fee: 800.0,
    old_visa_fee: 800.0,
    new_fees_applied_from: "2018-08-05 00:00:00",
    notify_fees_from: "2018-07-29 04:54:32",
    max_notification_count: 2,
    allow_old_amount_until_new_date: 2,
    notification_text_beside_amount:
      "(From <from> this IVAC fees will be <new_amount> BDT)",
    notification_text_popup: "",
  },
  17: {
    id: 17,
    center_info_id: 1,
    ivac_name: "IVAC, Dhaka (JFP)",
    address: "Jamuna Future Park",
    prefix: "D",
    ceated_on: "2018-07-12 05:58:00",
    visa_fee: 800.0,
    is_delete: 0,
    created_at: "2018-07-12 00:00:00",
    updated_at: "",
    app_key: "IVACJFP",
    contact_number: "",
    created_by: "",
    charge: 3,
    new_visa_fee: 800.0,
    old_visa_fee: 800.0,
    new_fees_applied_from: "2018-08-05 00:00:00",
    notify_fees_from: "2018-07-29 04:54:32",
    max_notification_count: 2,
    allow_old_amount_until_new_date: 2,
    notification_text_beside_amount:
      "(From <from> this IVAC fees will be <new_amount> BDT)",
    notification_text_popup: "",
  },
};

export const visaTypes: { [key: number]: IVisaType } = {
  13: {
    id: 13,
    type_name: "MEDICAL/MEDICAL ATTENDANT VISA",
    order: 2,
    is_active: 1,
    $$hashKey: "object:50",
  },
};

export const amountChangeData: IAmountChangeData = {
  allow_old_amount_until_new_date: 2,
  max_notification_count: 0,
  old_visa_fees: "800.00",
  new_fees_applied_from: "2018-08-05 00:00:00",
  notice: false,
  notice_short: "",
  notice_popup: "",
  new_visa_fee: "800.00",
};
