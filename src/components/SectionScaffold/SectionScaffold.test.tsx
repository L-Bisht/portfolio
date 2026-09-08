import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import SectionScaffold from "./SectionScaffold";

describe("SectionScaffold", () => {
  it("renders a <section> wrapping an inner max-w-6xl container with responsive gutters", () => {
    const html = renderToString(
      <SectionScaffold id="test-section" eyebrow="Test" headline="Hello World" />
    );

    // Must emit a <section> element with the given id
    expect(html).toContain('id="test-section"');

    // Inner container must carry the constraint and gutter classes
    expect(html).toContain("max-w-6xl");
    expect(html).toContain("mx-auto");
    // Responsive gutters
    expect(html).toContain("px-4");
    expect(html).toContain("sm:px-8");
    expect(html).toContain("lg:px-12");
  });

  it("renders the eyebrow badge with a leading accent hairline", () => {
    const html = renderToString(
      <SectionScaffold
        id="eyebrow-test"
        eyebrow="Projects"
        headline="My Work"
      />
    );

    // Eyebrow text must be present
    expect(html).toContain("Projects");

    // Leading hairline element (h-px span used as the accent line)
    expect(html).toContain("h-px");

    // Eyebrow container must have the semantic id
    expect(html).toContain('id="eyebrow-test-eyebrow"');
  });

  it("renders the headline with descender-compensation mask classes on every word", () => {
    const html = renderToString(
      <SectionScaffold
        id="headline-test"
        eyebrow="Section"
        headline="Across Multiple Words"
      />
    );

    // All three mask classes must appear (one per word at minimum)
    expect(html).toContain("overflow-hidden");
    expect(html).toContain("inline-block");
    // Descender compensation: bottom padding + negative margin + top padding + negative margin
    expect(html).toContain("pb-3");
    expect(html).toContain("-mb-3");
    expect(html).toContain("pt-1");
    expect(html).toContain("-mt-1");
  });

  it("renders an optional subtitle when provided", () => {
    const html = renderToString(
      <SectionScaffold
        id="subtitle-test"
        eyebrow="Subtitle"
        headline="Big Heading"
        subtitle="This is a subtitle paragraph."
      />
    );

    expect(html).toContain("This is a subtitle paragraph.");
  });

  it("does NOT render a subtitle element when subtitle prop is omitted", () => {
    const html = renderToString(
      <SectionScaffold
        id="no-subtitle-test"
        eyebrow="Section"
        headline="No Sub"
      />
    );

    // The data-testid is only present when subtitle is rendered
    expect(html).not.toContain('data-testid="scaffold-subtitle"');
  });

  it("renders children inside the scaffold", () => {
    const html = renderToString(
      <SectionScaffold id="children-test" eyebrow="Children" headline="With Kids">
        <div id="inner-child">child content</div>
      </SectionScaffold>
    );

    expect(html).toContain('id="inner-child"');
    expect(html).toContain("child content");
  });

  it("applies the gradient accent keyword class when accentWord is provided", () => {
    const html = renderToString(
      <SectionScaffold
        id="accent-test"
        eyebrow="Accent"
        headline="Hello World"
        accentWord="World"
      />
    );

    // The accentWord span must carry the gradient wrapper class
    expect(html).toContain('data-accent="true"');
  });
});
