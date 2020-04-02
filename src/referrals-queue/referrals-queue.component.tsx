import React from "react";
import dayjs from "dayjs";
import { Trans } from "react-i18next";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import Table from "../table/table.component";
import styles from "./referrals-queue.css";
import { getReferrals } from "./referrals-queue.resource";

export default function ReferralsQueue(props: ReferralsQueueProps) {
  const [referrals, setReferrals]: [Referral[], Function] = React.useState([]);
  const [referralType, setReferralType] = React.useState("");
  const monthAgoString = dayjs()
    .subtract(1, "month")
    .format("YYYY-MM-DD");
  const todayString = dayjs().format("YYYY-MM-DD");
  const [fromDate, setFromDate] = React.useState(monthAgoString);
  const [toDate, setToDate] = React.useState(todayString);
  const [ptQuery, setPtQuery] = React.useState("");

  React.useEffect(() => {
    const sub = getReferrals({ fromDate, toDate }).subscribe(
      referrals => setReferrals(referrals),
      createErrorHandler()
    );
    return () => sub.unsubscribe();
  }, [fromDate, toDate]);

  // console.log(referrals);
  const filteredReferrals = referrals
    .filter(r => !referralType || r.referral_type == referralType)
    .filter(r => matchQuery(r, ptQuery));
  const referralTypes = [...new Set(referrals.map(r => r.referral_type))];
  return (
    <div className={`omrs-main-content ${styles.container}`}>
      <div className="omrs-card omrs-margin-top-32 omrs-padding-16">
        <div className="omrs-type-title-2">
          <Trans i18nKey="referrals-queue">Referrals Queue</Trans>
        </div>
        <div className={styles.controlsContainer}>
          <div className={`${styles.inputContainer}`}>
            <div className={styles.dateInputContainer}>
              <label htmlFor="from-date">
                <Trans i18nKey="from">From</Trans>
              </label>
              <div className="omrs-datepicker">
                <input
                  id="from-date"
                  type="date"
                  name="datepicker"
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                  required
                />
                <svg className="omrs-icon" role="img">
                  <use xlinkHref="#omrs-icon-calendar"></use>
                </svg>
              </div>
            </div>
            <div className={styles.dateInputContainer}>
              <label htmlFor="to-date">
                <Trans i18nKey="to">To</Trans>
              </label>
              <div className="omrs-datepicker">
                <input
                  id="to-date"
                  type="date"
                  name="datepicker"
                  value={toDate}
                  onChange={e => setToDate(e.target.value)}
                  required
                />
                <svg className="omrs-icon" role="img">
                  <use xlinkHref="#omrs-icon-calendar"></use>
                </svg>
              </div>
            </div>
          </div>
          <div className={`${styles.inputContainer}`}>
            <label>
              <Trans i18nKey="referrals-queue">Referral Type</Trans>
              <select
                value={referralType}
                onChange={e => setReferralType(e.target.value)}
              >
                <option value="">Any</option>
                {referralTypes.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className={styles.inputContainer}>
            <div className="omrs-input-group">
              <input
                id="query-input"
                type="text"
                value={ptQuery}
                onChange={e => setPtQuery(e.target.value)}
                className="omrs-input-outlined"
              />
              <label htmlFor="query-input">
                <Trans i18nKey="filter-by-patient">Filter by patient</Trans>
              </label>
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
    const tokenAscii = removeDiacritics(token);
    return new RegExp("\\b" + tokenAscii, "i");
  });
}

function removeDiacritics(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

type ReferralsQueueProps = {};
