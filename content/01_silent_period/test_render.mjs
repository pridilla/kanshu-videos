import puppeteer from 'puppeteer-core';
import { writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname=dirname(fileURLToPath(import.meta.url));
const W=1080,H=1920,FPS=60;

const wordTimings=JSON.parse(readFileSync(join(__dirname,'word_timing.json'),'utf-8'));
const sentences=JSON.parse(readFileSync(join(__dirname,'sentence_timing.json'),'utf-8'));
const compactTimings=wordTimings.map(w=>[w.start,w.end,w.word]);
const compactSentences=sentences.map(s=>({start:s.start,end:s.end,word_indices:s.word_indices}));

async function test(){
  const browser=await puppeteer.launch({
    executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless:'new',
    args:['--no-sandbox','--disable-gpu',`--window-size=${W},${H}`,'--force-device-scale-factor=1'],
  });
  const page=await browser.newPage();
  await page.setViewport({width:W,height:H,deviceScaleFactor:1});
  await page.goto('file://'+join(__dirname,'reel.html'),{waitUntil:'networkidle0'});
  await new Promise(r=>setTimeout(r,500));
  
  await page.evaluate((data,sentData)=>{
    window.__WORD_TIMINGS=data.map(d=>({start:d[0],end:d[1],word:d[2]}));
    window.__SENTENCES=sentData;
    window.__renderReady=true;
  },compactTimings,compactSentences);
  
  const cdp=await page.target().createCDPSession();
  const timestamps=[0.5,2,4,8,15,25,35,42,50,56,60];
  
  for(const t of timestamps){
    await cdp.send('Runtime.evaluate',{
      expression:`window.__drawFrame(${t});`,
      awaitPromise:false,timeout:1000,
    });
    const result=await cdp.send('Page.captureScreenshot',{
      format:'jpeg',quality:92,captureBeyondViewport:false,
    });
    const buf=Buffer.from(result.data,'base64');
    writeFileSync(join(__dirname,`test_${String(Math.round(t*100)).padStart(4,'0')}.jpg`),buf);
  }
  
  // Analyze with CDP
  for(const t of timestamps){
    const pixels=await cdp.send('Runtime.evaluate',{
      expression:`(function(){
        var d=document.getElementById('c').getContext('2d').getImageData(0,0,1080,1920);
        var maxR=0,maxG=0,cor=0,wht=0;
        for(var i=0;i<d.data.length;i+=4){
          if(d.data[i]>maxR)maxR=d.data[i];
          if(d.data[i+1]>maxG)maxG=d.data[i+1];
          if(d.data[i]>200&&d.data[i+1]<130)cor++;
          if(d.data[i]>200&&d.data[i+1]>200&&d.data[i+2]>200)wht++;
        }
        return {maxR:maxR,maxG:maxG,coral:cor,white:wht};
      })()`,
      returnByValue:true,
    });
    console.log(`  t=${t.toFixed(1)}s: maxRGB=(${pixels.result.value.maxR},${pixels.result.value.maxG}), coral=${pixels.result.value.coral}, white=${pixels.result.value.white}`);
  }
  
  await cdp.detach();await browser.close();
  console.log('Test complete!');
}
test().catch(err=>{console.error(err.message);process.exit(1);});
