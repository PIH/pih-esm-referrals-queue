import React from "react";
import { Trans } from "react-i18next";
import "react-dates/initialize";
import { DateRangePicker } from "react-dates";
import moment, { Moment } from "moment";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import Table from "../table/table.component";
import styles from "./referrals-queue.css";
import { getReferrals } from "./referrals-queue.resource";

// @bistenes: I guess we have to override the webpack css loader config
//   in order to load the react-dates styles.
//   See thread: https://github.com/webpack-contrib/css-loader/issues/295
import "!style-loader!css-loader!react-dates/lib/css/_datepicker.css";

export default function ReferralsQueue(props: ReferralsQueueProps) {
  const [referrals, setReferrals]: [Referral[], Function] = React.useState([]);
  const [referralType, setReferralType] = React.useState("");
  const today = moment();
  const [fromDate, setFromDate] = React.useState(moment().subtract(1, "month"));
  const [toDate, setToDate] = React.useState(today);
  const [ptQuery, setPtQuery] = React.useState("");
  const [focusedDateInput, setFocusedDateInput] = React.useState(null);

  React.useEffect(() => {
    if (fromDate && toDate) {
      const sub = getReferrals({
        fromDate: fromDate.format("YYYY-MM-DD"),
        toDate: toDate.format("YYYY-MM-DD")
      }).subscribe(referrals => setReferrals(referrals), createErrorHandler());
      return () => sub.unsubscribe();
    }
  }, [fromDate, toDate]);

  // console.log(referrals);
  const filteredReferrals = referrals
    .filter(r => !referralType || r.referral_type == referralType)
    .filter(r => matchQuery(r, ptQuery));
  const referralTypes = [...new Set(referrals.map(r => r.referral_type))];
  return (
    <div className={styles.container}>
      <div className="omrs-card omrs-margin-top-16 omrs-padding-16">
        <div className="omrs-type-title-2">
          <Trans i18nKey="referrals-queue">Referrals Queue</Trans>
        </div>
        <div className={styles.controlsContainer}>
          <div className={styles.inputContainer}>
            <div className={styles.dateInputContainer}>
              <label htmlFor="from-date">
                <Trans i18nKey="from">Filter by date</Trans>
              </label>
              {/* <DatePicker selected={fromDate} onChange={date => setFromDate(date)} /> */}
              <DateRangePicker
                startDate={fromDate}
                startDateId="from_date"
                endDate={toDate}
                endDateId="to_date"
                onDatesChange={({ startDate, endDate }) => {
                  setFromDate(startDate);
                  setToDate(endDate);
                }}
                focusedInput={focusedDateInput}
                onFocusChange={i => setFocusedDateInput(i)}
                isOutsideRange={(date: Moment) => date.isAfter(today)}
              />
            </div>
          </div>
          <div className={styles.inputContainer}>
            <div className="omrs-input-group">
              <label htmlFor="referral-type">
                <Trans i18nKey="referrals-queue">Referral Type</Trans>
              </label>
              <select
                id="referral-type"
                value={referralType}
                onChange={e => setReferralType(e.target.value)}
                className={styles.dropdown}
              >
                <option value="">Any</option>
                {referralTypes.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.inputContainer}>
            <div className="omrs-input-group">
              <label htmlFor="query-input">
                <Trans i18nKey="filter-by-patient">Filter by patient</Trans>
              </label>
              <input
                id="query-input"
                type="text"
                value={ptQuery}
                onChange={e => setPtQuery(e.target.value)}
                className="omrs-input-outlined"
              />
            </div>
          </div>
        </div>
        <div className={styles.tableContainer}>
          <Table referrals={filteredReferrals} />
        </div>
      </div>
    </div>
  );
}

function matchQuery(referral: Referral, query: string): boolean {
  return (
    !query ||
    prepareQuery(query).every(regexp =>
      regexp.test(removeDiacritics(referral.patient_name))
    ) ||
    new RegExp(query, "i").test(referral.zl_emr_id)
  );
}

function prepareQuery(query: string): RegExp[] {
  return query.split(/\s/).map(token => {
    const tokenCleaned = removeDiacritics(token);
    return new RegExp("\\b" + tokenCleaned, "i");
  });
}

function removeDiacritics(str: string) {
  // From https://stackoverflow.com/a/37511463/1464495
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

type ReferralsQueueProps = {};
