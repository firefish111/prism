document.querySelectorAll("input").forEach(el => {
  el.addEventListener("change", e => {
    document
      .querySelector(`ellipse#${e.target.id}-c`)
      .setAttribute("fill", e.target.value);
  }, false);
});
    