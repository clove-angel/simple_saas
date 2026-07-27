import puppeteer, { Browser, type LaunchOptions } from 'puppeteer';

const LOCAL_CHROME_PATH =
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  'C:\\Users\\Administrator\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';

export async function launchBrowser(options?: LaunchOptions): Promise<Browser> {
  return puppeteer.launch({
    executablePath: LOCAL_CHROME_PATH,
    headless: true,
    ...options,
  });
}
