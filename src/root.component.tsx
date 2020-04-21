import React from "react";
import openmrsRootDecorator from "@openmrs/react-root-decorator";
import {
  defineConfigSchema,
  validators,
  validator
} from "@openmrs/esm-module-config";
import { BrowserRouter, Route } from "react-router-dom";
import ReferralsQueue from "./referrals-queue/referrals-queue.component";
import styles from "./root.css";

const validateUrlTemplate = validator(
  s => !s.includes("`"),
  "url template may not include backticks"
);

defineConfigSchema("@pih/esm-referrals-queue", {
  links: {
    patientDash: {
      spa: {
        default: false,
        validators: [validators.isBoolean]
      },
      url: {
        default:
          "/coreapps/clinicianfacing/patient.page?patientId=${patientUuid}&app=pih.app.clinicianDashboard",
        validators: [validators.isString, validateUrlTemplate]
      }
    },
    visitPage: {
      spa: {
        default: false,
        validators: [validators.isBoolean]
      },
      url: {
        default:
          "/pihcore/visit/visit.page?patient=${patientUuid}&visit=${visitUuid}&suppressActions=true#/overview",
        validators: [validators.isString, validateUrlTemplate]
      }
    },
    homeVisitForm: {
      spa: {
        default: false,
        validators: [validators.isBoolean]
      },
      url: {
        default:
          "/htmlformentryui/htmlform/editHtmlFormWithStandardUi.page?patientId=${patientUuid}&visitId=${visitUuid}&encounterId=${encounterUuid}&definitionUiResource=file:configuration/pih/htmlforms/section-mch-referral.xml",
        validators: [validators.isString, validateUrlTemplate]
      }
    }
  },
  pendingStatuses: {
    default: ["Pending status", "Referral unmet"],
    arrayElements: {
      validators: [validators.isString]
    }
  }
});

function Root(props) {
  return (
    <div className={`omrs-main-content ${styles.overflowAuto}`}>
      <BrowserRouter basename={window["getOpenmrsSpaBase"]()}>
        <Route path="/referrals-queue" component={ReferralsQueue} />
      </BrowserRouter>
    </div>
  );
}
export default openmrsRootDecorator({
  featureName: "Referrals Queue",
  moduleName: "@pih/esm-referrals-queue"
})(Root);
