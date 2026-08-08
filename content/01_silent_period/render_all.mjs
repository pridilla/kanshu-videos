import puppeteer from 'puppeteer-core';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const W=1080,H=1920,FPS=60;
const TOTAL_DURATION=60.57;
const TOTAL_FRAMES=Math.ceil(TOTAL_DURATION*FPS)+5;

const wordTimings=JSON.parse(readFileSync(join(__dirname,'word_timing.json'),'utf-8'));
const sentences=JSON.parse(readFileSync(join(__dirname,'sentence_timing.json'),'utf-8'));
const compactTimings=wordTimings.map(w=>[w.start,w.end,w.word]);
const compactSentences=sentences.map(s=>({start:s.start,end:s.end,word_indices:s.word_indices}));
console.log(`Loaded ${wordTimings.length} word timings, ${sentences.length} sentences. Frames: ${TOTAL_FRAMES} @ ${FPS}fps`);

const FRAMES_DIR=join(__dirname,'frames');
if(!existsSync(FRAMES_DIR))mkdirSync(FRAMES_DIR,{recursive:true});

async function renderAll(){
  const browser=await puppeteer.launch({
    executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless:'new',
    args:['--no-sandbox','--disable-gpu',`--window-size=${W},${H}`,'--force-device-scale-factor=1'],
  });
  const page=await browser.newPage();
  await page.setViewport({width:W,height:H,deviceScaleFactor:1});
  await page.goto('file://'+join(__dirname,'reel.html'),{waitUntil:'networkidle0'});
  await new Promise(r=>setTimeout(r,500));
  
  await page.evaluate((data, sentData)=>{
    window.__WORD_TIMINGS=data.map(d=>({start:d[0],end:d[1],word:d[2]}));
    window.__SENTENCES=sentData;
    window.__renderReady=true;
  },compactTimings,compactSentences);
  
  const cdp=await page.target().createCDPSession();
  const startTime=Date.now();
  let lastLog=0;
  
  for(let f=0;f<TOTAL_FRAMES;f++){
    const t=f/FPS;
    await cdp.send('Runtime.evaluate',{
      expression:`window.__drawFrame(${t});`,
      awaitPromise:false,timeout:1000,
    });
    const result=await cdp.send('Page.captureScreenshot',{
      format:'jpeg',quality:92,captureBeyondViewport:false,
    });
    const buf=Buffer.from(result.data,'base64');
    writeFileSync(join(FRAMES_DIR,`frame_${String(f).padStart(6,'0')}.jpg`),buf);
    
    const elapsed=(Date.now()-startTime)/1000;
    if(elapsed-lastLog>5||f===0||f===TOTAL_FRAMES-1){
      const pct=((f/TOTAL_FRAMES)*100).toFixed(1);
      const rate=elapsed>0?f/elapsed:0;
      const eta=rate>0?(TOTAL_FRAMES-f)/rate:0;
      console.log(`  ${pct}% (${f}/${TOTAL_FRAMES}) @ ${rate.toFixed(1)}fps, ETA ${eta.toFixed(0)}s`);
      lastLog=elapsed;
    }
  }
  const totalTime=((Date.now()-startTime)/1000).toFixed(1);
  console.log(`\nDone! ${TOTAL_FRAMES} frames in ${totalTime}s (${(TOTAL_FRAMES/totalTime).toFixed(1)}fps)`);
  await cdp.detach();await browser.close();
  console.log(`\nffmpeg -y -framerate ${FPS} -i ${FRAMES_DIR}/frame_%06d.jpg -c:v libx264 -pix_fmt yuv420p -preset fast -crf 18 ${join(__dirname,'scene_raw.mp4')}`);
}
renderAll().catch(err=>{console.error('Fatal:',err.message);process.exit(1);});
