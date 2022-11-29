import * as React from "react";
import NextLink from "next/link";
import { styled } from "@mui/material/styles";

const Anchor = styled("a")({});

export const NextLinkComposed = React.forwardRef(function NextLinkComposed(
  props,
  ref
) {
  const {
    to,
    linkAs,
    replace,
    scroll,
    shallow,
    prefetch,
    legacyBehavior = true,
    locale,
    ...other
  } = props;

  return (
    <NextLink
      href={to}
      prefetch={prefetch}
      as={linkAs}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref
      locale={locale}
      legacyBehavior={legacyBehavior}
    >
      <Anchor ref={ref} {...other} />
    </NextLink>
  );
});
