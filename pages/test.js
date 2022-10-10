import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react'
import { useRouter } from 'next/router'

export default function Test() {
  const router = useRouter()
  const { t } = useTranslation("main");
  console.log(router);
  return (
    <div>{t("track_key")}</div>
  )
}
// translation ##################################
export async function getServerSideProps(context) {
  console.log(context);
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ["main"])),
    },
  };
}


// translation ##################################
