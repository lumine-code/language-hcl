const fs = require("fs");
const path = require("path");
const { Point } = require("lumine");

const VARIANTS = [
  {
    name: "HCL",
    scopeName: "source.hcl",
    suffix: "hcl",
    query: "hcl-highlights.scm",
  },
  {
    name: "Terraform",
    scopeName: "source.terraform",
    suffix: "terraform",
    query: "terraform-hcl-highlights.scm",
  },
];

describe("HCL Tree-sitter highlights", () => {
  let editor;
  let languageMode;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-hcl");
  });

  afterEach(() => editor?.destroy());

  async function setUp(variant, text) {
    editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName(variant.scopeName));
    editor.setText(text);
    languageMode = editor.getBuffer().languageMode;
    await languageMode.ready;
  }

  function indexOfOccurrence(needle, occurrence = 0) {
    const text = editor.getText();
    let index = -1;
    for (let count = 0; count <= occurrence; count++) {
      index = text.indexOf(needle, index + 1);
    }
    expect(index).not.toBe(-1);
    return index;
  }

  function scopesIn(needle, offset = 0, occurrence = 0) {
    const index = indexOfOccurrence(needle, occurrence) + offset;
    const point = editor.getBuffer().positionForCharacterIndex(index);
    return editor.scopeDescriptorForBufferPosition(point).getScopesArray();
  }

  function rawCaptures(startRow, endRow) {
    const layer = languageMode.rootLanguageLayer;
    const options =
      startRow == null
        ? undefined
        : {
            startPosition: new Point(startRow, 0),
            endPosition: new Point(endRow, 0),
          };
    return layer.queries.highlightsQuery.captures(layer.tree.rootNode, options);
  }

  for (const variant of VARIANTS) {
    describe(variant.name, () => {
      it("preserves block kinds, identifier labels, quoted labels, and attribute scopes", async () => {
        await setUp(
          variant,
          [
            "service root {",
            '  name = "outer"',
            "  nested child {",
            "    value = var.region",
            "  }",
            "}",
            'job "quoted" {}',
          ].join("\r\n"),
        );

        const keywordScope = `keyword.control.${variant.suffix}`;
        const supportScope = `support.type.${variant.suffix}`;

        expect(scopesIn("service")).toContain(keywordScope);
        expect(scopesIn("root")).toContain(keywordScope);
        expect(scopesIn("service")).not.toContain(supportScope);
        expect(scopesIn("root")).not.toContain(supportScope);
        expect(scopesIn("nested")).toContain(keywordScope);
        expect(scopesIn("nested")).toContain(supportScope);
        expect(scopesIn("child")).toContain(keywordScope);
        expect(scopesIn("child")).toContain(supportScope);
        expect(scopesIn("value")).toContain(`variable.other.member.${variant.suffix}`);
        expect(scopesIn("value")).not.toContain(supportScope);
        expect(scopesIn('"quoted"', 1)).toContain(`string.quoted.double.${variant.suffix}`);
        expect(scopesIn('"quoted"', 1)).not.toContain(keywordScope);
      });

      it("returns nested block-label captures when the outer block starts before the viewport", async () => {
        await setUp(
          variant,
          [
            "service root {",
            '  name = "outer"',
            "  enabled = true",
            "  nested child {",
            "    value = var.region",
            "  }",
            "}",
          ].join("\n"),
        );

        const captures = rawCaptures(3, 4).filter(
          (capture) =>
            capture.name === `keyword.control.${variant.suffix}` ||
            capture.name === `support.type.${variant.suffix}`,
        );
        expect(captures.every((capture) => capture.node.startPosition.row === 3)).toBe(true);
        expect(captures.map((capture) => `${capture.name}:${capture.node.text}`).sort()).toEqual(
          [
            `keyword.control.${variant.suffix}:child`,
            `keyword.control.${variant.suffix}:nested`,
            `support.type.${variant.suffix}:child`,
            `support.type.${variant.suffix}:nested`,
          ].sort(),
        );
      });

      it("keeps tile captures bounded and local inside a large block parent", async () => {
        const lines = ["service root {"];
        for (let index = 0; index < 6000; index++) lines.push(`  value_${index} = var.item`);
        lines.push("}");
        await setUp(variant, lines.join("\r\n"));

        const captures = rawCaptures(3000, 3006);
        expect(captures.length).toBeLessThanOrEqual(variant.suffix === "hcl" ? 90 : 100);
        expect(
          captures.every(
            (capture) =>
              capture.node.startPosition.row >= 3000 && capture.node.startPosition.row < 3006,
          ),
        ).toBe(true);
      });
    });
  }

  it("keeps unbounded block contexts leaf-rooted in both base queries", () => {
    for (const variant of VARIANTS) {
      const query = fs.readFileSync(path.join(__dirname, "..", "grammars", variant.query), "utf8");
      expect(query).toContain(
        `((identifier) @keyword.control.${variant.suffix}\n  (#is? test.childOfType block))`,
      );
      expect(query).toContain(
        `((identifier) @support.type.${variant.suffix}\n  (#is? test.childOfType block)\n  (#is? test.typeAt "parent.parent.parent block"))`,
      );
    }
  });
});
