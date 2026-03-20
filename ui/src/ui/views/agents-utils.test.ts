import { describe, expect, it } from "vitest";
import {
  normalizeModelIdForSelection,
  resolveConfiguredCronModelSuggestions,
  resolveEffectiveModelFallbacks,
  sortLocaleStrings,
} from "./agents-utils.ts";

describe("normalizeModelIdForSelection", () => {
  it("returns model as-is when it already has a provider prefix", () => {
    const configuredModels = {
      "bailian/glm-5": {},
      "minimax-portal/MiniMax-M2.5": {},
    };
    expect(normalizeModelIdForSelection("bailian/glm-5", configuredModels)).toBe("bailian/glm-5");
    expect(normalizeModelIdForSelection("minimax-portal/MiniMax-M2.5", configuredModels)).toBe(
      "minimax-portal/MiniMax-M2.5",
    );
  });

  it("resolves bare model ID to full model ID when configured", () => {
    const configuredModels = {
      "bailian/glm-5": {},
      "minimax-portal/MiniMax-M2.5": {},
    };
    // When user selects "glm-5" from dropdown, it should resolve to "bailian/glm-5"
    expect(normalizeModelIdForSelection("glm-5", configuredModels)).toBe("bailian/glm-5");
    expect(normalizeModelIdForSelection("MiniMax-M2.5", configuredModels)).toBe(
      "minimax-portal/MiniMax-M2.5",
    );
  });

  it("returns bare model ID when not found in configured models", () => {
    const configuredModels = {
      "minimax-portal/MiniMax-M2.5": {},
    };
    // "glm-5" is not in the configured models, so return as-is
    expect(normalizeModelIdForSelection("glm-5", configuredModels)).toBe("glm-5");
  });

  it("returns null for empty model ID", () => {
    expect(normalizeModelIdForSelection("", {})).toBeNull();
    expect(normalizeModelIdForSelection("   ", {})).toBeNull();
  });

  it("handles undefined configured models", () => {
    expect(normalizeModelIdForSelection("glm-5", undefined)).toBe("glm-5");
    expect(normalizeModelIdForSelection("bailian/glm-5", undefined)).toBe("bailian/glm-5");
  });
});

describe("resolveEffectiveModelFallbacks", () => {
  it("inherits defaults when no entry fallbacks are configured", () => {
    const entryModel = undefined;
    const defaultModel = {
      primary: "openai/gpt-5-nano",
      fallbacks: ["google/gemini-2.0-flash"],
    };

    expect(resolveEffectiveModelFallbacks(entryModel, defaultModel)).toEqual([
      "google/gemini-2.0-flash",
    ]);
  });

  it("prefers entry fallbacks over defaults", () => {
    const entryModel = {
      primary: "openai/gpt-5-mini",
      fallbacks: ["openai/gpt-5-nano"],
    };
    const defaultModel = {
      primary: "openai/gpt-5",
      fallbacks: ["google/gemini-2.0-flash"],
    };

    expect(resolveEffectiveModelFallbacks(entryModel, defaultModel)).toEqual(["openai/gpt-5-nano"]);
  });

  it("keeps explicit empty entry fallback lists", () => {
    const entryModel = {
      primary: "openai/gpt-5-mini",
      fallbacks: [],
    };
    const defaultModel = {
      primary: "openai/gpt-5",
      fallbacks: ["google/gemini-2.0-flash"],
    };

    expect(resolveEffectiveModelFallbacks(entryModel, defaultModel)).toEqual([]);
  });
});

describe("resolveConfiguredCronModelSuggestions", () => {
  it("collects defaults primary/fallbacks, alias map keys, and per-agent model entries", () => {
    const result = resolveConfiguredCronModelSuggestions({
      agents: {
        defaults: {
          model: {
            primary: "openai/gpt-5.2",
            fallbacks: ["google/gemini-2.5-pro", "openai/gpt-5.2-mini"],
          },
          models: {
            "anthropic/claude-sonnet-4-5": { alias: "smart" },
            "openai/gpt-5.2": { alias: "main" },
          },
        },
        list: {
          writer: {
            model: { primary: "xai/grok-4", fallbacks: ["openai/gpt-5.2-mini"] },
          },
          planner: {
            model: "google/gemini-2.5-flash",
          },
        },
      },
    });

    expect(result).toEqual([
      "anthropic/claude-sonnet-4-5",
      "google/gemini-2.5-flash",
      "google/gemini-2.5-pro",
      "openai/gpt-5.2",
      "openai/gpt-5.2-mini",
      "xai/grok-4",
    ]);
  });

  it("returns empty array for invalid or missing config shape", () => {
    expect(resolveConfiguredCronModelSuggestions(null)).toEqual([]);
    expect(resolveConfiguredCronModelSuggestions({})).toEqual([]);
    expect(resolveConfiguredCronModelSuggestions({ agents: { defaults: { model: "" } } })).toEqual(
      [],
    );
  });
});

describe("sortLocaleStrings", () => {
  it("sorts values using localeCompare without relying on Array.prototype.toSorted", () => {
    expect(sortLocaleStrings(["z", "b", "a"])).toEqual(["a", "b", "z"]);
  });

  it("accepts any iterable input, including sets", () => {
    expect(sortLocaleStrings(new Set(["beta", "alpha"]))).toEqual(["alpha", "beta"]);
  });
});
