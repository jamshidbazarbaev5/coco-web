"use client";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function ClientLanguageProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = params.lang as string;
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [params.lang, i18n]);

  return <>{children}</>;
}