/* uchat.cn 站点行为：区域显隐、动态版权年份、语言 / 全球站点切换提示 */

(function () {
  const isCnDomain = window.location.hostname.endsWith(".cn");
  document
    .querySelectorAll(isCnDomain ? ".is-cn" : ".is-intl")
    .forEach(function (el) {
      el.style.setProperty("display", "inline-flex", "important");
    });
})();

/* ===== 版权年份（起始年 – 当前年） ===== */
(function () {
  const START = 2026;
  const NOW = new Date().getFullYear();
  const label = NOW > START ? START + "\u2013" + NOW : String(START);
  document.querySelectorAll("[data-copyright-year]").forEach(function (el) {
    el.textContent = label;
  });
})();

/* ===== 语言 / 全球站点切换提示条（JS 注入） ===== */
(function () {
  const LS_KEY = "uchat.langPrompt.dismissed";
  const SS_KEY = "uchat.langPrompt.session";
  const GLOBAL_BASE = "https://foxterm.app"; // UChat 在全球站的页面：/uchat
  const GLOBAL_PATH = "/uchat";

  let dismissed = false;
  try {
    dismissed =
      !!sessionStorage.getItem(SS_KEY) || !!localStorage.getItem(LS_KEY);
  } catch (e) {
    /* 隐私模式下 storage 不可用 */
  }
  if (dismissed) return;

  const isCnDomain = window.location.hostname.endsWith(".cn");

  const COUNTRY_LANG = {
    CN: "/zh-hans/",
    TW: "/zh-hant/",
    HK: "/zh-hant/",
    MO: "/zh-hant/",
    SG: "/zh-hans/",
    MY: "/zh-hans/",
    JP: "/ja/",
    DE: "/de/",
    AT: "/de/",
    CH: "/de/",
    RU: "/ru/",
    BY: "/ru/",
    ES: "/es/",
    FR: "/fr/",
    KR: "/ko/",
    BR: "/pt-br/",
    PT: "/pt-br/",
    US: "/",
    GB: "/",
    AU: "/",
    CA: "/",
    NZ: "/",
    IE: "/",
  };

  // 语言切换提示：msg 里的 {lang} 会替换为 name
  const COPY = {
    en: {
      name: "English",
      msg: "Your region recommends the English version. Would you like to switch?",
      go: "Go to English version",
      dismiss: "Don't show again",
      close: "Close",
    },
    "zh-hans": {
      name: "简体中文",
      msg: "检测到您当前所在地区推荐使用{lang}版本，是否切换？",
      go: "前往简体中文版",
      dismiss: "不再提示",
      close: "关闭",
    },
    "zh-hant": {
      name: "繁體中文",
      msg: "偵測到您目前所在地區推薦使用{lang}版本，是否切換？",
      go: "前往繁體中文版",
      dismiss: "不再提示",
      close: "關閉",
    },
    ja: {
      name: "日本語",
      msg: "お住まいの地域では{lang}版が推奨されています。切り替えますか？",
      go: "日本語版へ",
      dismiss: "今後表示しない",
      close: "閉じる",
    },
    de: {
      name: "Deutsch",
      msg: "Für Ihren Standort wird die {lang}-Version empfohlen. Möchten Sie wechseln?",
      go: "Zur deutschen Version",
      dismiss: "Nicht mehr anzeigen",
      close: "Schließen",
    },
    ru: {
      name: "Русский",
      msg: "Для вашего региона рекомендуется {lang}-версия. Переключить?",
      go: "Перейти на русскую версию",
      dismiss: "Больше не показывать",
      close: "Закрыть",
    },
    es: {
      name: "Español",
      msg: "Para tu región recomendamos la versión en {lang}. ¿Deseas cambiar?",
      go: "Ir a la versión en español",
      dismiss: "No volver a mostrar",
      close: "Cerrar",
    },
    fr: {
      name: "Français",
      msg: "Pour votre région, la version en {lang} est recommandée. Voulez-vous changer ?",
      go: "Passer à la version française",
      dismiss: "Ne plus afficher",
      close: "Fermer",
    },
    ko: {
      name: "한국어",
      msg: "현재 지역에서는 {lang} 버전이 권장됩니다. 전환하시겠습니까?",
      go: "한국어 버전으로",
      dismiss: "다시 표시하지 않음",
      close: "닫기",
    },
    "pt-br": {
      name: "Português",
      msg: "Para sua região, recomendamos a versão em {lang}. Deseja mudar?",
      go: "Ir para a versão em português",
      dismiss: "Não mostrar novamente",
      close: "Fechar",
    },
  };

  // 全球站点切换提示（按当前页面语言）：uchat.cn → foxterm.app/uchat
  const SITE_COPY = {
    en: {
      msg: "You appear to be outside mainland China. The global site loads faster for you.",
      go: "Go to the global site",
    },
    "zh-hans": {
      msg: "检测到您位于中国大陆以外，切换到全球站点可以获得更好体验。",
      go: "前往全球站点",
    },
    "zh-hant": {
      msg: "偵測到您位於中國大陸以外，切換至全球站點可獲得更佳體驗。",
      go: "前往全球站點",
    },
    ja: {
      msg: "中国本土以外からアクセスしているようです。グローバルサイトの方が快適にご利用いただけます。",
      go: "グローバルサイトへ",
    },
    de: {
      msg: "Sie scheinen sich außerhalb des chinesischen Festlands zu befinden. Die globale Website lädt für Sie schneller.",
      go: "Zur globalen Website",
    },
    ru: {
      msg: "Похоже, вы находитесь за пределами материкового Китая. Глобальная версия работает быстрее.",
      go: "На глобальный сайт",
    },
    es: {
      msg: "Parece que estás fuera de China continental. La versión global del sitio va más rápido.",
      go: "Ir a la versión global",
    },
    fr: {
      msg: "Votre région semble située hors de Chine continentale. Le site mondial se chargera plus vite.",
      go: "Aller au site mondial",
    },
    ko: {
      msg: "중국 대륙 외 지역에 계신 것으로 보입니다. 글로벌 사이트가 더 빠르게 로딩됩니다.",
      go: "글로벌 사이트로",
    },
    "pt-br": {
      msg: "Parece que você está fora da China continental. O site global carrega mais rápido.",
      go: "Ir para o site global",
    },
  };

  function currentLangKey() {
    const m = window.location.pathname.match(/^\/([a-z]{2}(?:-[a-z]{2,}))\//);
    return m && COPY[m[1]] ? m[1] : "en";
  }

  function createBanner() {
    const box = document.createElement("div");
    box.id = "lang-prompt";
    box.className = "lang-prompt";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-live", "polite");
    box.setAttribute("aria-label", "Language suggestion");
    box.hidden = true;
    box.innerHTML =
      '<div class="lang-prompt-card">' +
      '<img class="lang-prompt-logo" src="/assets/uchat-ai.png" alt="" />' +
      '<p id="lang-prompt-msg" class="lang-prompt-msg"></p>' +
      '<div class="lang-prompt-actions">' +
      '<a id="lang-prompt-go" class="lang-prompt-btn lang-prompt-btn-primary" href="#"></a>' +
      '<button id="lang-prompt-dismiss" type="button" class="lang-prompt-btn lang-prompt-btn-ghost"></button>' +
      "</div>" +
      '<button id="lang-prompt-close" type="button" class="lang-prompt-close" aria-label="Close">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<path d="M6 6l12 12M18 6L6 18"></path>' +
      "</svg>" +
      "</button>" +
      "</div>";
    document.body.appendChild(box);
    return box;
  }

  function showBanner(box, msg, goText, goHref, t) {
    const msgEl = document.getElementById("lang-prompt-msg");
    const goEl = document.getElementById("lang-prompt-go");
    const dismissEl = document.getElementById("lang-prompt-dismiss");
    const closeEl = document.getElementById("lang-prompt-close");
    if (!msgEl || !goEl || !dismissEl || !closeEl) return;
    msgEl.textContent = msg;
    goEl.textContent = goText;
    goEl.href = goHref;
    dismissEl.textContent = t.dismiss;
    closeEl.setAttribute("aria-label", t.close);
    dismissEl.addEventListener("click", function () {
      try {
        localStorage.setItem(LS_KEY, "1");
      } catch (e) {
        /* ignore */
      }
      box.hidden = true;
    });
    closeEl.addEventListener("click", function () {
      try {
        sessionStorage.setItem(SS_KEY, "1");
      } catch (e) {
        /* ignore */
      }
      box.hidden = true;
    });
    box.hidden = false;
  }

  function isOnPath(path) {
    const pathname = window.location.pathname;
    if (path === "/") {
      return (
        pathname === "/" ||
        pathname === "/index.html" ||
        !/^\/[a-z]{2}(?:-[a-z]{2,})?\//.test(pathname)
      );
    }
    return pathname.startsWith(path);
  }

  // 只替换语言目录，保留当前页面的剩余路径与查询串
  function buildLangUrl(targetPath) {
    const pathname = window.location.pathname;
    const search = window.location.search;
    const match = pathname.match(/^\/([a-z]{2}(?:-[a-z]{2,})?)\//);
    let rest;
    if (match) {
      rest = pathname.slice(match[0].length);
    } else if (pathname === "/" || pathname === "/index.html") {
      rest = "";
    } else {
      rest = pathname.slice(1);
    }
    return targetPath + rest + search;
  }

  // 本站语言 → 全球站：/zh-hans/ → https://foxterm.app/zh-hans/uchat
  function buildGlobalUrl() {
    const key = currentLangKey();
    return GLOBAL_BASE + (key === "en" ? "" : "/" + key) + GLOBAL_PATH + "/";
  }

  async function init() {
    let cc = null;
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(function () {
        ctrl.abort();
      }, 1000);
      // 地理信息由本仓库的 edge-functions/geo 提供，同源请求
      const res = await fetch("/geo", { signal: ctrl.signal });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        const raw = data && data.geo && data.geo.countryCodeAlpha2;
        cc = raw ? String(raw).toUpperCase() : null;
      }
    } catch (e) {
      /* geo 不可用则不提示 */
    }

    if (!cc) return;

    const targetPath = COUNTRY_LANG[cc] || "/";

    // 1) 地区语言与当前页不符：先建议切换本站语言
    if (!isOnPath(targetPath)) {
      const t = COPY[targetPath === "/" ? "en" : targetPath.slice(1, -1)];
      if (!t) return;
      const box = createBanner();
      showBanner(
        box,
        t.msg.replace(/\{lang\}/g, t.name),
        t.go,
        buildLangUrl(targetPath),
        t,
      );
      return;
    }

    // 2) 语言已匹配、访客推荐语言为英文且仍在中国域名：建议切换到全球站
    if (isCnDomain && cc !== "CN" && targetPath === "/") {
      const key = currentLangKey();
      const site = SITE_COPY[key];
      const box = createBanner();
      showBanner(box, site.msg, site.go, buildGlobalUrl(), COPY[key]);
    }
  }

  init();
})();
