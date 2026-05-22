export function showTourMessage(msg: string | string[]): Promise<null> {
  return new Promise((resolve) => {
    let banner = document.createElement("div");
    banner.classList.add("test-banner");
    if (typeof msg === "string") {
      banner.textContent = msg;
    } else {
      for (let m of msg) {
        let line = document.createElement("div");
        line.textContent = m;
        banner.appendChild(line);
      }
    }
    document.body.appendChild(banner);
    setTimeout(() => {
      banner.remove();
      resolve(null);
    }, 1000);
  });
}
