/* AWD Lab: GitHub REST API publishing admin. No secrets are stored or shipped. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const editor = window.AWD_EDITOR;
  const settings = {owner:'',repo:'',branch:'',token:''};
  const known = new Map();
  let connected = false, busy = false;
  const safeName = /^[A-Za-z0-9_.-]+$/;
  const toast = (message) => editor.notify(message);
  const setStatus = (message, bad=false) => { $('gh-status').textContent = message; $('gh-status').style.color=bad?'#ad3434':'#355d74'; };
  const currentPath = () => editor.getSection()==='site' ? 'site.js' : `content/${editor.getSection()}.js`;
  function setBusy(v){busy=v; for(const id of ['gh-connect','gh-disconnect','gh-refresh','gh-publish','gh-upload']) {
    $(id).disabled = v || (id !== 'gh-connect' && !connected) || (id==='gh-connect' && connected);
  }}
  function urlFor(path){return `https://api.github.com/repos/${encodeURIComponent(settings.owner)}/${encodeURIComponent(settings.repo)}/contents/${path.split('/').map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(settings.branch)}`;}
  async function request(method,url,body){
    const opts={method,headers:{'Accept':'application/vnd.github+json','Authorization':`Bearer ${settings.token}`,'X-GitHub-Api-Version':'2022-11-28'}};
    if(body!==undefined){opts.headers['Content-Type']='application/json';opts.body=JSON.stringify(body)}
    let res;
    try {res=await fetch(url,opts)} catch(e){throw new Error('网络连接失败：'+e.message)}
    let data;try{data=await res.json()}catch{data={}}
    if(!res.ok){let msg=data.message||res.statusText;
      if(res.status===401) msg='令牌无效或已失效，请重新生成 GitHub Token';
      else if(res.status===403)msg='访问被拒绝：检查 Token 的 Contents: Read and write 权限、仓库选择及速率限制';
      else if(res.status===404)msg='仓库或文件不存在：检查账号、仓库、分支和 Token 访问范围';
      else if(res.status===409)msg='版本冲突：可能有其他人修改了远程文件，请重新读取后合并';
      throw new Error(`${res.status}：${msg}`);
    }
    return data;
  }
  async function getFile(path){
    const out=await request('GET',urlFor(path));
    if(!out || Array.isArray(out)||out.type!=='file')throw new Error('远程路径不是文件：'+path);
    return out;
  }
  function fromBase64(base64){
    const binary=atob(base64.replace(/\s/g,''));
    return new TextDecoder().decode(Uint8Array.from(binary,c=>c.charCodeAt(0)));
  }
  function toBase64(text){const bytes=new TextEncoder().encode(text);let s=''; for(let i=0;i<bytes.length;i+=8192)s+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(s)}
  function encodeBytes(bytes){let s='';for(let i=0;i<bytes.length;i+=8192)s+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(s)}
  function readJsonAssignment(js,key){
    // All content files use simple window.SITE_DATA.key = <JSON> assignments.
    // Parse JSON only; never eval or execute remotely fetched JavaScript.
    const marker=key===null?'window.SITE_DATA =':'window.SITE_DATA.'+key+' =';
    const pos=js.indexOf(marker);
    if(pos<0)throw new Error('内容格式与编辑器不兼容，找不到 '+marker);
    let i=pos+marker.length;
    while(/\s/.test(js[i]))i++;
    const first=js[i]; if(first!=='{'&&first!=='['&&first!=='"')throw new Error('内容不是 JSON 格式，无法安全读取');
    let str=false,escape=false,depth=0,start=i;
    if(first==='"') {
      i++;for(;i<js.length;i++){const c=js[i];if(escape){escape=false;continue}if(c==='\\'){escape=true;continue}if(c==='"')return JSON.parse(js.slice(start,i+1))}
    } else {
      for(;i<js.length;i++){
        const c=js[i];if(str){if(escape)escape=false;else if(c==='\\')escape=true;else if(c==='"')str=false;continue}
        if(c==='"'){str=true;continue}
        if(c==='{'||c==='[')depth++;
        if(c==='}'||c===']')depth--;
        if(depth===0)return JSON.parse(js.slice(start,i+1));
      }
    }
    throw new Error('JSON 内容不完整');
  }
  function parseSection(section,js){
    const cfg=editor.getConfig(section);
    if(section==='site')return readJsonAssignment(js,null);
    if(cfg.key)return readJsonAssignment(js,cfg.key);
    const val={};for(const k of cfg.keys)val[k]=readJsonAssignment(js,k);return val;
  }
  async function fetchAndCache(section){
    const path=section==='site'?'site.js':`content/${section}.js`;
    const file=await getFile(path);
    const content=file.content ? fromBase64(file.content):await (async()=>{throw Error('远程内容较大，请手动检查文件大小')})();
    const parsed=parseSection(section,content);
    known.set(path,{sha:file.sha,content,parsed});
    return {path,parsed};
  }
  async function loadRemote({force=false}={}){
    if(!connected||busy)return;
    setBusy(true);
    const section=editor.getSection();
    try{
      const remote=await fetchAndCache(section);
      const hasDraft=editor.hasDraft(section);
      if(force && hasDraft && !confirm(`从 GitHub 重新读取 ${remote.path} 会覆盖这个浏览器中该栏目的未发布修改。确定继续？`)){
        setStatus('已读取远程版本；保留了本地草稿');return;
      }
      if(!hasDraft||force){editor.setData(section,remote.parsed);editor.clearDraft(section);setStatus(`已读取远程 ${remote.path}`)}
      else setStatus(`已连接；${section} 有本地草稿，请检查后发布`);
    }catch(e){setStatus(e.message,true)}finally{setBusy(false)}
  }
  async function connect(){
    const owner=$('gh-owner').value.trim(),repo=$('gh-repo').value.trim(),branch=$('gh-branch').value.trim(),token=$('gh-token').value.trim();
    if(!safeName.test(owner)||!safeName.test(repo)||!safeName.test(branch))return toast('请填写有效的 GitHub 账号、仓库和分支名称（分支限英文字母、数字、点、横线）');
    if(!token)return toast('请粘贴 Fine-grained Token');
    Object.assign(settings,{owner,repo,branch,token});setBusy(true);setStatus('正在验证仓库与权限…');
    try{
      const repoInfo=await request('GET',`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);
      if(!repoInfo.permissions?.push)throw new Error('当前账号没有此仓库的推送权限；请确认 Token 访问范围和仓库权限');
      connected=true;
      $('gh-token').value='';
      $('gh-owner').readOnly=true;$('gh-repo').readOnly=true;$('gh-branch').readOnly=true;
      setStatus('已连接到 '+owner+'/'+repo+' · '+branch);
      toast('GitHub 连接成功，支持直接发布');
    }catch(e){connected=false;settings.token='';setStatus(e.message,true)}finally{setBusy(false)}
    if(connected)await loadRemote();
  }
  function disconnect(){
    settings.token='';connected=false;known.clear();
    $('gh-token').value='';for(const id of ['gh-owner','gh-repo','gh-branch'])$(id).readOnly=false;
    setBusy(false);setStatus('已断开；令牌已从此页面移除');toast('已断开连接');
  }
  async function putFile(path,content,sha,message){
    const endpoint=urlFor(path).split('?ref=')[0];
    return request('PUT',endpoint,{message,content,sha,branch:settings.branch});
  }
  async function publish(){
    if(!connected||busy)return;
    const path=currentPath();
    const section=editor.getSection();
    const text=editor.getExport();
    if(!confirm(`确定将 ${path} 中的内容直接发布到 ${settings.owner}/${settings.repo} 的 ${settings.branch} 分支吗？\n\n公开网站将显示这些内容，请确认没有私人数据。`))return;
    setBusy(true);setStatus('正在核对远程版本…');
    try{
      let knownFile=known.get(path);
      // Require a base revision to prevent blind overwrites.
      if(!knownFile){await fetchAndCache(section);knownFile=known.get(path)}
      const latest=await getFile(path);
      if(latest.sha!==knownFile.sha)throw new Error('远程文件已被其他人更新，发布已取消。请先备份草稿，点击「读取远程当前栏目」并人工合并。');
      if(text===knownFile.content){setStatus('内容与 GitHub 上一致，无需发布');return}
      setStatus('正在提交到 GitHub…');
      const result=await putFile(path,toBase64(text),latest.sha,`Update AWD Lab ${section} via visual admin`);
      known.set(path,{sha:result.content.sha,content:text,parsed:editor.getData(section)});
      editor.clearDraft(section);
      setStatus('✅ 已提交 GitHub：'+(result.commit?.sha||'').slice(0,7)+'；等待 GitHub Pages 部署');
      toast('发布成功：已提交 GitHub，公开站点会在部署后更新');
    }catch(e){setStatus('发布失败：'+e.message,true)}finally{setBusy(false)}
  }
  async function upload(){
    if(!connected||busy)return;
    const file=$('gh-file').files?.[0];
    if(!file)return toast('请先选择图片或 PDF 文件');
    const ext=(file.name.split('.').pop()||'').toLowerCase();
    if(!['png','jpg','jpeg','webp','gif','svg','pdf'].includes(ext))return toast('仅允许 PNG、JPG、WebP、GIF、SVG、PDF');
    if(file.size>5*1024*1024)return toast('文件超过 5 MB，请先压缩');
    const clean=file.name.replace(/[^a-zA-Z0-9._-]/g,'-');
    const name=prompt('请输入上传到 assets/ 的文件名（同名文件可能会覆盖，建议加入日期）：',clean);
    if(name===null)return;
    if(!safeName.test(name)||name==='.'||name==='..'||!name.toLowerCase().endsWith('.'+ext))return toast('文件名只能使用字母、数字、点、横线、下划线，且保留原扩展名');
    const path='assets/'+name;
    if(!confirm(`确认上传文件到 ${path}？\n如果仓库内已有同名文件，会要求再次确认。`))return;
    setBusy(true);setStatus('正在上传文件…');
    try{
      let existing=null;
      try{existing=await getFile(path)}catch(e){if(!e.message.startsWith('404'))throw e}
      if(existing&&!confirm(`仓库中已存在 ${path}，确定覆盖吗？`))return;
      const bytes=new Uint8Array(await file.arrayBuffer());
      const result=await putFile(path,encodeBytes(bytes),existing?.sha,`Upload AWD Lab asset ${name}`);
      $('gh-assetpath').value=path;
      setStatus(`✅ 文件已上传 GitHub：${path} (${(result.commit?.sha||'').slice(0,7)})`);
      toast('上传成功：复制文件路径到相应内容字段后再发布栏目');
    }catch(e){setStatus('上传失败：'+e.message,true)}finally{setBusy(false)}
  }
  $('gh-connect').addEventListener('click',connect);
  $('gh-disconnect').addEventListener('click',disconnect);
  $('gh-refresh').addEventListener('click',()=>loadRemote({force:true}));
  $('gh-publish').addEventListener('click',publish);
  $('gh-upload').addEventListener('click',upload);
  $('gh-assetpath').addEventListener('click',async()=>{
    const val=$('gh-assetpath').value;if(!val)return;
    try{await navigator.clipboard.writeText(val);toast('资源路径已复制')}catch{$('gh-assetpath').select();toast('请按 Ctrl+C 复制路径')}
  });
  $('gh-preview').addEventListener('click',()=>window.open('index.html','_blank','noopener'));
  window.AWD_ADMIN={onSectionChange:()=>{if(connected&&!busy)loadRemote()}};
  window.addEventListener('pagehide',()=>{settings.token=''});
})();
