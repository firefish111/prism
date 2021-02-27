document.querySelectorAll("input[type=color]").forEach(el => {
  el.addEventListener("change", e => {
    document
      .querySelector(`ellipse#${e.target.id}-c`)
      .setAttribute("fill", e.target.value);
  }, false);
});

document
  .querySelector("input[type=number]")
  .addEventListener("change", e => {
    document
      .querySelector("ellipse#inner-c")
      .setAttribute("rx", 
        Math.floor(((((Math.round(Number(e.target.value) / 4) * 4) / 101) % 1) * 101).toString()));
  }, false);