describe("hcl editing settings", () => {
  let editor, pairingWasActive;
  beforeAll(() => {
    pairingWasActive = lumine.packages.isPackageActive("bracket-matcher");
  });
  afterAll(async () => {
    if (!pairingWasActive) await lumine.packages.deactivatePackage("bracket-matcher");
  });
  beforeEach(async () => {
    jasmine.useRealClock();
    editor = null;
    await lumine.packages.activatePackage("language-hcl");
    await lumine.packages.activatePackage("bracket-matcher");
  });
  afterEach(() => editor?.destroy());
  async function start(scope, text = "value") {
    editor ??= await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName(scope));
    editor.setText(text);
    expect(await editor.whenGrammarSettled()).toBe(true);
    editor.update({ autoIndent: false });
  }
  for (const [scope, line, block] of [
    ["source.hcl", "#", ["/*", "*/"]],
    ["source.terraform", "#", ["/*", "*/"]],
  ]) {
    it("exposes line and block comment metadata in " + scope, async () => {
      await start(scope);
      expect(await editor.getCommentDelimitersForBufferPosition([0, 0])).toEqual({ line, block });
      await editor.toggleLineCommentsForBufferRows(0, 0);
      expect(editor.getText()).toBe(line + " value");
      await editor.toggleLineCommentsForBufferRows(0, 0);
      expect(editor.getText()).toBe("value");
    });
    it("round trips block comments using the advertised delimiters in " + scope, async () => {
      await start(scope);
      const { block } = await editor.getCommentDelimitersForBufferPosition([0, 0]);
      const options = {
        commentStrings: { commentStartString: block[0], commentEndString: block[1] },
      };
      await editor.toggleLineCommentsForBufferRows(0, 0, options);
      expect(editor.getText()).toBe(block[0] + " value " + block[1]);
      await editor.toggleLineCommentsForBufferRows(0, 0, options);
      expect(editor.getText()).toBe("value");
    });
  }
  it("pairs valid punctuation without duplicating unsupported quote or escape characters", async () => {
    for (const [scope, character, expected] of [
      ["source.hcl", "'", "'"],
      ["source.terraform", "'", "'"],
      ["source.hcl", '"', '""'],
      ["source.terraform", '"', '""'],
    ]) {
      await start(scope, "");
      await editor.insertText(character, { autoIndent: false, autoDecreaseIndent: false });
      await editor.whenGrammarSettled();
      expect(editor.getText())
        .withContext(scope + " " + character)
        .toBe(expected);
    }
  });
  it("keeps language identifier characters inside word selection", async () => {
    for (const [scope, text, column, expected] of [
      ["source.hcl", "local.foo-bar", 8, "foo-bar"],
      ["source.terraform", "var.foo-bar", 6, "foo-bar"],
    ]) {
      await start(scope, text);
      editor.setCursorBufferPosition([0, column]);
      expect(editor.getWordUnderCursor())
        .withContext(scope + " " + text)
        .toBe(expected);
    }
  });
});
