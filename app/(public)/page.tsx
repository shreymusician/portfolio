import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { SRBuildsSection } from "@/components/sections/sr-builds-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { CertificationsSection } from "@/components/sections/certifications-section";
import { GitHubSection } from "@/components/sections/github-section";
import { ContactSection } from "@/components/sections/contact-section";
import { SectionDivider } from "@/components/ui/section-divider";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SectionDivider />
      <AboutSection />
      <SectionDivider />
      <SRBuildsSection />
      <SectionDivider />
      <GitHubSection />
      <SectionDivider />
      <ProjectsSection />
      <SectionDivider />
      <CertificationsSection />
      <SectionDivider />
      <ContactSection />
    </>
  );
}
