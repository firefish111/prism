let getSVG = code => {
  code = code.toLowerCase();
  let m = parseInt(code.slice(0, 2), 16);
  if ((m != 111) || (code[8] != "0")) throw "Invalid stone code."; 
  let c1 = code.slice(2, 8);
  let r = parseInt(code[9], 16)
  let c2 = code.slice(10);
  r *= 4; r += 40;
  return `<svg height="256" width="256" viewbox="0 0 512 512"><ellipse cx="256" cy="256" rx="256" fill="#${c1}"/><ellipse cx="256" cy="256" rx="${r}" fill="#${c2}"/></svg>`;
}

export { getSVG };