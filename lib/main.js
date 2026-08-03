exports.activate = function () {};

exports.consumeHyperlinkInjection = (hyperlink) => {
  hyperlink.addInjectionPoint("source.hcl", {
    types: ["comment"],
  });
};

exports.consumeTodoInjection = (todo) => {
  todo.addInjectionPoint("source.hcl", {
    types: ["comment"],
  });
};
