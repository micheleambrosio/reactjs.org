import core from 'puppeteer';
let _page;
import chrome from 'chrome-aws-lambda';
const exePath =
  process.platform === 'win32'
    ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    : process.platform === 'linux'
    ? '/usr/bin/google-chrome'
    : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const getCss = () => {
  return `          @font-face {
    font-family: 'Source Code Pro';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url('/fonts/Source-Code-Pro-Regular.woff2') format('woff2');
  }
  @font-face {
    font-family: 'Optimistic Display';
    src: url('https://conf.reactjs.org/fonts/Optimistic_Display_W_Lt.woff2')
      format('woff2');
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Optimistic Display';
    src: url('https://conf.reactjs.org/fonts/Optimistic_Display_W_Md.woff2')
      format('woff2');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Optimistic Display';
    src: url('https://conf.reactjs.org/fonts/Optimistic_Display_W_Bd.woff2')
      format('woff2');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }
      * {
        margin: 0;
        padding: 0;
      }
      .background-wrapper {
        display: flex;
        justify-content: start;
        position: relative;
        width: 100%;
        height: 100%;
      }
      .og-image-wrapper {
        width: 800px;
        height: 400;
        color: rgb(35, 39, 47);
        overflow: hidden;
        background-color: #f3f4f6;
        font-family: Optimistic Display,-apple-system,ui-sans-serif,system-ui,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .content-wrapper { 
        padding: 40px 40px 0px;
      }
      .sections {
        font-weight: 800;
        padding: 20px 0px;
        color: rgb(8, 126, 164);
      }
      .page-title { 
        padding: 20px 0px;
      }
      .description {
        font-size: 20px;
      }
      .logo-container {
        display: flex;
        padding: 70px 0px 50px;
      }
      .logo {
        color: rgb(8, 126, 164);
        height: 60px;
        width: 60px;
      }
      .logo-text {
        font-size: 40px;
        padding-left: 10px;
      }`;
};

const getHTML = (title, description) => `
    <style>
${getCss()}
    </style>
    <div class="og-image-wrapper">
    <div class="background-wrapper">
   <div class="content-wrapper"> 
      <div class="sections">LEARN REACT</div>
      <h1 class="page-title">${title}</h1>
      <div class="description">${description}</div>
      <div class="logo-container"> 
          <svg class="logo"  width="100%" height="100%" viewBox="0 0 410 369" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-link dark:text-link-dark w-20 sm:w-28 mr-4 mb-4 sm:mb-0 h-auto"><path d="M204.995 224.552C226.56 224.552 244.042 207.07 244.042 185.506C244.042 163.941 226.56 146.459 204.995 146.459C183.43 146.459 165.948 163.941 165.948 185.506C165.948 207.07 183.43 224.552 204.995 224.552Z" fill="currentColor"></path><path d="M409.99 184.505C409.99 153.707 381.437 126.667 335.996 108.925C343.342 60.6535 334.19 22.3878 307.492 6.98883C283.649 -6.77511 250.631 -0.0395641 214.512 25.9753C211.316 28.2692 208.143 30.7097 204.97 33.2477C201.822 30.7097 198.65 28.2692 195.477 25.9753C159.359 -0.0395641 126.34 -6.79951 102.497 6.98883C75.8237 22.3878 66.6721 60.6291 74.0422 108.852C28.5529 126.618 0 153.682 0 184.505C0 215.303 28.5528 242.342 73.9934 260.084C66.6477 308.356 75.7993 346.621 102.497 362.02C110.575 366.682 119.727 369 129.684 369C149.085 369 171.61 360.215 195.477 343.034C198.674 340.74 201.847 338.3 205.019 335.762C208.167 338.3 211.34 340.74 214.512 343.034C238.38 360.239 260.905 369 280.306 369C290.263 369 299.415 366.682 307.492 362.02C331.335 348.256 342 316.287 337.534 271.993C337.143 268.089 336.631 264.135 335.996 260.109C381.461 242.367 409.99 215.327 409.99 184.505ZM225.934 41.8136C246.238 27.1955 265.127 19.5814 280.306 19.5814C286.871 19.5814 292.728 20.9968 297.731 23.8765C315.204 33.9798 322.672 62.9475 317.327 102.433C299.756 97.0401 280.306 92.9158 259.392 90.2802C246.872 73.8074 233.597 58.9453 220.003 46.2551C221.98 44.7421 223.957 43.229 225.934 41.8136ZM112.259 23.8765C117.262 20.9968 123.119 19.5814 129.684 19.5814C144.863 19.5814 163.752 27.1711 184.056 41.8136C186.033 43.229 188.01 44.7176 189.986 46.2551C176.393 58.9453 163.142 73.783 150.622 90.2558C129.732 92.8914 110.258 97.0401 92.687 102.409C87.3424 62.9475 94.7857 33.9798 112.259 23.8765ZM19.5233 184.505C19.5233 164.322 40.9014 143.359 77.776 128.253C81.9003 146.141 88.0502 165.054 96.1768 184.456C88.0014 203.881 81.8515 222.819 77.7272 240.732C40.9014 225.626 19.5233 204.687 19.5233 184.505ZM184.056 327.196C154.966 348.134 128.805 354.675 112.259 345.133C94.7857 335.029 87.3181 306.062 92.6626 266.576C110.234 271.969 129.684 276.093 150.598 278.729C163.117 295.202 176.393 310.064 189.986 322.754C188.01 324.292 186.033 325.78 184.056 327.196ZM204.995 310.04C180.591 287.685 157.138 257.815 137.347 223.551C132.051 214.4 121.344 191.396 117 182.489C113.535 190.786 110.112 198.398 107.427 206.5C109.623 210.575 118.092 229.213 120.434 233.288C125.071 241.317 129.928 249.127 134.931 256.692C120.898 254.227 107.915 251.055 96.1035 247.321C102.815 217.011 116.213 182.064 137.347 145.458C142.545 136.453 153.838 116.346 159.5 108C150.568 109.147 143.395 108.767 135 110.5C132.56 114.453 122.777 131.645 120.434 135.721C115.749 143.823 111.454 151.925 107.427 159.978C102.546 146.581 98.8124 133.744 96.1524 121.64C125.755 112.293 162.727 106.411 204.995 106.411C215.562 106.411 237.63 106.197 247.49 106.905C242.048 99.7544 237.38 93.2819 231.694 86.888C227.082 86.7416 209.705 86.888 204.995 86.888C195.672 86.888 186.545 87.2053 177.589 87.7422C186.472 77.1752 195.672 67.5111 204.995 58.9697C229.375 81.3239 252.851 111.195 272.643 145.458C277.841 154.463 289.073 175.426 293.49 184.505C296.98 176.207 300.281 168.64 302.99 160.489C300.793 156.389 291.898 139.747 289.555 135.696C284.918 127.667 280.062 119.858 275.059 112.317C289.092 114.782 302.075 117.954 313.886 121.688C307.175 151.998 293.777 186.945 272.643 223.551C267.445 232.556 252.651 253.178 246.99 261.524C255.922 260.377 265.595 258.663 273.99 256.93C276.43 252.976 287.212 237.364 289.555 233.288C294.216 225.235 298.512 217.182 302.489 209.153C307.224 222.185 310.982 234.997 313.715 247.394C284.138 256.741 247.214 262.598 204.995 262.598C194.428 262.598 169.859 261.208 160 260.5C165.442 267.65 171.304 275.095 176.99 281.489C181.602 281.635 200.285 282.121 204.995 282.121C214.317 282.121 223.444 281.804 232.401 281.267C223.493 291.834 214.317 301.498 204.995 310.04ZM297.731 345.133C281.185 354.699 254.999 348.159 225.934 327.196C223.957 325.78 221.98 324.292 220.003 322.754C233.597 310.064 246.848 295.226 259.367 278.753C280.233 276.118 299.659 271.993 317.205 266.625C317.547 269.089 317.888 271.554 318.132 273.97C321.72 309.649 314.277 335.566 297.731 345.133ZM332.262 240.756C328.065 222.599 321.842 203.686 313.813 184.578C321.988 165.152 328.138 146.215 332.262 128.302C369.088 143.408 390.466 164.322 390.466 184.505C390.466 204.687 369.113 225.626 332.262 240.756Z" fill="currentColor"></path></svg>
          <p class="logo-text">React Docs</p>
      </div>
   </div>
    </div>
  </div>`;

export async function getOptions(isDev) {
  let options;
  if (isDev) {
    options = {
      args: [],
      executablePath: exePath,
      headless: true,
    };
  } else {
    options = {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    };
  }
  return options;
}

async function getPage(isDev) {
  if (_page) {
    return _page;
  }
  const options = await getOptions(isDev);
  const browser = await core.launch(options);
  _page = await browser.newPage();
  return _page;
}

export async function getScreenshot(
  {title, description},
  type = 'png',
  isDev = false
) {
  const page = await getPage(isDev);
  await page.setViewport({width: 800, height: 400});
  await page.setContent(getHTML(title, description));
  const file = await page.screenshot({type});
  return file;
}

export default async function handler(req, res) {
  console.log(req.query);
  let file;
  res.setHeader('Content-Type', `image/png`);
  res.setHeader(
    'Cache-Control',
    `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
  );
  try {
    file = await getScreenshot(req.query, 'png', false);
  } catch (e) {
    res.status(500).json({error: e.message});
  }

  res.end(file);
  // res.status(200).json({name: 'john doe'});
}
