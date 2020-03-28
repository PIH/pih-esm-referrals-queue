import React from "react";
import { Link } from "react-router-dom";

export default function ConfigurableLink({
  label,
  spa,
  url,
  className = ""
}: ConfigurableLinkProps) {
  const absoluteUrlRegex = new RegExp("^(?:[a-z]+:)?//", "i");
  if (!spa && !url.match(absoluteUrlRegex)) {
    //@ts-ignore
    url = window.openmrsBase + url;
  }
  return spa ? (
    <Link to={url} className={className}>
      {label}
    </Link>
  ) : (
    <a
      className={className}
      onClick={event => nonSpaNavigate(event, url)}
      href={url}
    >
      {label}
    </a>
  );
}

function nonSpaNavigate(event, url: string) {
  if (!event.ctrlKey && event.which != 2 && event.which != 3) {
    window.location.href = url;
  }
}

type ConfigurableLinkProps = {
  label: string;
  spa: boolean;
  url: string;
  className?: string;
};
