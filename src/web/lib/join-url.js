function joinUrl(...args) {
  return args.join('/')
    .replace(/([^:])\/([\/|#|\?])/g, (match, p1, p2) => `${p1}${p2}`)
    .replace(/\/*(#|\?)\/*/g, (match, p1) => p1);
}

module.exports = joinUrl;
