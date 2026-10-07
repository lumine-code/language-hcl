describe("OpenTofu grammar selection", () => {
  beforeEach(async () => {
    await lumine.packages.activatePackage("language-hcl");
  });

  it("selects the Terraform dialect for .tofu source files", () => {
    expect(lumine.grammars.selectGrammar("main.tofu", "").scopeName).toBe("source.terraform");
  });
});
