declare type Observable<T> = import("rxjs").Observable<T>;

declare module "uuid";  // Hack to fix a problem with @openmrs/esm-offline -- Sep 28, 2021

declare module "*.css";

type Referral = {
  details: string;
  encounter_uuid: string;
  encounter_id: number;
  patient_name: string;
  referral_date: string;
  referral_type: string;
  status: string;
  visit_uuid: string;
  zl_emr_id: string;
  fulfillment_status: string;
  patient_uuid?: string;
  person_uuid?: string;
};
