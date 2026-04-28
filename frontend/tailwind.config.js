/** @type {import('tailwindcss').Config} */

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/dashboard/**/*.{js,ts,jsx,tsx}",
    "./src/layout/**/*.{js,ts,jsx,tsx}",
    "./src/ui/**/*.{js,ts,jsx,tsx}",
    "./src/page-sections/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      textColor: {
        skin: {
          primary: withOpacity("--color-primary"),
          muted: withOpacity("--color-text-muted"),
          inverted: withOpacity("--color-text-inverted"),
        },
      },
      backgroundColor: {
        skin: {
          fill: withOpacity("--color-fill"),
          primary: withOpacity("--color-primary"),
          "button-accent": withOpacity("--color-button-accent"),
          "button-accent-hover": withOpacity("--color-button-accent-hover"),
          "button-muted": withOpacity("--color-button-muted"),
        },
      },
      gradientColorStops: {
        skin: {
          hue: withOpacity("--color-fill"),
        },
      },
      fontFamily: {
        naskh: ["Scheherazade New", "serif"],
        noto: ["Noto Naskh Arabic", "serif"],
        tajawal: ["Tajawal", "sans-serif"],
        amiri: ["Amiri", "sans-serif"],



        trado: ["trado"],
        tradbdo: ["tradbdo"],
        uthman: ["uthman"],
        uthmanb: ["uthman-bold"],
        cairo: ["cairo"],
        lalezar: ["lalezar"],
        hafs: ["UthmanicHafs_V22"],
        saudi: ["saudi"],
        saudi: ["saudi"],



        
        
        
       
        
        
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
