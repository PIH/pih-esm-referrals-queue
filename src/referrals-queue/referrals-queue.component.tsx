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

  React.useEffect(() => {
    const sub = getReferrals({ fromDate, toDate }).subscribe(
      referrals => setReferrals(referrals),
      createErrorHandler()
    );
    return () => sub.unsubscribe();
  }, [fromDate, toDate]);

  // console.log(referrals);

  const filteredReferrals = referrals.filter(
    r => !referralType || r.referral_type == referralType
  );
  const referralTypes = [...new Set(referrals.map(r => r.referral_type))];
  return (
    <div className={`omrs-main-content ${styles.container}`}>
      <div className="omrs-card omrs-margin-top-32 omrs-padding-16">
        <div className={styles.greeting}>
          <Trans i18nKey="referrals-queue">Referrals Queue</Trans>
        </div>
        <div>
          <label>
            <Trans i18nKey="from">From</Trans>
            <div className="omrs-datepicker">
              <input
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
          </label>
          <label>
            <Trans i18nKey="to">To</Trans>
            <div className="omrs-datepicker">
              <input
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
          </label>
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
        <div className={styles.tableContainer}>
          <Table referrals={filteredReferrals} />
        </div>
      </div>
    </div>
  );
}

type ReferralsQueueProps = {};
