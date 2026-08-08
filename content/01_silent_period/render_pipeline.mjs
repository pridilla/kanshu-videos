import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const W = 1080;
const H = 1920;
const FPS = 24;
const TOTAL_DURATION = 21.87;
const TOTAL_FRAMES = Math.ceil(TOTAL_DURATION * FPS) + 1;

async function main() {
  console.log(`Rendering ${TOTAL_FRAMES} frames at ${FPS}fps (${TOTAL_DURATION}s)`);

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-gpu',
      `--window-size=${W},${H}`,
      '--force-device-scale-factor=1',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });

  const htmlPath = join(__dirname, 'reel.html');
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' });

  // Wait for render ready using a simple polling approach
  for (let i = 0; i < 50; i++) {
    const ready = await page.evaluate(() => typeof window.__renderReady !== 'undefined' ? window.__renderReady : false);
    if (ready) break;
    await new Promise(r => setTimeout(r, 100));
  }
  console.log('Render ready');

  // TEST: render just 5 frames
  console.log('Testing 5 frames...');
  for (let frame = 0; frame < 5; frame++) {
    const time = frame / FPS;
    // Instead of returning base64 (which is huge), use a different approach
    // Set the time and take screenshot
    await page.evaluate((t) => {
      window._currentTime = t;
      window._renderScene(t);
    }, time);
    
    // Take screenshot
    const screenshot = await page.screenshot({ type: 'png', fullPage: false, omitBackground: true });
    writeFileSync(join(__dirname, `test_frame_${frame}.png`), screenshot);
    console.log(`  Test frame ${frame} done (t=${time.toFixed(2)})`);
  }
  
  console.log('Test successful! Now doing full render...');

  // Full render: use screenshot approach instead of canvas.toDataURL
  const outputPath = join(__dirname, 'scene_0_raw.mp4');
  const ffmpeg = spawn('ffmpeg', [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'png',
    '-r', String(FPS),
    '-i', 'pipe:0',
    '-an',
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '18',
    '-pix_fmt', 'yuv420p',
    outputPath,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });

  for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
    const time = frame / FPS;
    
    await page.evaluate((t) => {
      window._currentTime = t;
      window._renderScene(t);
    }, time);
    
    const screenshot = await page.screenshot({ 
      type: 'png', 
      fullPage: false, 
      omitBackground: true,
      captureBeyondViewport: false,
    });
    ffmpeg.stdin.write(screenshot);

    if (frame % 50 === 0) {
      console.log(`  Frame ${frame}/${TOTAL_FRAMES} (t=${time.toFixed(2)}s)`);
    }
  }

  ffmpeg.stdin.end();
  await new Promise((resolve) => ffmpeg.on('close', resolve));
  console.log(`\nDone! Output: ${outputPath}`);

  await browser.close();
}

main().catch(console.error);
