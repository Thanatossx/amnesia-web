import { getAboutSections } from "@/lib/public-api";
import AboutContent from "./AboutContent";

export default async function AboutPage() {
  const sections = await getAboutSections();
  return <AboutContent sections={sections} />;
}
