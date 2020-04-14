import React from "react";
import i18n from "i18next";
import { Trans } from "react-i18next";
import "react-dates/initialize";
import { SingleDatePicker } from "react-dates";
import moment, { Moment } from "moment";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import Table from "../table/table.component";
import styles from "./referrals-queue.css";
import { getReferrals } from "./referrals-queue.resource";

// Override the webpack CSS loader config in order to load react-dates styles.
//   See thread: https://github.com/webpack-contrib/css-loader/issues/295
import "!style-loader!css-loader!react-dates/lib/css/_datepicker.css";
import "!style-loader!css-loader!./react-dates-overrides.css";

export default function ReferralsQueue(props: ReferralsQueueProps) {
  const [referrals, setReferrals]: [Referral[], Function] = React.useState([]);
  const [referralType, setReferralType] = React.useState("");
  const today = moment();
  const [fromDate, setFromDate] = React.useState(moment().subtract(1, "month"));
  const [toDate, setToDate] = React.useState(today);
  const [ptQuery, setPtQuery] = React.useState("");
  const [fromDateFocused, setFromDateFocused] = React.useState(false);
  const [toDateFocused, setToDateFocused] = React.useState(false);

  const getLocale = () =>
    i18n.language || window.localStorage.i18nextLng || "en";
  moment.locale(getLocale());

  React.useEffect(() => {
    if (fromDate && toDate) {
      const sub = getReferrals({
        fromDate: fromDate.format("YYYY-MM-DD"),
        toDate: toDate.format("YYYY-MM-DD"),
        locale: getLocale()
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
                <Trans i18nKey="from">From</Trans>
              </label>
              <SingleDatePicker
                id="from-date"
                date={fromDate}
                onDateChange={date => setFromDate(date)}
                focused={fromDateFocused}
                onFocusChange={({ focused }) => setFromDateFocused(focused)}
                isOutsideRange={(date: Moment) => date.isAfter(today)}
                displayFormat="DD MMM YYYY"
                numberOfMonths={1}
              />
            </div>
            <div className={styles.dateInputContainer}>
              <label htmlFor="to-date">
                <Trans i18nKey="to">To</Trans>
              </label>
              <SingleDatePicker
                id="to-date"
                date={toDate}
                onDateChange={date => setToDate(date)}
                focused={toDateFocused}
                onFocusChange={({ focused }) => setToDateFocused(focused)}
                isOutsideRange={(date: Moment) => date.isAfter(today)}
                displayFormat="DD MMM YYYY"
                numberOfMonths={1}
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
