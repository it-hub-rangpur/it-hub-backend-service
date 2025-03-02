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
  new_visa_fee: string;
}

export interface IPaymentOption {
  name: string;
  slug: string;
  link: string;
}

export const centers: { [key: number]: ICenter } = {
  1: {
    id: 1,
    c_name: "Dhaka",
    prefix: "D",
    is_delete: 0,
    is_open: true,
  },
  2: {
    id: 2,
    c_name: "Chittagong",
    prefix: "C",
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
  4: {
    id: 4,
    c_name: "Sylhet",
    prefix: "S",
    is_delete: 0,
    is_open: true,
  },
  5: {
    id: 5,
    c_name: "Khulna",
    prefix: "K",
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
    contact_number: "",
    charge: 3,
    new_visa_fee: 800.0,
    old_visa_fee: 800.0,
    new_fees_applied_from: "2018-08-05 00:00:00",
    notify_fees_from: "2018-07-29 04:54:32",
    max_notification_count: 2,
    allow_old_amount_until_new_date: 2,
    notification_text_beside_amount:
      "(From <from> this IVAC fees will be <new_amount> BDT)",
  },
  3: {
    id: 3,
    center_info_id: 5,
    ivac_name: "IVAC, KHULNA",
    address:
      "Dr. Motiar Rahman Tower,64, KDA Avenue,KDA Commercial Area,Banking Zone, Khulna-9100.",
    prefix: "D",
    ceated_on: "2017-08-30 13:07:08",
    visa_fee: 800.0,
    is_delete: 0,
    app_key: "IVACKHULNA",
    contact_number: "",
    charge: 3,
    new_visa_fee: 800.0,
    old_visa_fee: 800.0,
    new_fees_applied_from: "2018-08-05 00:00:00",
    notify_fees_from: "2018-07-29 04:54:32",
    max_notification_count: 2,
    allow_old_amount_until_new_date: 2,
    notification_text_beside_amount:
      "(From <from> this IVAC fees will be <new_amount> BDT)",
  },
  4: {
    id: 4,
    center_info_id: 4,
    ivac_name: "IVAC, SYLHET",
    address:
      "State Bank of India, Rahim Tower, Subhanighat Biswa Road,Sylhet 3100, Bangladesh.",
    prefix: "S",
    ceated_on: "2017-08-30 13:07:47",
    visa_fee: 800.0,
    is_delete: 0,
    app_key: "IVACSYLHET",
    contact_number: "",
    charge: 3,
    new_visa_fee: 800.0,
    old_visa_fee: 800.0,
    new_fees_applied_from: "2018-08-05 00:00:00",
    notify_fees_from: "2018-07-29 04:54:32",
    max_notification_count: 2,
    allow_old_amount_until_new_date: 2,
    notification_text_beside_amount:
      "(From <from> this IVAC fees will be <new_amount> BDT)",
  },
  5: {
    id: 5,
    center_info_id: 2,
    ivac_name: "IVAC, CHITTAGONG",
    address:
      "2111, Zakir Hossain Road, Habib Lane,Opposite Holy Crescent Hospital, Chittaghong",
    prefix: "C",
    ceated_on: "2017-08-30 13:08:37",
    visa_fee: 800.0,
    is_delete: 0,
    app_key: "IVACCHITTAGONG",
    contact_number: "",
    charge: 3,
    new_visa_fee: 800.0,
    old_visa_fee: 800.0,
    new_fees_applied_from: "2018-08-05 00:00:00",
    notify_fees_from: "2018-07-29 04:54:32",
    max_notification_count: 2,
    allow_old_amount_until_new_date: 2,
    notification_text_beside_amount:
      "(From <from> this IVAC fees will be <new_amount> BDT)",
  },
  7: {
    id: 7,
    center_info_id: 3,
    ivac_name: "IVAC, RANGPUR",
    address: "J B Sen Road,Opposite Ram Krishana Mission,Mahigonj, Rangpur",
    prefix: "R",
    ceated_on: "2017-08-30 13:13:18",
    visa_fee: 800.0,
    is_delete: 0,
    app_key: "IVACRANGPUR",
    contact_number: "",
    charge: 3,
    new_visa_fee: 800.0,
    old_visa_fee: 800.0,
    new_fees_applied_from: "2018-08-05 00:00:00",
    notify_fees_from: "2018-07-29 04:54:32",
    max_notification_count: 2,
    allow_old_amount_until_new_date: 2,
    notification_text_beside_amount:
      "(From <from> this IVAC fees will be <new_amount> BDT)",
  },
  8: {
    id: 8,
    center_info_id: 4,
    ivac_name: "IVAC, MYMENSINGH",
    address: "297/1, Masakanda,1st Floor, Masakanda Bus Stand,Mymensingh",
    prefix: "S",
    ceated_on: "2017-08-30 13:13:59",
    visa_fee: 800.0,
    is_delete: 0,
    app_key: "IVACMYMENSINGH",
    contact_number: "",
    charge: 3,
    new_visa_fee: 800.0,
    old_visa_fee: 800.0,
    new_fees_applied_from: "2018-08-05 00:00:00",
    notify_fees_from: "2018-07-29 04:54:32",
    max_notification_count: 2,
    allow_old_amount_until_new_date: 2,
    notification_text_beside_amount:
      "(From <from> this IVAC fees will be <new_amount> BDT)",
  },
  9: {
    id: 9,
    center_info_id: 1,
    ivac_name: "IVAC, BARISAL",
    address:
      "North City Super Market,1st Floor, Barisal City Corporation,Amrita Lal Dey Road, Barisal",
    prefix: "D",
    ceated_on: "2017-08-30 13:14:58",
    visa_fee: 800.0,
    is_delete: 0,
    app_key: "IVACBARISAL",
    contact_number: "",
    charge: 3,
    new_visa_fee: 800.0,
    old_visa_fee: 800.0,
    new_fees_applied_from: "2018-08-05 00:00:00",
    notify_fees_from: "2018-07-29 04:54:32",
    max_notification_count: 2,
    allow_old_amount_until_new_date: 2,
    notification_text_beside_amount:
      "(From <from> this IVAC fees will be <new_amount> BDT)",
  },
  12: {
    id: 12,
    center_info_id: 1,
    ivac_name: "IVAC, JESSORE",
    address:
      "Indian Visa Application Center, Jessore, 210, Narail Road, Jessore, (Opposite of BADC seed storage godown suparibagan) ",
    prefix: "D",
    ceated_on: "2017-08-31 04:36:32",
    visa_fee: 800.0,
    is_delete: 0,
    app_key: "IVACJESSORE",
    contact_number: "",
    charge: 3,
    new_visa_fee: 800.0,
    old_visa_fee: 800.0,
    new_fees_applied_from: "2018-08-05 00:00:00",
    notify_fees_from: "2018-07-29 04:54:32",
    max_notification_count: 2,
    allow_old_amount_until_new_date: 2,
    notification_text_beside_amount:
      "(From <from> this IVAC fees will be <new_amount> BDT)",
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
    app_key: "IVACJFP",
    contact_number: "",
    charge: 3,
    new_visa_fee: 800.0,
    old_visa_fee: 800.0,
    new_fees_applied_from: "2018-08-05 00:00:00",
    notify_fees_from: "2018-07-29 04:54:32",
    max_notification_count: 2,
    allow_old_amount_until_new_date: 2,
    notification_text_beside_amount:
      "(From <from> this IVAC fees will be <new_amount> BDT)",
  },
  18: {
    id: 18,
    center_info_id: 3,
    ivac_name: "IVAC, THAKURGAON",
    address: "Thakurgaon",
    prefix: "R",
    ceated_on: "2018-11-28 11:15:10",
    visa_fee: 800.0,
    is_delete: 0,
    app_key: "IVACTHAKURGAON",
    contact_number: "",
    charge: 3,
    new_visa_fee: 800.0,
    old_visa_fee: 800.0,
    new_fees_applied_from: "2018-08-05 00:00:00",
    notify_fees_from: "2018-07-29 04:54:32",
    max_notification_count: 2,
    allow_old_amount_until_new_date: 2,
    notification_text_beside_amount:
      "(From <from> this IVAC fees will be <new_amount> BDT)",
  },
  19: {
    id: 19,
    center_info_id: 3,
    ivac_name: "IVAC, BOGURA",
    address: "Bogura",
    prefix: "R",
    ceated_on: "2018-11-28 05:17:46",
    visa_fee: 800.0,
    is_delete: 0,
    app_key: "IVACBOGURA",
    contact_number: "",
    charge: 3,
    new_visa_fee: 800.0,
    old_visa_fee: 800.0,
    new_fees_applied_from: "2018-08-05 00:00:00",
    notify_fees_from: "2018-07-29 04:54:32",
    max_notification_count: 2,
    allow_old_amount_until_new_date: 2,
    notification_text_beside_amount:
      "(From <from> this IVAC fees will be <new_amount> BDT)",
  },
  20: {
    id: 20,
    center_info_id: 1,
    ivac_name: "IVAC, SATKHIRA",
    address: "Satkhira",
    prefix: "D",
    ceated_on: "2018-11-28 05:19:06",
    visa_fee: 800.0,
    is_delete: 0,
    app_key: "IVACSATKHIRA",
    contact_number: "",
    charge: 3,
    new_visa_fee: 800.0,
    old_visa_fee: 800.0,
    new_fees_applied_from: "2018-08-05 00:00:00",
    notify_fees_from: "2018-07-29 04:54:32",
    max_notification_count: 2,
    allow_old_amount_until_new_date: 2,
    notification_text_beside_amount:
      "(From <from> this IVAC fees will be <new_amount> BDT)",
  },
  21: {
    id: 21,
    center_info_id: 2,
    ivac_name: "IVAC, CUMILLA",
    address: "Cumilla",
    prefix: "C",
    ceated_on: "2018-11-28 05:20:37",
    visa_fee: 800.0,
    is_delete: 0,
    app_key: "IVACCUMILLA",
    contact_number: "",
    charge: 3,
    new_visa_fee: 800.0,
    old_visa_fee: 800.0,
    new_fees_applied_from: "2018-08-05 00:00:00",
    notify_fees_from: "2018-07-29 04:54:32",
    max_notification_count: 2,
    allow_old_amount_until_new_date: 2,
    notification_text_beside_amount:
      "(From <from> this IVAC fees will be <new_amount> BDT)",
  },
  22: {
    id: 22,
    center_info_id: 2,
    ivac_name: "IVAC, NOAKHALI",
    address: "Noakhali",
    prefix: "C",
    ceated_on: "2018-11-28 05:22:29",
    visa_fee: 800.0,
    is_delete: 0,
    app_key: "IVACNOAKHALI",
    contact_number: "",
    charge: 3,
    new_visa_fee: 800.0,
    old_visa_fee: 800.0,
    new_fees_applied_from: "2018-08-05 00:00:00",
    notify_fees_from: "2018-07-29 04:54:32",
    max_notification_count: 2,
    allow_old_amount_until_new_date: 2,
    notification_text_beside_amount:
      "(From <from> this IVAC fees will be <new_amount> BDT)",
  },
  23: {
    id: 23,
    center_info_id: 2,
    ivac_name: "IVAC, BRAHMANBARIA",
    address: "Brahmanbaria",
    prefix: "C",
    ceated_on: "2018-11-28 05:23:46",
    visa_fee: 800.0,
    is_delete: 0,
    app_key: "IVACBRAHMANBARIA",
    contact_number: "",
    charge: 3,
    new_visa_fee: 800.0,
    old_visa_fee: 800.0,
    new_fees_applied_from: "2018-08-05 00:00:00",
    notify_fees_from: "2018-07-29 04:54:32",
    max_notification_count: 2,
    allow_old_amount_until_new_date: 2,
    notification_text_beside_amount:
      "(From <from> this IVAC fees will be <new_amount> BDT)",
  },
  24: {
    id: 24,
    center_info_id: 3,
    ivac_name: "IVAC, KUSHTIA",
    address: "Kushtia",
    prefix: "R",
    ceated_on: "2023-04-16 07:58:24",
    visa_fee: 800.0,
    is_delete: 0,
    app_key: "IVACKUSHTIA",
    contact_number: "",
    charge: 3,
    new_visa_fee: 800.0,
    old_visa_fee: 800.0,
    new_fees_applied_from: "2023-04-16 13:58:24",
    notify_fees_from: "2023-04-16 13:58:24",
    max_notification_count: 2,
    allow_old_amount_until_new_date: 2,
    notification_text_beside_amount:
      "(From <from> this IVAC fees will be <new_amount> BDT)",
  },
};

export const visaTypes: { [key: number]: IVisaType } = {
  3: {
    id: 3,
    type_name: "TOURIST VISA",
    order: 1,
    is_active: 1,
    $$hashKey: "object:49",
  },
  13: {
    id: 13,
    type_name: "MEDICAL/MEDICAL ATTENDANT VISA",
    order: 2,
    is_active: 1,
    $$hashKey: "object:50",
  },
  1: {
    id: 1,
    type_name: "BUSINESS VISA",
    order: 4,
    is_active: 1,
    $$hashKey: "object:51",
  },
  6: {
    id: 6,
    type_name: "ENTRY VISA",
    order: 5,
    is_active: 1,
    $$hashKey: "object:52",
  },
  2: {
    id: 2,
    type_name: "STUDENT VISA",
    order: 6,
    is_active: 1,
    $$hashKey: "object:53",
  },
};

export const paymentOptions: { [key: string]: IPaymentOption } = {
  dbblmobilebanking: {
    name: "DBBL MOBILE BANKING",
    slug: "dbblmobilebanking",
    link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/dbblmobilebank.png",
  },
  bkash: {
    name: "Bkash",
    slug: "bkash",
    link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/bkash.png",
  },
  mycash: {
    name: "MYCASH",
    slug: "mycash",
    link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/mycash.png",
  },
  nagad: {
    name: "Nagad",
    slug: "nagad",
    link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/nagad.png",
  },
  mobilemoney: {
    name: "Mobile Money",
    slug: "mobilemoney",
    link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/mobilemoney.png",
  },
  okwallet: {
    name: "Okwallet",
    slug: "okwallet",
    link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/okwallet.png",
  },
  visacard: {
    name: "VISA",
    slug: "visacard",
    link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/visa.png",
  },
  mastercard: {
    name: "MASTER",
    slug: "mastercard",
    link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/master.png",
  },
};

export const amountChangeData: IAmountChangeData = {
  allow_old_amount_until_new_date: 2,
  max_notification_count: 0,
  old_visa_fees: "800.00",
  new_fees_applied_from: "2018-08-05 00:00:00",
  notice: false,
  new_visa_fee: "800.00",
};
