import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react'

export default function Test() {
	return (
		<div>Test</div>
	)
}
// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["Dashboard", "main"])),
    },
  };
}

// translation ##################################
