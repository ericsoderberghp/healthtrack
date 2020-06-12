export default {
  global: {
    active: {
      background: 'active-background',
    },
    colors: {
      'active-background': {
        dark: '#FFFFFF28',
        light: '#11111128',
      },
      background: {
        light: '#fff',
        dark: '#1e1f26',
      },
      'background-contrast': {
        dark: '#FFFFFF08',
        light: '#11111108',
      },
      blue: {
        light: '#d0e1f9',
        dark: '#283655',
      },
      'blue!': '#4d648d',
      brand: 'blue',
      control: 'blue!',
      selected: 'blue!',
      'graph-0': 'blue!',
    },
    font: {
      family: '"Lato"',
      face:
        "/* latin */\r\n@font-face {\r\n  font-family: 'Lato';\r\n  font-style: normal;\r\n  font-weight: 400;\r\n  src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v16/S6uyw4BMUTPHjx4wXiWtFCc.woff2) format('woff2');\r\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\r\n}\r\n/* latin */\r\n@font-face {\r\n  font-family: 'Lato';\r\n  font-style: normal;\r\n  font-weight: 900;\r\n  src: local('Lato Black'), local('Lato-Black'), url(https://fonts.gstatic.com/s/lato/v16/S6u9w4BMUTPHh50XSwiPGQ3q5d0.woff2) format('woff2');\r\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\r\n}",
    },
    hover: {
      background: {
        color: 'blue',
        opacity: 'medium',
      },
    },
  },
  button: {
    default: {
      padding: { horizontal: '15px', vertical: '9px' },
      border: {
        radius: '6px',
      },
      color: 'text',
      font: {
        weight: 800,
      },
    },
    primary: {
      padding: { horizontal: '15px', vertical: '9px' },
      background: { color: 'brand' },
      border: {
        radius: '6px',
      },
      font: {
        weight: 800,
      },
    },
    option: {
      padding: { horizontal: '15px', vertical: '9px' },
      border: undefined,
      font: { weight: 400 },
    },
    selected: {
      option: {
        background: 'selected-background',
        color: 'selected-text',
      },
    },
    active: {
      background: {
        color: 'active-background',
      },
      color: 'text',
      option: {
        background: {
          color: 'active-background',
        },
      },
    },
    hover: {
      default: {
        background: { color: 'blue!', opacity: 'strong' },
      },
      primary: {
        background: { color: 'blue!', opacity: 'strong' },
      },
    },
    border: undefined,
    size: undefined,
  },
  formField: {
    border: {
      side: 'start',
      position: 'outer',
    },
    margin: {
      bottom: 'medium',
    },
  },
  heading: {
    level: {
      1: {
        font: {
          weight: 800,
        },
      },
    },
  },
  list: {
    item: {
      pad: { horizontal: 'large', vertical: 'medium' },
    },
  },
  select: {
    options: undefined,
  },
};
