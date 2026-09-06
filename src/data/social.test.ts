import { describe, it, expect } from "vitest";
import {
  socialRegistry,
  socialProfilesList,
  navSocialProfiles,
  type SocialProfile,
} from "./social";
import { navData } from "./nav";
import { contactData } from "./contact";

describe("Centralized Social Registry", () => {
  it("codifies verified profile URLs in a single configuration module", () => {
    expect(socialRegistry.github.url).toBe("https://github.com/l-bisht");
    expect(socialRegistry.linkedin.url).toBe(
      "https://linkedin.com/in/lalit-bisht-8b4b82152/"
    );
    expect(socialRegistry.twitter.url).toBe("https://x.com/lbisht1996");
    expect(socialRegistry.email.url).toBe("mailto:lbisht1996@gmail.com");
    expect(socialRegistry.email.rawEmail).toBe("lbisht1996@gmail.com");
    expect(socialRegistry.resume.url).toBe("/resume.pdf");
  });

  it("provides complete metadata for accessibility and rendering across all profiles", () => {
    const profiles: SocialProfile[] = socialProfilesList;
    expect(profiles.length).toBe(5);

    for (const profile of profiles) {
      expect(profile.id).toBeTruthy();
      expect(profile.label).toBeTruthy();
      expect(profile.sublabel).toBeTruthy();
      expect(profile.url).toBeTruthy();
      expect(profile.iconPath).toBeTruthy();
      expect(profile.ariaLabel).toBeTruthy();
      expect(profile.accent).toMatch(/^#[0-9a-fA-F]{6}$/);

      if (profile.id === "email") {
        expect(profile.external).toBe(false);
      } else {
        expect(profile.external).toBe(true);
      }
    }
  });

  it("exports navSocialProfiles containing verified GitHub, LinkedIn, Twitter, and Email", () => {
    const ids = navSocialProfiles.map((p) => p.id);
    expect(ids).toEqual(["github", "linkedin", "twitter", "email"]);

    expect(navSocialProfiles.find((p) => p.id === "github")?.url).toBe(
      "https://github.com/l-bisht"
    );
    expect(navSocialProfiles.find((p) => p.id === "linkedin")?.url).toBe(
      "https://linkedin.com/in/lalit-bisht-8b4b82152/"
    );
    expect(navSocialProfiles.find((p) => p.id === "twitter")?.url).toBe(
      "https://x.com/lbisht1996"
    );
    expect(navSocialProfiles.find((p) => p.id === "email")?.url).toBe(
      "mailto:lbisht1996@gmail.com"
    );
  });

  it("ensures navData.social consumes links from the centralized registry", () => {
    expect(navData.social).toHaveLength(4);

    const githubLink = navData.social.find((s) => s.id === "github");
    const linkedinLink = navData.social.find((s) => s.id === "linkedin");
    const twitterLink = navData.social.find((s) => s.id === "twitter");
    const emailLink = navData.social.find((s) => s.id === "email");

    expect(githubLink?.href).toBe(socialRegistry.github.url);
    expect(linkedinLink?.href).toBe(socialRegistry.linkedin.url);
    expect(twitterLink?.href).toBe(socialRegistry.twitter.url);
    expect(emailLink?.href).toBe(socialRegistry.email.url);
  });

  it("ensures contactData consumes links and email from the centralized registry", () => {
    expect(contactData.email).toBe(socialRegistry.email.rawEmail);

    const gh = contactData.socialLinks.find((s) => s.icon === "github");
    const li = contactData.socialLinks.find((s) => s.icon === "linkedin");
    const tw = contactData.socialLinks.find((s) => s.icon === "twitter");

    expect(gh?.url).toBe(socialRegistry.github.url);
    expect(li?.url).toBe(socialRegistry.linkedin.url);
    expect(tw?.url).toBe(socialRegistry.twitter.url);
  });

  it("guarantees no stale placeholder (lalitsinghbisht) exists in navData or contactData", () => {
    const navString = JSON.stringify(navData);
    const contactString = JSON.stringify(contactData);
    const socialString = JSON.stringify(socialRegistry);

    expect(navString).not.toContain("lalitsinghbisht");
    expect(contactString).not.toContain("lalitsinghbisht");
    expect(socialString).not.toContain("lalitsinghbisht");
  });
});
