const sock = io();

let md = CodeMirror.fromTextArea(document.querySelector("textarea.CodeMirror"), {
  lineNumbers: true,
  tabSize: 2,
  mode: "markdown",
  theme: "monokai",
  extraKeys: {
    Tab: cm => {
      /* courtesy of

      https://github.com/codemirror/CodeMirror/issues/988#issuecomment-14921785 */
      if (cm.somethingSelected()) {
        cm.indentSelection("add");
      } else {
        cm.replaceSelection(
          cm.getOption("indentWithTabs") ? "\t" :
          Array(cm.getOption("indentUnit") + 1).join(" "), "end", "+input");
      }
    }
  },
  value: "Type some Markdown here!"
});


document.querySelector("button#post").addEventListener("onclick", e => {
  sock.emit("post", document.querySelector("input#title").value, md.getValue(), #{name});
});