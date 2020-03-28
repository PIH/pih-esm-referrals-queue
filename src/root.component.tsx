import React from "react";
import openmrsRootDecorator from "@openmrs/react-root-decorator";
import {
  defineConfigSchema,
  validators,
  validator
} from "@openmrs/esm-module-config";
import { BrowserRouter, Route } from "react-router-dom";
import ReferralsQueue from "./referrals-queue/referrals-queue.component";

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
        validators: [
          validators.isString,
          validator(
            s => !s.includes("`"),
            "url template may not include backticks"
          )
        ]
      }
    }
  }
});

function Root(props) {
  return (
    <BrowserRouter basename={window["getOpenmrsSpaBase"]()}>
      <Route path="/referrals-queue" component={ReferralsQueue} />
    </BrowserRouter>
  );
}
export default openmrsRootDecorator({
  featureName: "Referrals Queue",
  moduleName: "@pih/esm-referrals-queue"
})(Root);
