// ==UserScript==
// @name         Github Enhancement - High Speed Download
// @name:zh-CN   Github 增强 - 高速下载
// @name:zh-TW   Github 增強 - 高速下載
// @name:ru      Улучшение GitHub – быстрое скачивание
// @version      2.7.0
// @author       X.I.U (original) / __OWNER__ (patched fork)
// @description  High-speed download of Git Clone/SSH, Release, Raw, Code(ZIP) and other files (Based on public welfare), project list file quick download (☁). Patched: dropdown UI, verified mirrors.
// @description:zh-CN  高速下载 Git Clone/SSH、Release、Raw、Code(ZIP) 等文件 (公益加速)、项目列表单文件快捷下载 (☁)
// @description:zh-TW  高速下載 Git Clone/SSH、Release、Raw、Code(ZIP) 等文件 (公益加速)、項目列表單文件快捷下載 (☁)
// @description:ru  Высокоскоростная загрузка Git Clone/SSH, выпусков, изначальных файлов, кода (ZIP) и других файлов (на основе общественного благосостояния), быстрая загрузка файлов из списка проектов (☁)
// @match        *://github.com/*
// @match        *://bgithub.xyz/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACEUExURUxpcRgWFhsYGBgWFhcWFh8WFhoYGBgWFiUlJRcVFRkWFhgVFRgWFhgVFRsWFhgWFigeHhkWFv////////////r6+h4eHv///xcVFfLx8SMhIUNCQpSTk/r6+jY0NCknJ97e3ru7u+fn51BOTsPCwqGgoISDg6empmpoaK2srNDQ0FhXV3eXcCcAAAAXdFJOUwCBIZXMGP70BuRH2Ze/LpIMUunHkpQR34sfygAAAVpJREFUOMt1U+magjAMDAVb5BDU3W25b9T1/d9vaYpQKDs/rF9nSNJkArDA9ezQZ8wPbc8FE6eAiQUsOO1o19JolFibKCdHGHC0IJezOMD5snx/yE+KOYYr42fPSufSZyazqDoseTPw4lGJNOu6LBXVUPBG3lqYAOv/5ZwnNUfUifzBt8gkgfgINmjxOpgqUA147QWNaocLniqq3QsSVbQHNp45N/BAwoYQz9oUJEiE4GMGfoBSMj5gjeWRIMMqleD/CAzUHFqTLyjOA5zjNnwa4UCEZ2YK3khEcBXHjVBtEFeIZ6+NxYbPqWp1DLKV42t6Ujn2ydyiPi9nX0TTNAkVVZ/gozsl6FbrktkwaVvL2TRK0C8Ca7Hck7f5OBT6FFbLATkL2ugV0tm0RLM9fedDvhWstl8Wp9AFDjFX7yOY/lJrv8AkYuz7fuP8dv9izCYH+x3/LBnj9fYPBTpJDNzX+7cAAAAASUVORK5CYII=
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        window.onurlchange
// @sandbox      JavaScript
// @license      GPL-3.0 License
// @run-at       document-end
// @namespace    https://github.com/__OWNER__/github-enhanced-high-speed-download
// @supportURL   https://github.com/__OWNER__/github-enhanced-high-speed-download/issues
// @homepageURL  https://github.com/__OWNER__/github-enhanced-high-speed-download
// @downloadURL  https://raw.githubusercontent.com/__OWNER__/github-enhanced-high-speed-download/main/GithubEnhanced-High-Speed-Download.user.js
// @updateURL    https://raw.githubusercontent.com/__OWNER__/github-enhanced-high-speed-download/main/GithubEnhanced-High-Speed-Download.user.js
// ==/UserScript==

(function() {
    'use strict';
    var menu_rawFast = GM_getValue('xiu2_menu_raw_fast'), menu_rawFast_ID, menu_rawDownLink_ID, menu_gitClone_ID, menu_customUrl_ID, menu_feedBack_ID;
    // ==== 加速源清单（2026-11-16 实测：逐个下载 release/archive 校验 ZIP 魔数与字节数，失效项已删除）====
    // 仅保留实测可用的加速源；已删除的失效源：gh.h233.eu.org(403/1034)、gh.ddlc.top(429/1027)、
    // ghproxy.it、gh.jasonzeng.dev、github.geekery.cn(404)、ghp.keleyaa.com(429)、ghpxy.hwinzniej.top(429)、
    // gitproxy.mrhjx.cn(429)、ghproxy.cxkpro.top(429)、gh.xxooo.cf、gh.idayer.com、down.npee.cn、
    // raw.ihtw.moe、gh.zwy.one、ghfast.top(超时)、wget.la(约 2.5KB/s 已移除)
    const download_url_us = [
        ['https://gh-proxy.org/https://github.com', '美国', '[美国 Cloudflare CDN] - 该公益加速源由 [gh-proxy.com] 提供'],
        ['https://cdn.gh-proxy.org/https://github.com', '其他', '[Fastly CDN] - 该公益加速源由 [gh-proxy.com] 提供'],
        ['https://edgeone.gh-proxy.org/https://github.com', '其他', '[edgeone] - 该公益加速源由 [gh-proxy.com] 提供'],
        ['https://gh-proxy.com/https://github.com', '美国', '[美国 Cloudflare CDN] - 该公益加速源由 [gh-proxy.com] 提供'],
        ['https://hk.gh-proxy.org/https://github.com', '其他', '[中国香港] - 该公益加速源由 [gh-proxy.com] 提供'],
        ['https://gh.chjina.com/https://github.com', '美国', '[美国 Cloudflare CDN] - 该公益加速源由 [gh.chjina.com] 提供'],
        ['https://gh.monlor.com/https://github.com', '美国', '[美国 Cloudflare CDN] - 该公益加速源由 [gh.monlor.com] 提供'],
        ['https://cors.isteed.cc/github.com', '美国', '[美国 Cloudflare CDN] - 该公益加速源由 [@Lufs\'s] 提供'],
        ['https://github.ednovas.xyz/https://github.com', '美国', '[美国 Cloudflare CDN] - 该公益加速源由 [github.ednovas.xyz] 提供'],
        ['https://ghproxy.monkeyray.net/https://github.com', '美国', '[美国 洛杉矶] - 该公益加速源由 [ghproxy.monkeyray.net] 提供'],
        ['https://github.boki.moe/https://github.com', '美国', '[美国 Cloudflare CDN] - 该公益加速源由 [blog.boki.moe] 提供'],
        ['https://git.yylx.win/https://github.com', '美国', '[美国 Cloudflare CDN] - 该公益加速源由 [git.yylx.win] 提供'],
        ['https://cdn.crashmc.com/https://github.com', '美国', '[美国 Cloudflare CDN] - 该公益加速源由 [cdn.crashmc.com] 提供'],
        ['https://ghproxy.net/https://github.com', '其他', '[法国] - 该公益加速源由 [ghproxy.net] 提供&#10;&#10;提示：希望大家尽量多使用美国节点（每次随机 负载均衡），&#10;避免流量都集中到亚洲公益节点，减少成本压力，公益才能更持久~'],
        ['https://githubfast.com', '韩国', '[韩国] - 该公益加速源由 [Github Fast] 提供&#10;&#10;2026-11-17 复测：release 资源 200 且字节一致'],
        ['https://hub.glowp.xyz/https://github.com', '香港', '[中国香港] - 该公益加速源由 [hub.glowp.xyz] 提供&#10;&#10;2026-11-17 复测：release/raw/clone 三项均可用'],
        ['https://fastgit.cc/https://github.com', '美国', '[美国 Cloudflare CDN] - 该公益加速源由 [fastgit.cc] 提供&#10;&#10;2026-11-17 复测：release 资源 200 且字节一致'],
        ['https://proxy.yaoyaoling.net/https://github.com', '日本', '[日本 东京] - 该公益加速源由 [proxy.yaoyaoling.net] 提供&#10;&#10;2026-11-17 复测：release/raw/clone 三项均可用'],
    ], clone_url = [
        ['https://gh-proxy.org/https://github.com', '美国', '[美国 Cloudflare CDN] - 该公益加速源由 [gh-proxy.com] 提供'],
        ['https://gh-proxy.com/https://github.com', '美国', '[美国 Cloudflare CDN] - 该公益加速源由 [gh-proxy.com] 提供'],
        ['https://cdn.gh-proxy.org/https://github.com', '其他', '[Fastly CDN] - 该公益加速源由 [gh-proxy.com] 提供'],
        ['https://edgeone.gh-proxy.org/https://github.com', '其他', '[edgeone] - 该公益加速源由 [gh-proxy.com] 提供'],
        ['https://hk.gh-proxy.org/https://github.com', '香港', '[中国香港] - 该公益加速源由 [gh-proxy.com] 提供'],
        ['https://gh.chjina.com/https://github.com', '美国', '[美国 Cloudflare CDN] - 该公益加速源由 [gh.chjina.com] 提供'],
        ['https://gh.monlor.com/https://github.com', '美国', '[美国 Cloudflare CDN] - 该公益加速源由 [gh.monlor.com] 提供'],
        ['https://github.ednovas.xyz/https://github.com', '美国', '[美国 Cloudflare CDN] - 该公益加速源由 [github.ednovas.xyz] 提供'],
        ['https://github.boki.moe/https://github.com', '美国', '[美国 Cloudflare CDN] - 该公益加速源由 [blog.boki.moe] 提供'],
        ['https://git.yylx.win/https://github.com', '美国', '[美国 Cloudflare CDN] - 该公益加速源由 [git.yylx.win] 提供'],
        ['https://ghproxy.net/https://github.com', '法国', '[法国] - 该公益加速源由 [ghproxy.net] 提供'],
        ['https://githubfast.com', '韩国', '[韩国] - 该公益加速源由 [Github Fast] 提供&#10;&#10;2026-11-17 复测：git ls-remote 通过'],
        ['https://hub.glowp.xyz/https://github.com', '香港', '[中国香港] - 该公益加速源由 [hub.glowp.xyz] 提供&#10;&#10;2026-11-17 复测：git ls-remote 通过'],
        ['https://proxy.yaoyaoling.net/https://github.com', '日本', '[日本 东京] - 该公益加速源由 [proxy.yaoyaoling.net] 提供&#10;&#10;2026-11-17 复测：git ls-remote 通过'],
        ['https://g.blfrp.cn/https://github.com', '日本', '[日本 东京] - 该公益加速源由 [g.blfrp.cn] 提供&#10;&#10;2026-11-17 复测：git ls-remote 通过'],
    ], clone_ssh_url = [
        ['ssh://git@ssh.github.com:443/', 'Github 原生', '[日本、新加坡等] - Github 官方提供的 443 端口的 SSH（依然是 SSH 协议），适用于限制访问 22 端口的网络环境'],
    ], raw_url = [
        ['https://raw.githubusercontent.com', 'Github 原生', '[日本 东京]&#10;&#10; - 缓存：无（或很短）'],
        ['https://hk.gh-proxy.org/https://raw.githubusercontent.com', '香港 2', '[中国香港] - 该公益加速源由 [gh-proxy.com] 提供&#10;&#10; - 缓存：有（官方注明 2 小时）'],
        ['https://cdn.gh-proxy.org/https://raw.githubusercontent.com', '日本 2', '[Fastly CDN] - 该公益加速源由 [gh-proxy.com] 提供&#10;&#10; - 缓存：有'],
        ['https://gh-proxy.com/https://raw.githubusercontent.com', '美国', '[美国 Cloudflare CDN] - 该公益加速源由 [gh-proxy.com] 提供'],
        ['https://gh.catmak.name/https://raw.githubusercontent.com', '韩国', '[韩国 首尔] - 该公益加速源由 [gh.catmak.name] 提供'],
        ['https://fastly.jsdelivr.net/gh', '日本 1', '[日本 东京] - 该公益加速源由 [JSDelivr CDN] 提供&#10;&#10; - 缓存：有&#10; - 不支持大小超过 50 MB 的文件&#10; - 不支持版本号格式的分支名（如 v1.2.3）'],
        ['https://g.blfrp.cn/https://raw.githubusercontent.com', '日本 3', '[日本 东京] - 该公益加速源由 [g.blfrp.cn] 提供'],
        ['https://wget.la/https://raw.githubusercontent.com', '香港 1', '[中国香港、中国台湾、日本、美国等]（CDN 不固定） - 该公益加速源由 [ucdn.me] 提供&#10;&#10; - 缓存：无（或很短）'],
        ['https://gcore.jsdelivr.net/gh', '美国', '[美国 Cloudflare CDN] - 该公益加速源由 [JSDelivr CDN] 提供&#10;&#10; - 缓存：有&#10; - 不支持超过 50 MB 的文件'],
        ['https://jsd.proxy.aks.moe/gh', '香港 2', '[中国 香港] - 该公益加速源由 [cdn.akass.cn] 提供&#10;&#10;2026-11-17 复测：可用'],
        ['https://hub.glowp.xyz/https://raw.githubusercontent.com', '香港 3', '[中国香港] - 该公益加速源由 [hub.glowp.xyz] 提供&#10;&#10;2026-11-17 复测：可用'],
        ['https://proxy.yaoyaoling.net/https://raw.githubusercontent.com', '日本 4', '[日本 东京] - 该公益加速源由 [proxy.yaoyaoling.net] 提供&#10;&#10;2026-11-17 复测：可用'],
    ], svg = [
        '<svg class="octicon octicon-cloud-download" aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path d="M9 12h2l-3 3-3-3h2V7h2v5zm3-8c0-.44-.91-3-4.5-3C5.08 1 3 2.92 3 5 1.02 5 0 6.52 0 8c0 1.53 1 3 3 3h3V9.7H3C1.38 9.7 1.3 8.28 1.3 8c0-.17.05-1.7 1.7-1.7h1.3V5c0-1.39 1.56-2.7 3.2-2.7 2.55 0 3.13 1.55 3.2 1.8v1.2H12c.81 0 2.7.22 2.7 2.2 0 2.09-2.25 2.2-2.7 2.2h-2V11h2c2.08 0 4-1.16 4-3.5C16 5.06 14.08 4 12 4z"></path></svg>'
    ], style = ['padding:0 6px; margin-right: -1px; border-radius: 2px; background-color: var(--XIU2-background-color); border-color: var(--borderColor-default); font-size: 11px; color: var(--XIU2-font-color);'];

    if (menu_rawFast == null){menu_rawFast = 1; GM_setValue('xiu2_menu_raw_fast', 1)};
    if (GM_getValue('menu_rawDownLink') == null){GM_setValue('menu_rawDownLink', true)};
    if (GM_getValue('menu_gitClone') == null){GM_setValue('menu_gitClone', true)};
    // 如果自定义加速源不存在或为空则忽略，如果自定义加速源地址存在，则添加到 raw_url、clone_url 数组中
    if (GM_getValue('custom_raw_url')) {raw_url.splice(1, 0, [GM_getValue('custom_raw_url'), '自定义', '[由你自定义的 Raw 加速源]&#10;&#10;提示：点击浏览器右上角 Tampermonkey 扩展图标 - [ #️⃣ 自定义加速源 ]&#10;即可轮流设置 Raw、Git Clone、Release/Code(ZIP) 的自定义加速源地址（留空代表不设置）。'])};
    if (GM_getValue('custom_clone_url')) {clone_url.unshift([GM_getValue('custom_clone_url'), '自定义', '[由你自定义的 Git Clone 加速源]&#10;&#10;提示：点击浏览器右上角 Tampermonkey 扩展图标 - [ #️⃣ 自定义加速源 ]&#10;即可轮流设置 Raw、Git Clone、Release/Code(ZIP) 的自定义加速源地址（留空代表不设置）。'])};
    registerMenuCommand();
    // 注册脚本菜单
    function registerMenuCommand() {
        // 如果反馈菜单ID不是 null，则删除所有脚本菜单
        if (menu_feedBack_ID) {GM_unregisterMenuCommand(menu_rawFast_ID); GM_unregisterMenuCommand(menu_rawDownLink_ID); GM_unregisterMenuCommand(menu_gitClone_ID); GM_unregisterMenuCommand(menu_customUrl_ID); GM_unregisterMenuCommand(menu_feedBack_ID); menu_rawFast = GM_getValue('xiu2_menu_raw_fast');}
        // 避免在减少 raw 数组后，用户储存的数据大于数组而报错
        if (menu_rawFast > raw_url.length - 1) menu_rawFast = 0
        // 修正：原来是「点一次就切下一个」，用户看不到有哪些源、也不知道切到了哪。
        // 现在改为：点击后弹出完整加速源列表，手动选中哪一个就固定用哪一个，并自动刷新页面使其立即生效。
        if (GM_getValue('menu_rawDownLink')) menu_rawFast_ID = GM_registerMenuCommand(`${['0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟','1️⃣1️⃣','1️⃣2️⃣'][menu_rawFast] || '•'} [ ${raw_url[menu_rawFast][1]} ] 加速源 (☁) - 点击选择`, menu_pick_raw_fast);
        menu_rawDownLink_ID = GM_registerMenuCommand(`${GM_getValue('menu_rawDownLink')?'✅':'❌'} 项目列表单文件快捷下载 (☁)`, function(){if (GM_getValue('menu_rawDownLink') == true) {GM_setValue('menu_rawDownLink', false); GM_notification({text: `已关闭 [项目列表单文件快捷下载 (☁)] 功能\n（点击刷新网页后生效）`, timeout: 3500, onclick: function(){location.reload();}});} else {GM_setValue('menu_rawDownLink', true); GM_notification({text: `已开启 [项目列表单文件快捷下载 (☁)] 功能\n（点击刷新网页后生效）`, timeout: 3500, onclick: function(){location.reload();}});}registerMenuCommand();});
        menu_gitClone_ID = GM_registerMenuCommand(`${GM_getValue('menu_gitClone')?'✅':'❌'} 添加 git clone 命令`, function(){if (GM_getValue('menu_gitClone') == true) {GM_setValue('menu_gitClone', false); GM_notification({text: `已关闭 [添加 git clone 命令] 功能\n（点击刷新网页后生效）`, timeout: 3500, onclick: function(){location.reload();}});} else {GM_setValue('menu_gitClone', true); GM_notification({text: `已开启 [添加 git clone 命令] 功能\n（点击刷新网页后生效）`, timeout: 3500, onclick: function(){location.reload();}});}registerMenuCommand();});
        menu_customUrl_ID = GM_registerMenuCommand(`#️⃣ 自定义加速源`, function () {
            // 定义三种自定义加速源的键名和描述
            const customKeys = [
                { key: 'custom_raw_url', desc: 'Raw 加速源', placeholder: 'https://example.com/https://raw.githubusercontent.com' },
                { key: 'custom_clone_url', desc: 'Git Clone 加速源', placeholder: 'https://example.com/https://github.com' },
                { key: 'custom_download_url', desc: 'Release/Code(ZIP) 加速源', placeholder: 'https://example.com/https://github.com' }
            ];
            // 递归弹出输入框
            function promptCustomUrl(index = 0) {
                if (index >= customKeys.length) {GM_notification({ text: '自定义加速源设置已完成！\n（点击刷新网页后生效）', timeout: 3500, onclick: function () { location.reload(); } });return;}
                const { key, desc, placeholder } = customKeys[index];
                let current = GM_getValue(key, '');
                let input = prompt(`请输入自定义${desc}地址：\n- 当前：\n${current || '(未设置)'}\n\n- 示例：\n${placeholder}\n\n- 留空为不设置\n- 点击 [确定] 保存 并 继续设置下一个\n- 点击 [取消] 不保存 并 终止后续设置`,current);
                if (input !== null) {GM_setValue(key, input.trim());promptCustomUrl(index + 1);}// 如果用户点击 取消 按钮，则不再继续弹出
            }
            promptCustomUrl();
        });
        menu_feedBack_ID = GM_registerMenuCommand('💬 反馈 & 建议 [Github]', function () {window.GM_openInTab('https://github.com/XIU2/UserScript', {active: true,insert: true,setParent: true});window.GM_openInTab('https://greasyfork.org/zh-CN/scripts/412245/feedback', {active: true,insert: true,setParent: true});});
    }

    // 选择加速源（手动列表，选中即固定，并自动刷新页面）
    function menu_pick_raw_fast() {
        // 构造列表：序号 + 地区 + 域名，让用户能区分 gh-proxy / edgeone / hk 等同地区源
        let lines = ['请选择 Raw / ☁ 单文件下载要使用的加速源（输入序号）：', ''];
        for (let i = 0; i < raw_url.length; i++) {
            const host = raw_url[i][0].replace(/^https?:\/\//, '').split('/')[0];
            const mark = (i === menu_rawFast) ? ' ← 当前' : '';
            lines.push(`${i}. [${raw_url[i][1]}] ${host}${mark}`);
        }
        lines.push('', '输入序号后按确定：立即切换并刷新页面');
        const NL = String.fromCharCode(10);
        const input = prompt(lines.join(NL), String(menu_rawFast));

        if (input === null) return;                       // 用户取消
        const picked = parseInt(input.trim(), 10);
        if (isNaN(picked) || picked < 0 || picked >= raw_url.length) {
            GM_notification({text: '无效的序号，未做任何更改', timeout: 3000});
            return;
        }
        if (picked === menu_rawFast) {
            GM_notification({text: '已经是该加速源，无需切换', timeout: 2500});
            return;
        }
        menu_rawFast = picked;
        GM_setValue('xiu2_menu_raw_fast', menu_rawFast);
        delRawDownLink();   // 先清掉旧的 ☁ 链接
        addRawDownLink();   // 立即按新源重建
        addRawFile();       // 修正：Raw 按钮原来不会被刷新，这里一并重建
        registerMenuCommand();
        GM_notification({
            text: `已切换加速源为：[${raw_url[menu_rawFast][1]}]` + NL + '正在刷新页面使其生效…',
            timeout: 1500,
            onclick: function(){ location.reload(); }
        });
        setTimeout(function(){ location.reload(); }, 700); // 自动刷新
    };

    colorMode(); // 适配白天/夜间主题模式
    if (location.pathname.indexOf('/releases') > -1) setTimeout(addRelease, 1500); // 修正：直接打开 /releases 时从未调度过 addRelease
    setTimeout(addRawFile, 1000); // Raw 加速
    setTimeout(addRawDownLink, 2000); // Raw 单文件快捷下载（☁），延迟 2 秒执行，避免被 pjax 刷掉

    // Tampermonkey v4.11 版本添加的 onurlchange 事件 grant，可以监控 pjax 等网页的 URL 变化
    if (window.onurlchange === undefined) addUrlChangeEvent();
    window.addEventListener('urlchange', function() {
        colorMode(); // 适配白天/夜间主题模式
        if (location.pathname.indexOf('/releases') > -1) setTimeout(addRelease, 1000); // Release 加速（修正：indexOf 未判断 -1，导致任意页面都跑 addRelease）
        setTimeout(addRawFile, 1000); // Raw 加速
        setTimeout(addRawDownLink, 2000); // Raw 单文件快捷下载（☁），延迟 2 秒执行，避免被 pjax 刷掉
        setTimeout(addRawDownLink_, 1000); // 在浏览器返回/前进时重新添加 Raw 下载链接（☁）鼠标事件
    });


    // 判断节点是否为新版 GitHub 克隆面板容器
    // 新版结构：#clone-with-https 位于 .CloneContainer__* 内，外面是 .ActionList__* / .prc-AnchoredOverlay-*
    function isClonePanel(node) {
        if (!node || node.nodeType !== 1) return false
        const cls = (node.className || '').toString()
        if (cls.indexOf('LocalTab-module__') != -1) return true           // 旧版
        if (cls.indexOf('CloneContainer__') != -1) return true            // 新版
        if (cls.indexOf('ActionList__') != -1 && node.querySelector('input[value^="https:"]')) return true
        if (cls.indexOf('AnchoredOverlay') != -1 && node.querySelector('input[value^="https:"]')) return true
        return false
    }

    // Github Git Clone/SSH、Release、Download ZIP 改版为动态加载文件列表，因此需要监控网页元素变化
    const callback = (mutationsList, observer) => {
        if (location.pathname.indexOf('/releases') > -1) { // Release
            for (const mutation of mutationsList) {
                for (const target of mutation.addedNodes) {
                    if (target.nodeType !== 1) continue // 修正：return 会中断整个回调，改为 continue
                    if (target.tagName === 'DIV' && target.dataset.viewComponent === 'true' && target.classList[0] === 'Box') addRelease();
                }
            }
        } else if (document.querySelector('#repo-title-component')) { // 项目首页
            for (const mutation of mutationsList) {
                for (const target of mutation.addedNodes) {
                    if (target.nodeType !== 1) continue // 修正：return 会中断整个回调，改为 continue
                    if (target.tagName === 'DIV' && target.parentElement && target.parentElement.id === '__primerPortalRoot__') {
                        addGitClone(target);
                        addGitCloneSSH(target);
                        addDownloadZIP(target);
                        //setTimeout(()=>{addDownloadZIP(target)}, 300);
                    } else if (isClonePanel(target)) { // 适配 2026 新版克隆面板（LocalTab-module__ 已废弃）
                        if (target.querySelector('input[value^="https:"]')) {
                            addGitCloneClear('.XIU2-GCS'); addGitClone(target);
                        } else if (target.querySelector('input[value^="git@"]')) {
                            addGitCloneClear('.XIU2-GC'); addGitCloneSSH(target);
                        } else if (target.querySelector('input[value^="gh "]')) {
                            addGitCloneClear('.XIU2-GC, .XIU2-GCS');
                        }
                    }
                }
            }
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(document, { childList: true, subtree: true });


    // 加速下拉的共享样式（只注入一次）
    function ensureAccelStyle() {
        if (document.getElementById('XIU2-acc-style')) return;
        const st = document.createElement('style');
        st.id = 'XIU2-acc-style';
        st.textContent = `
            .XIU2-acc { position: relative; display: inline-block; margin-left: 6px; vertical-align: middle; }
            .XIU2-acc > summary { list-style: none; cursor: pointer; user-select: none; }
            .XIU2-acc > summary::-webkit-details-marker { display: none; }
            .XIU2-acc-btn {
                display: inline-flex; align-items: center; gap: 3px;
                padding: 1px 7px; font-size: 11px; line-height: 18px;
                border: 1px solid var(--borderColor-default, #d0d7de);
                border-radius: 6px; color: var(--fgColor-muted, #57606a);
                background: var(--bgColor-default, #ffffff); white-space: nowrap;
            }
            .XIU2-acc-btn:hover { color: var(--fgColor-accent, #0969da); border-color: var(--fgColor-accent, #0969da); }
            .XIU2-acc-btn b { font-weight: 600; color: var(--fgColor-accent, #0969da); }
            .XIU2-acc[open] > .XIU2-acc-btn { color: var(--fgColor-accent, #0969da); border-color: var(--fgColor-accent, #0969da); }
            .XIU2-acc-panel {
                position: absolute; right: 0; top: calc(100% + 4px); z-index: 200;
                min-width: 210px; max-height: 340px; overflow-y: auto;
                padding: 4px; border-radius: 8px;
                border: 1px solid var(--borderColor-default, #d0d7de);
                background: var(--bgColor-default, #ffffff);
                box-shadow: 0 8px 24px rgba(140,149,159,.2);
            }
            .XIU2-acc-item {
                display: flex; align-items: center; justify-content: space-between; gap: 10px;
                padding: 4px 8px; border-radius: 5px; font-size: 12px;
                text-decoration: none; white-space: nowrap;
                color: var(--fgColor-default, #24292f);
            }
            .XIU2-acc-item:hover { background: var(--bgColor-accent-muted, #ddf4ff); text-decoration: none; }
            .XIU2-acc-name { font-family: ui-monospace, SFMono-Regular, monospace; }
            .XIU2-acc-region { font-size: 11px; color: var(--fgColor-muted, #57606a); }
            .XIU2-acc-li { list-style: none; }
            /* 夜间模式 */
            [data-color-mode="dark"] .XIU2-acc-btn,
            [data-color-mode="dark"] .XIU2-acc-panel { background: #21262d; border-color: #30363d; }
            [data-color-mode="dark"] .XIU2-acc-item { color: #c9d1d9; }
            [data-color-mode="dark"] .XIU2-acc-item:hover { background: #1f6feb33; }
        `;
        document.head.appendChild(st);
    }

    // 点击面板外部 / 按 Esc 时收起已展开的下拉
    function bindAccelClose() {
        if (window.__xiu2AccelBound) return;
        window.__xiu2AccelBound = true;
        document.addEventListener('click', function (e) {
            document.querySelectorAll('details.XIU2-acc[open]').forEach(function (d) {
                if (!d.contains(e.target)) d.open = false;
            });
        }, true);
        document.addEventListener('keydown', function (e) {
            if (e.key !== 'Escape') return;
            document.querySelectorAll('details.XIU2-acc[open]').forEach(function (d) { d.open = false; });
        });
    }

    // 从加速源 URL 提取可辨识的短名，用于按钮标签
    // 例：https://gh-proxy.org/...        -> gh-proxy
    //     https://cdn.gh-proxy.org/...    -> gh-proxy-cdn
    //     https://hk.gh-proxy.org/...     -> gh-proxy-hk
    //     https://githubfast.com          -> githubfast
    function mirrorShortName(url) {
        let host = url.replace(/^https?:\/\//, '').split('/')[0].split('?')[0];
        host = host.replace(/^www\./, '');
        const parts = host.split('.');
        const drop = ['com','net','org','xyz','top','cn','cc','moe','dev','win','me','io','cf','tech','space','site','link','name','jp','kr'];
        let core = parts.filter(function(p){ return drop.indexOf(p) === -1; });
        if (core.length === 0) core = [parts[0]];
        const isGhProxy = core.indexOf('gh-proxy') !== -1;
        const isGhproxy = core.indexOf('ghproxy') !== -1;
        if (isGhProxy || isGhproxy) {
            const base = isGhProxy ? 'gh-proxy' : 'ghproxy';
            const sub = core.filter(function(c){ return c !== 'gh-proxy' && c !== 'ghproxy'; });
            return sub.length ? base + '-' + sub.join('-') : base;
        }
        return core.join('-');
    }

    // download_url 随机几个美国加速源
    function get_New_download_url() {
        //return download_url_us // 全输出调试用
        // 修正：原来每次从全部源里随机抽 6 个，gh-proxy 系只有约 40% 概率出现，用户会"看不到 gh-proxy 选项"。
        // 现在改为：gh-proxy 系（前 5 个）始终固定展示，其余源再随机补足。
        const PINNED = 5;                                   // 固定展示的 gh-proxy 系数量
        const RANDOM_COUNT = GM_getValue('custom_download_url') ? 4 : 6; // 额外随机补几个
        let pinned = download_url_us.slice(0, PINNED);      // 固定项：gh-proxy.org / cdn / edgeone / gh-proxy.com / hk
        let rest = download_url_us.slice(PINNED);           // 其余候选
        let i = rest.length, need = Math.min(RANDOM_COUNT, rest.length), temp, index;
        while (i-- > rest.length - need) {index = Math.floor((i + 1) * Math.random()); temp = rest[index]; rest[index] = rest[i]; rest[i] = temp;}
        let picked = pinned.concat(rest.slice(rest.length - need));
        // 如果有自定义加速源，则放到最前面
        if (GM_getValue('custom_download_url')) {
            return [[GM_getValue('custom_download_url'), '自定义', '[由你自定义的 Release/Code(ZIP) 加速源地址]&#10;&#10;提示：点击浏览器右上角 Tampermonkey 扩展图标 - [ #️⃣ 自定义加速源 ]&#10;即可轮流设置 Raw、Git Clone、Release/Code(ZIP) 的自定义加速源地址（留空代表不设置）。']].concat(picked);
        }
        return picked
    }

    // Release
    // 显示方案：每行文件旁只放一个「⚡ 加速」下拉按钮，点开才是完整加速源列表。
    // 旧方案把 11 个按钮直接铺在行内（实测宽 1153px，而容器仅 574px，横向溢出压住文件名），
    // 现改为浮层，行高与文件名宽度均不受影响。
    function addRelease() {
        let html = document.querySelectorAll('.Box-footer'); if (html.length == 0 || location.pathname.indexOf('/releases') == -1) return
        ensureAccelStyle();
        let new_download_url = get_New_download_url();
        for (const current of html) {
            current.querySelectorAll('li.Box-row a').forEach(function (_this) {
                if (_this.dataset.xiu2Rs) return // 幂等：同一链接不重复插入
                let href = _this.href.split(location.host)[1]
                if (href === undefined) return
                let links = '';
                for (let i = 0; i < new_download_url.length; i++) {
                    let url = new_download_url[i][3] !== undefined && href.indexOf('/archive/') !== -1
                        ? new_download_url[i][3] + href
                        : new_download_url[i][0] + href;
                    const name = mirrorShortName(new_download_url[i][0]);
                    const region = new_download_url[i][1];
                    const tip = (new_download_url[i][2] || '').replaceAll('&#10;', '\n');
                    links += `<a class="XIU2-acc-item" href="${url}" target="_blank" rel="noreferrer noopener nofollow"`
                        + ` title="${tip}">`
                        + `<span class="XIU2-acc-name">${name}</span>`
                        + `<span class="XIU2-acc-region">${region}</span></a>`;
                }
                const panel = `<details class="XIU2-acc"><summary class="XIU2-acc-btn">`
                    + `<svg aria-hidden="true" height="12" viewBox="0 0 16 16" width="12" fill="currentColor">`
                    + `<path d="M8 0a5.53 5.53 0 0 0-5.5 5.5c0 1.15.36 2.21.97 3.08L8 15l4.53-6.42c.61-.87.97-1.93.97-3.08A5.53 5.53 0 0 0 8 0Zm0 7.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"></path></svg>`
                    + `加速 <b>${new_download_url.length}</b></summary>`
                    + `<div class="XIU2-acc-panel">${links}</div></details>`;

                let anchor = _this.parentElement && _this.parentElement.parentElement
                    && _this.parentElement.parentElement.nextElementSibling
                if (!anchor) return
                anchor.insertAdjacentHTML('beforeend', panel)
                _this.dataset.xiu2Rs = '1' // 插入成功后才标记，失败可重试
            });
        }
        bindAccelClose();
    }

    // Download ZIP
    // 同 Release：改成「Download ZIP ⚡」下拉，不再把 N 个 ZIP 按钮平铺进代码菜单
    function addDownloadZIP(target) {
        const html = target.querySelector('ul[class^=prc-ActionList-ActionList-]>li:last-child'); if (!html) return
        let href = html.querySelector('a[href^="/"][href$=".zip"]'); if (!href || !href.getAttribute('href')) return
        if (html.dataset.xiu2Zip) return // 幂等
        href = href.getAttribute('href');
        ensureAccelStyle();

        let new_download_url = get_New_download_url(), links = '';
        for (let i = 0; i < new_download_url.length; i++) {
            if (new_download_url[i][3] === '') continue
            let url = new_download_url[i][3] !== undefined
                ? new_download_url[i][3] + href
                : new_download_url[i][0] + href;
            const name = mirrorShortName(new_download_url[i][0]);
            const region = new_download_url[i][1];
            const tip = (new_download_url[i][2] || '').replaceAll('&#10;', '\n');
            links += `<a class="XIU2-acc-item" href="${url}" target="_blank" rel="noreferrer noopener nofollow"`
                + ` title="${tip}">`
                + `<span class="XIU2-acc-name">${name}</span>`
                + `<span class="XIU2-acc-region">${region}</span></a>`;
        }

        const panel = `<li class="XIU2-acc-li"><details class="XIU2-acc">`
            + `<summary class="XIU2-acc-btn">`
            + `<svg aria-hidden="true" height="12" viewBox="0 0 16 16" width="12" fill="currentColor">`
            + `<path d="M8 0a5.53 5.53 0 0 0-5.5 5.5c0 1.15.36 2.21.97 3.08L8 15l4.53-6.42c.61-.87.97-1.93.97-3.08A5.53 5.53 0 0 0 8 0Zm0 7.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"></path></svg>`
            + `Download ZIP 加速 <b>${new_download_url.length}</b></summary>`
            + `<div class="XIU2-acc-panel">${links}</div></details></li>`;

        html.insertAdjacentHTML('afterend', panel);
        html.dataset.xiu2Zip = '1';
        bindAccelClose();
    }

    // Git Clone 切换清理
    function addGitCloneClear(css) {
        document.querySelectorAll(css).forEach((e)=>{e.remove()})
    }

    // Git Clone
    function addGitClone(target) {
        let html = target.querySelector('input[value^="https:"]:not([title])');if (!html) return
        if (html.dataset.xiu2Done) return // 幂等：已处理过就不再重复插入
        let href_split = html.value.split(location.host)[1]
        if (href_split === undefined) href_split = html.value.replace(/^https?:\/\/[^/]+/, '') // 兜底：非 github.com 域名时直接取路径
        let html_parent = '<div style="margin-top: 4px;" class="XIU2-GC ' + html.parentElement.className + '">',
            url = '', _html = '', _gitClone = '';
        // 幂等标记延后到插入成功后再写
        if (html.nextElementSibling) html.nextElementSibling.hidden = true; // 隐藏右侧复制按钮（考虑到能直接点击复制，就不再重复实现复制按钮事件了）
        if (html.parentElement.nextElementSibling && html.parentElement.nextElementSibling.tagName === 'P'){
            html.parentElement.nextElementSibling.textContent += ' (↑点击文字自动复制)'
        }
        if (GM_getValue('menu_gitClone')) {_gitClone='git clone '; html.value = _gitClone + html.value; html.setAttribute('value', html.value);}
        // 克隆原 Git Clone 元素
        let html_clone = html.cloneNode(true);
        for (let i=0;i<clone_url.length;i++) {
            // 修正：原分支两侧同值属死代码。clone 源统一按 <mirror><repo-path> 拼接
            url = clone_url[i][0] + href_split
            html_clone.title = `${url}\n\n${clone_url[i][2].replaceAll('&#10;','\n')}\n\n提示：点击文字可直接复制`
            html_clone.setAttribute('value', _gitClone + url)
            _html += html_parent + html_clone.outerHTML + '</div>'
        }
        html.parentElement.insertAdjacentHTML('afterend', _html);
        html.dataset.xiu2Done = '1' // 插入成功后才标记，失败可重试
        if (html.parentElement.parentElement.className.indexOf('XIU2-GCP') === -1){
            html.parentElement.parentElement.classList.add('XIU2-GCP')
            html.parentElement.parentElement.addEventListener('click', (e)=>{if (e.target.tagName === 'INPUT') {GM_setClipboard(e.target.value);}})
        }
    }


    // Git Clone SSH
    function addGitCloneSSH(target) {
        let html = target.querySelector('input[value^="git@"]:not([title])');if (!html) return
        if (html.dataset.xiu2Done) return // 幂等：已处理过就不再重复插入
        let href_split = html.value.split(':')[1]
        if (href_split === undefined) href_split = html.value.replace(/^[^:]+:/, '')
        let html_parent = '<div style="margin-top: 4px;" class="XIU2-GCS ' + html.parentElement.className + '">',
            url = '', _html = '', _gitClone = '';
        // 幂等标记延后到插入成功后再写
        if (html.nextElementSibling) html.nextElementSibling.hidden = true; // 隐藏右侧复制按钮（考虑到能直接点击复制，就不再重复实现复制按钮事件了）
        if (html.parentElement.nextElementSibling && html.parentElement.nextElementSibling.tagName === 'P'){
            html.parentElement.nextElementSibling.textContent += ' (↑点击自动复制)'
        }
        if (GM_getValue('menu_gitClone')) {_gitClone='git clone '; html.value = _gitClone + html.value; html.setAttribute('value', html.value);}
        // 克隆原 Git Clone SSH 元素
        let html_clone = html.cloneNode(true);
        for (let i=0;i<clone_ssh_url.length;i++) {
            url = clone_ssh_url[i][0] + href_split
            html_clone.title = `${url}\n\n${clone_ssh_url[i][2].replaceAll('&#10;','\n')}\n\n提示：点击文字可直接复制`
            html_clone.setAttribute('value', _gitClone + url)
            _html += html_parent + html_clone.outerHTML + '</div>'
        }
        html.parentElement.insertAdjacentHTML('afterend', _html);
        html.dataset.xiu2Done = '1' // 插入成功后才标记，失败可重试
        if (html.parentElement.parentElement.className.indexOf('XIU2-GCP') === -1){
            html.parentElement.parentElement.classList.add('XIU2-GCP')
            html.parentElement.parentElement.addEventListener('click', (e)=>{if (e.target.tagName === 'INPUT') {GM_setClipboard(e.target.value);}})
        }
    }


    // Raw
    function addRawFile() {
        let html = document.querySelector('a[data-testid="raw-button"]');if (!html) return
        let href = location.href.replace(`https://${location.host}`,''),
            href2 = href.replace('/blob/','/'),
            url = '', _html = '';

        for (let i=1;i<raw_url.length;i++) {
            if ((raw_url[i][0].indexOf('/gh') + 3 === raw_url[i][0].length) && raw_url[i][0].indexOf('cdn.staticaly.com') === -1) {
                url = raw_url[i][0] + href.replace('/blob/','@');
            } else {
                url = raw_url[i][0] + href2;
            }
            _html += `<a href="${url}" title="${raw_url[i][2]}\n\n提示：如果想要直接下载，可使用 [Alt + 左键] 点击加速按钮或 [右键 - 另存为...]" target="_blank" role="button" rel="noreferrer noopener nofollow" data-size="small" data-variant="default" class="${html.className} XIU2-RF" style="border-radius: 0;margin-left: -1px;">${raw_url[i][1].replace(/ \d/,'')}</a>`
        }
        if (document.querySelector('.XIU2-RF')) document.querySelectorAll('.XIU2-RF').forEach((e)=>{e.remove()})
        html.insertAdjacentHTML('afterend', _html);
    }


    // Raw 单文件快捷下载（☁）
    function addRawDownLink() {
        if (!GM_getValue('menu_rawDownLink')) return
        // 如果不是项目文件页面，就返回，如果网页有 Raw 下载链接（☁）就返回
        let files = document.querySelectorAll('div.Box-row svg.octicon.octicon-file, .react-directory-filename-column>svg.color-fg-muted');if(files.length === 0) return;if (location.pathname.indexOf('/tags') > -1) return
        let files1 = document.querySelectorAll('a.fileDownLink');if(files1.length > 0) return;

        // 鼠标指向则显示
        var mouseOverHandler = function(evt) {
            let elem = evt.currentTarget,
                aElm_new = elem.querySelectorAll('.fileDownLink'),
                aElm_now = elem.querySelectorAll('svg.octicon.octicon-file, svg.color-fg-muted');
            aElm_new.forEach(el=>{el.style.cssText = 'display: inline'});
            aElm_now.forEach(el=>{el.style.cssText = 'display: none'});
        };

        // 鼠标离开则隐藏
        var mouseOutHandler = function(evt) {
            let elem = evt.currentTarget,
                aElm_new = elem.querySelectorAll('.fileDownLink'),
                aElm_now = elem.querySelectorAll('svg.octicon.octicon-file, svg.color-fg-muted');
            aElm_new.forEach(el=>{el.style.cssText = 'display: none'});
            aElm_now.forEach(el=>{el.style.cssText = 'display: inline'});
        };

        // 循环添加
        files.forEach(function(fileElm) {
            let trElm = fileElm.parentNode.parentNode,
                cntElm_a = trElm.querySelector('[role="rowheader"] > .css-truncate.css-truncate-target.d-block.width-fit > a, .react-directory-truncate>a'),
                Name = cntElm_a.innerText,
                href = cntElm_a.getAttribute('href'),
                href2 = href.replace('/blob/','/'), url = '';
            if ((raw_url[menu_rawFast][0].indexOf('/gh') + 3 === raw_url[menu_rawFast][0].length) && raw_url[menu_rawFast][0].indexOf('cdn.staticaly.com') === -1) {
                url = raw_url[menu_rawFast][0] + href.replace('/blob/','@');
            } else {
                url = raw_url[menu_rawFast][0] + href2;
            }

            fileElm.insertAdjacentHTML('afterend', `<a href="${url}" download="${Name}" target="_blank" rel="noreferrer noopener nofollow" class="fileDownLink" style="display: none;" title="「${raw_url[menu_rawFast][1]}」&#10;&#10;[Alt + 左键点击] 或 [右键 - 另存为...] 下载文件。&#10;注意：鼠标点击 [☁] 图标，而不是左侧的文件名！&#10;&#10;${raw_url[menu_rawFast][2]}&#10;&#10;提示：点击浏览器右上角 Tampermonkey 扩展图标 - [ ${raw_url[menu_rawFast][1]} ] 加速源 (☁) 即可切换。">${svg[0]}</a>`);
            // 绑定鼠标事件
            trElm.onmouseover = mouseOverHandler;
            trElm.onmouseout = mouseOutHandler;
        });
    }


    // 移除 Raw 单文件快捷下载（☁）
    function delRawDownLink() {
        if (!GM_getValue('menu_rawDownLink')) return
        let aElm = document.querySelectorAll('.fileDownLink');if(aElm.length === 0) return;
        aElm.forEach(function(fileElm) {fileElm.remove();})
    }


    // 在浏览器返回/前进时重新添加 Raw 单文件快捷下载（☁）鼠标事件
    function addRawDownLink_() {
        if (!GM_getValue('menu_rawDownLink')) return
        // 如果不是项目文件页面，就返回，如果网页没有 Raw 下载链接（☁）就返回
        let files = document.querySelectorAll('div.Box-row svg.octicon.octicon-file, .react-directory-filename-column>svg.color-fg-muted');if(files.length === 0) return;
        let files1 = document.querySelectorAll('a.fileDownLink');if(files1.length === 0) return;

        // 鼠标指向则显示
        var mouseOverHandler = function(evt) {
            let elem = evt.currentTarget,
                aElm_new = elem.querySelectorAll('.fileDownLink'),
                aElm_now = elem.querySelectorAll('svg.octicon.octicon-file, svg.color-fg-muted');
            aElm_new.forEach(el=>{el.style.cssText = 'display: inline'});
            aElm_now.forEach(el=>{el.style.cssText = 'display: none'});
        };

        // 鼠标离开则隐藏
        var mouseOutHandler = function(evt) {
            let elem = evt.currentTarget,
                aElm_new = elem.querySelectorAll('.fileDownLink'),
                aElm_now = elem.querySelectorAll('svg.octicon.octicon-file, svg.color-fg-muted');
            aElm_new.forEach(el=>{el.style.cssText = 'display: none'});
            aElm_now.forEach(el=>{el.style.cssText = 'display: inline'});
        };
        // 循环添加
        files.forEach(function(fileElm) {
            let trElm = fileElm.parentNode.parentNode;
            // 绑定鼠标事件
            trElm.onmouseover = mouseOverHandler;
            trElm.onmouseout = mouseOutHandler;
        });
    }


    // 适配白天/夜间主题模式
    function colorMode() {
        let style_Add;
        if (document.getElementById('XIU2-Github')) {style_Add = document.getElementById('XIU2-Github')} else {style_Add = document.createElement('style'); style_Add.id = 'XIU2-Github'; style_Add.type = 'text/css';}
        let backColor = '#ffffff', fontColor = '#888888';

        if (document.lastElementChild.dataset.colorMode === 'dark') { // 如果是夜间模式
            if (document.lastElementChild.dataset.darkTheme === 'dark_dimmed') {
                backColor = '#272e37'; fontColor = '#768390';
            } else {
                backColor = '#161a21'; fontColor = '#97a0aa';
            }
        } else if (document.lastElementChild.dataset.colorMode === 'auto') { // 如果是自动模式
            if (window.matchMedia('(prefers-color-scheme: dark)').matches || document.lastElementChild.dataset.lightTheme.indexOf('dark') > -1) { // 如果浏览器是夜间模式 或 白天模式是 dark 的情况
                if (document.lastElementChild.dataset.darkTheme === 'dark_dimmed') {
                    backColor = '#272e37'; fontColor = '#768390';
                } else if (document.lastElementChild.dataset.darkTheme.indexOf('light') == -1) { // 排除夜间模式是 light 的情况
                    backColor = '#161a21'; fontColor = '#97a0aa';
                }
            }
        }

        document.lastElementChild.appendChild(style_Add).textContent = `.XIU2-RS a {--XIU2-background-color: ${backColor}; --XIU2-font-color: ${fontColor};}`;
    }


    // 自定义 urlchange 事件（用来监听 URL 变化），针对非 Tampermonkey 油猴管理器
    function addUrlChangeEvent() {
        history.pushState = ( f => function pushState(){
            var ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('pushstate'));
            window.dispatchEvent(new Event('urlchange'));
            return ret;
        })(history.pushState);

        history.replaceState = ( f => function replaceState(){
            var ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('replacestate'));
            window.dispatchEvent(new Event('urlchange'));
            return ret;
        })(history.replaceState);

        window.addEventListener('popstate',()=>{ // 点击浏览器的前进/后退按钮时触发 urlchange 事件
            window.dispatchEvent(new Event('urlchange'))
        });
    }
})();
