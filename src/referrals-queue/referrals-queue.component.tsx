import React from "react";
import { useConfig } from "@openmrs/esm-module-config";
import { Trans } from "react-i18next";
import styles from "./referrals-queue.css";

export default function ReferralsQueue(props: ReferralsQueueProps) {
  const config = useConfig();
  return config.displayGreeting ? (
    <div className={styles.greeting}>
      <Trans i18nKey="hello-from">Hello from</Trans> Referrals Queue!
    </div>
  ) : null;
}

type ReferralsQueueProps = {};
