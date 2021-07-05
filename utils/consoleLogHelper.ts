export const Style = {
  base: [
    "color: #fff",
    "background-color: #444",
    "padding: 2px 4px",
    "border-radius: 2px",
  ],
  warning: ["color: #eee", "background-color: red"],
  success: ["background-color: green"],
};
export const log = (text, extra = []) => {
  let style = Style.base.join(";") + ";";
  style += extra.join(";"); // Add any additional styles
  console.log(`%c${text}`, style);
};
