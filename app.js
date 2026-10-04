const $=id=>document.getElementById(id);
const ERAU_EMAIL_RE=/^[^\s@]+@(my\.)?erau\.edu$/i;
let activeCase=null,officialCaseNumber=null,quizMode="official",officialSubmitted=false,practiceAttempt=0,currentDisplayName="",isGuest=false;

function hash(text){let h=2166136261;for(const ch of text.trim().toLowerCase()){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function assignmentKey(email){return `idealgas-infinity:${email}`}
function completionKey(email){return `idealgas-infinity:complete:${email}`}
function assignCase(email){const key=assignmentKey(email);let n=Number(localStorage.getItem(key));if(!n||n<1||n>IDEALGAS_CASES.length){n=(hash(email)%IDEALGAS_CASES.length)+1;localStorage.setItem(key,String(n))}return IDEALGAS_CASES[n-1]}
async function api(payload){if(!IDEALGAS_QUIZ_API)return null;const response=await fetch(IDEALGAS_QUIZ_API,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload)});if(!response.ok)throw new Error("The assignment service is temporarily unavailable.");const data=await response.json();if(!data.ok)throw new Error(data.error||"The assignment service returned an error.");return data}

function normalizeEmail(raw){return String(raw||"").trim().toLowerCase()}
function isValidErauEmail(email){return ERAU_EMAIL_RE.test(email)}

function currentSectionValue(){const select=$('courseSection');if(!select)return "";if(select.value==="Other section")return $('otherSection').value.trim();return select.value}

function setupSectionToggle(){const select=$('courseSection'),wrap=$('otherSectionWrap'),other=$('otherSection');select.addEventListener('change',()=>{const isOther=select.value==="Other section";wrap.hidden=!isOther;other.required=isOther;if(!isOther){other.value="";other.setAttribute('aria-invalid','false');$('otherSectionError').textContent=""}$('sectionError').textContent="";select.setAttribute('aria-invalid','false')})}

function validateIdentityForm(){let valid=true;
  const firstName=$('firstName').value.trim();
  const lastName=$('lastName').value.trim();
  $('firstName').setAttribute('aria-invalid',firstName?'false':'true');
  $('lastName').setAttribute('aria-invalid',lastName?'false':'true');
  if(!firstName)valid=false;
  if(!lastName)valid=false;

  const email=normalizeEmail($('erauEmail').value);
  const emailError=$('emailError');
  if(!email||!isValidErauEmail(email)){
    emailError.textContent="Enter your ERAU email ending in @erau.edu or @my.erau.edu, or use guest access below.";
    $('erauEmail').setAttribute('aria-invalid','true');
    valid=false;
  } else {
    emailError.textContent="";
    $('erauEmail').setAttribute('aria-invalid','false');
  }

  const sectionSelect=$('courseSection');
  const sectionError=$('sectionError');
  if(!sectionSelect.value){
    sectionError.textContent="Select your course section.";
    sectionSelect.setAttribute('aria-invalid','true');
    valid=false;
  } else {
    sectionError.textContent="";
    sectionSelect.setAttribute('aria-invalid','false');
  }

  if(sectionSelect.value==="Other section"){
    const other=$('otherSection');
    const otherError=$('otherSectionError');
    if(!other.value.trim()){
      otherError.textContent="Enter your section.";
      other.setAttribute('aria-invalid','true');
      valid=false;
    } else {
      otherError.textContent="";
      other.setAttribute('aria-invalid','false');
    }
  }
  return valid;
}

function setMode(mode){quizMode=mode;const practice=mode==="practice";$('modeBadge').textContent=practice?"Practice mode":"Official assignment";$('modeBadge').classList.toggle('practice',practice);$('checkButton').textContent=practice?"Check practice case":"Submit official case"}

function resetResponses(){
  activeCase.find.forEach((_,i)=>{const input=$(`prop${i}`);if(input){input.value="";input.disabled=false}});
  $('results').hidden=true;
  $('methodHint').hidden=true;
  $('checkButton').disabled=false;
}

function renderCase(c,name,mode=quizMode){
  activeCase=c;setMode(mode);
  $('workspace').classList.remove('is-submitted');
  $('practicePanel').hidden=true;
  $('caseNumber').textContent=c.id;
  $('gas').textContent=c.gas;
  const tUnit=c.units==='english'?'R':'K';
  $('given').textContent=`T1 = ${c.T1} ${tUnit}, T2 = ${c.T2} ${tUnit}`;
  $('find').textContent=c.find.map(p=>p.symbol).join('; ');
  $('assignmentNote').textContent=mode==="official"
    ?`Assigned to ${name}. This is your protected official Case ${c.id}.`
    :isGuest
      ?`Guest practice for ${name}. Nothing is recorded.`
      :`Practice for ${name}. Case ${c.id} does not change your official Case ${officialCaseNumber}.`;
  $('propertyInputs').innerHTML=c.find.map((p,i)=>`<div class="property-field"><label for="prop${i}">${p.symbol}</label><div class="input-row"><input id="prop${i}" type="number" inputmode="decimal" step="any" aria-describedby="unit${i}"><span class="unit" id="unit${i}">${p.unit}</span></div></div>`).join('');
  resetResponses();
}

function showCompletedOfficial(name){officialSubmitted=true;setMode("official");$('workspace').classList.add('is-submitted');$('practicePanel').hidden=false;$('assignmentNote').textContent=`${name}'s official Case ${officialCaseNumber} has been submitted.`;$('results').hidden=true;$('practicePanel').scrollIntoView({behavior:'smooth',block:'center'})}
function practiceCase(kind){let next;if(kind==="next")next=(activeCase?.id||officialCaseNumber)%IDEALGAS_CASES.length+1;else{do{next=Math.floor(Math.random()*IDEALGAS_CASES.length)+1}while(next===activeCase?.id&&IDEALGAS_CASES.length>1)}practiceAttempt+=1;renderCase(IDEALGAS_CASES[next-1],currentDisplayName,"practice");$('workspace').scrollIntoView({behavior:'smooth'})}

setupSectionToggle();

$('identityForm').addEventListener('submit',async e=>{
  e.preventDefault();
  if(!validateIdentityForm()){
    const firstInvalid=document.querySelector('#identityForm [aria-invalid="true"]');
    if(firstInvalid)firstInvalid.focus();
    return;
  }
  isGuest=false;
  const firstName=$('firstName').value.trim();
  const lastName=$('lastName').value.trim();
  const email=normalizeEmail($('erauEmail').value);
  $('erauEmail').value=email;
  const section=currentSectionValue();
  const name=`${firstName} ${lastName}`.trim();
  currentDisplayName=name;
  const button=e.submitter;
  button.disabled=true;button.textContent="Retrieving…";
  try{
    const remote=await api({action:"assign",firstName,lastName,email,section});
    const c=remote?IDEALGAS_CASES[remote.caseNumber-1]:assignCase(email);
    officialCaseNumber=c.id;
    localStorage.setItem(assignmentKey(email),String(c.id));
    officialSubmitted=Boolean(remote?.officialSubmitted)||localStorage.getItem(completionKey(email))==="1";
    renderCase(c,name,"official");
    $('welcome').hidden=true;$('workspace').hidden=false;
    if(officialSubmitted)showCompletedOfficial(name);else $('workspace').scrollIntoView({behavior:'smooth'})
  }catch(error){alert(error.message)}
  finally{button.disabled=false;button.textContent="Assign my case"}
});
$('hintButton').addEventListener('click',()=>{
  const english=activeCase&&activeCase.units==='english';
  $('methodHint').textContent=english
    ? "Constant-specific-heat method: find Tavg = (T1+T2)/2 in °R, then CONVERT to °F (Tavg°F = Tavg°R − 459.67) before reading cp and cv from Table A-20E, which is tabulated against °F (interpolate between rows if Tavg°F isn't listed). Δh = cp·(T2−T1); Δu = cv·(T2−T1) — using T1, T2 in °R (or °F; the difference is the same size either way). Variable-specific-heat method: for air, read h and u directly from Table A-22E at T1 and T2 in °R; for other gases, read molar h̄ and ū from Table A-23E (also tabulated in °R) and divide by the molar mass M from Table A-1E. Either way, Δh = h2−h1 and Δu = u2−u1."
    : "Constant-specific-heat method: find Tavg = (T1+T2)/2, then read cp and cv for the gas from Table A-20 at Tavg (interpolate between rows if Tavg isn't listed). Δh = cp·(T2−T1); Δu = cv·(T2−T1). Variable-specific-heat method: for air, read h and u directly from Table A-22 at T1 and T2; for other gases, read molar h̄ and ū from Table A-23 and divide by the molar mass M from Table A-1. Either way, Δh = h2−h1 and Δu = u2−u1.";
  $('methodHint').hidden=false;
});
$('checkButton').addEventListener('click',async()=>{
  if(!activeCase)return;
  const checks=activeCase.find.map((p,i)=>{const raw=$(`prop${i}`).value;const entered=raw===""?NaN:Number(raw);const tol=Math.max(Math.abs(p.value)*p.tolerancePercent/100,0.00001);return {p,entered,ok:Number.isFinite(entered)&&Math.abs(entered-p.value)<=tol}});
  const all=checks.every(x=>x.ok);
  const r=$('results');
  r.className=`results${all?' success':''}`;
  r.innerHTML=`<h2>${all?'Energy changes verified':'Review your work'}</h2><ul class="result-list">${checks.map(x=>`<li class="${x.ok?'correct':'incorrect'}">${x.p.symbol}: ${x.ok?'within the accepted table range':'check the table value, interpolation, and units'}</li>`).join('')}</ul>${all?`<p><strong>${quizMode==="official"?'Official case complete.':'Practice case complete.'}</strong></p>`:'<p>Revise only the marked items, then check again.</p>'}`;
  r.hidden=false;
  r.scrollIntoView({behavior:'smooth',block:'nearest'});
  if(!isGuest){ // guest attempts are never recorded, even once a backend is configured
    const email=normalizeEmail($('erauEmail').value);
    const payload={action:"submit",mode:quizMode,firstName:$('firstName').value.trim(),lastName:$('lastName').value.trim(),email,section:currentSectionValue(),caseNumber:activeCase.id,attemptNumber:quizMode==="practice"?practiceAttempt:1,answers:checks.map(x=>({symbol:x.p.symbol,value:Number.isFinite(x.entered)?x.entered:null,correct:x.ok})),complete:all};
    try{await api(payload)}catch(error){r.insertAdjacentHTML('beforeend',`<p class="incorrect">Your work was checked, but it was not recorded. ${error.message}</p>`);return}
    if(all&&quizMode==="official"){localStorage.setItem(completionKey(payload.email),"1");setTimeout(()=>showCompletedOfficial(currentDisplayName),550)}
  }
  if(all&&quizMode==="practice"){$('practicePanel').hidden=false;$('practicePanel').querySelector('.eyebrow').textContent="Practice case complete";$('practicePanel').querySelector('h2').textContent="Choose another case"}
});
$('randomPractice').addEventListener('click',()=>practiceCase("random"));
$('nextPractice').addEventListener('click',()=>practiceCase("next"));
$('startOver').addEventListener('click',()=>location.reload());
$('guestButton').addEventListener('click',()=>{
  const firstName=$('firstName').value.trim()||'Guest';
  const lastName=$('lastName').value.trim();
  const name=`${firstName} ${lastName}`.trim();
  currentDisplayName=name;
  isGuest=true;
  officialCaseNumber=null;
  officialSubmitted=false;
  practiceAttempt=0;
  const idx=Math.floor(Math.random()*IDEALGAS_CASES.length);
  renderCase(IDEALGAS_CASES[idx],name,"practice");
  $('welcome').hidden=true;$('workspace').hidden=false;
  $('workspace').scrollIntoView({behavior:'smooth'});
});
