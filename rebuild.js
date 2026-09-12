const root = document.documentElement;
const systemReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const SETTINGS_KEY = 'easyglobe-settings-v1';
const defaultAppearance = {
  theme: 'dark',
  accent: '#73e7c5',
  sourceAccent: '#ffcb64',
  motion: true,
  autoRotateSpeed: 2.5,
};
let motionEnabled = !systemReduceMotion;

const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
}[character]));

const clone = (value) => JSON.parse(JSON.stringify(value));
const isColor = (value) => /^#[0-9a-f]{6}$/i.test(value);
const isSafeUrl = (value) => !value || value === '#' || /^https?:\/\/[^\s]+$/i.test(value);
const isEmail = (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const validateSettings = (candidate, defaults) => {
  if (!candidate || typeof candidate !== 'object') throw new Error('配置文件格式不正确。');
  const site = candidate.site || {};
  const brand = site.brand || {};
  const links = site.links || {};
  const appearance = candidate.appearance || {};
  const languages = candidate.languages || {};
  const text = (value, fallback, max) => {
    const result = typeof value === 'string' ? value.trim() : fallback;
    if (!result || result.length > max) throw new Error(`文本必须为 1–${max} 个字符。`);
    return result;
  };
  const normalized = {
    version: 1,
    site: {
      brand: {
        name: text(brand.name, defaults.site.brand.name, 60),
        title: text(brand.title, defaults.site.brand.title, 100),
        description: text(brand.description, defaults.site.brand.description, 180),
      },
      links: {
        github: typeof links.github === 'string' ? links.github.trim() : defaults.site.links.github,
        creator: typeof links.creator === 'string' ? links.creator.trim() : defaults.site.links.creator,
        friendship: typeof links.friendship === 'string' ? links.friendship.trim() : defaults.site.links.friendship,
        email: typeof links.email === 'string' ? links.email.trim() : defaults.site.links.email,
      },
    },
    appearance: {
      theme: ['dark', 'light', 'system'].includes(appearance.theme) ? appearance.theme : defaults.appearance.theme,
      accent: appearance.accent || defaults.appearance.accent,
      sourceAccent: appearance.sourceAccent || defaults.appearance.sourceAccent,
      motion: typeof appearance.motion === 'boolean' ? appearance.motion : defaults.appearance.motion,
      autoRotateSpeed: Number.isFinite(Number(appearance.autoRotateSpeed)) ? Number(appearance.autoRotateSpeed) : defaults.appearance.autoRotateSpeed,
    },
    languages: {},
  };
  if (!isSafeUrl(normalized.site.links.github) || !isSafeUrl(normalized.site.links.creator) || !isSafeUrl(normalized.site.links.friendship)) throw new Error('链接必须为空、#，或以 http:// / https:// 开头。');
  if (!isEmail(normalized.site.links.email)) throw new Error('邮箱格式不正确。');
  if (!isColor(normalized.appearance.accent) || !isColor(normalized.appearance.sourceAccent)) throw new Error('颜色必须是六位十六进制色值。');
  if (normalized.appearance.autoRotateSpeed < 0 || normalized.appearance.autoRotateSpeed > 5) throw new Error('地球转速必须在 0–5 之间。');
  Object.entries(defaults.languages).forEach(([id, fallback]) => {
    const item = languages[id] || {};
    normalized.languages[id] = {
      country: text(item.country, fallback.country, 30),
      language: text(item.language, fallback.language, 30),
      sample: text(item.sample, fallback.sample, 100),
      nuance: text(item.nuance, fallback.nuance, 100),
      anchor: fallback.anchor,
      enabled: typeof item.enabled === 'boolean' ? item.enabled : true,
    };
  });
  if (Object.values(normalized.languages).filter((item) => item.enabled).length < 2) throw new Error('至少需要启用两个国家。');
  return normalized;
};

const applyAppearance = (appearance) => {
  const theme = appearance.theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
    : appearance.theme;
  root.dataset.theme = theme;
  root.dataset.motion = appearance.motion ? 'on' : 'off';
  root.dataset.globeSpeed = String(appearance.autoRotateSpeed);
  root.style.setProperty('--accent', appearance.accent);
  root.style.setProperty('--accent-2', appearance.sourceAccent);
  motionEnabled = appearance.motion && !systemReduceMotion;
};

const applySiteConfig = (config) => {
  document.title = config.brand.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', config.brand.description);
  document.querySelectorAll('[data-brand-name]').forEach((node) => { node.textContent = config.brand.name; });
  document.querySelectorAll('[data-current-year]').forEach((node) => { node.textContent = String(new Date().getFullYear()); });

  const navLinkRoot = document.querySelector('[data-nav-links]');
  if (navLinkRoot) navLinkRoot.replaceChildren();
  if (config.links.github && navLinkRoot) {
    const githubLink = document.createElement('a');
    githubLink.href = config.links.github;
    githubLink.className = 'github-link';
    githubLink.dataset.optionalLink = 'github';
    githubLink.textContent = 'GitHub ↗';
    githubLink.setAttribute('aria-label', config.links.github === '#' ? 'GitHub 地址待配置' : '在 GitHub 查看项目');
    if (/^https?:/i.test(config.links.github)) {
      githubLink.target = '_blank';
      githubLink.rel = 'noreferrer';
    }
    navLinkRoot.append(githubLink);
  }

  const linkRoot = document.querySelector('[data-config-links]');
  if (linkRoot) linkRoot.replaceChildren();
  const optionalLinks = [
    ['creator', config.links.creator, '作者主页'],
    ['friendship', config.links.friendship, '友情链接'],
    ['email', config.links.email ? `mailto:${config.links.email}` : '', '联系'],
  ];
  optionalLinks.forEach(([key, href, label]) => {
    if (!href || !linkRoot) return;
    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    link.dataset.optionalLink = key;
    if (/^https?:/i.test(href)) {
      link.target = '_blank';
      link.rel = 'noreferrer';
    }
    linkRoot.append(link);
  });
};

const loadConfigs = async () => {
  const responses = await Promise.all([
    fetch('./config/site.json'),
    fetch('./config/languages.json'),
    fetch('./config/content.zh-CN.json'),
  ]);
  const failed = responses.find((response) => !response.ok);
  if (failed) throw new Error(`Unable to load project configuration: ${failed.status}`);
  const [site, languages, content] = await Promise.all(responses.map((response) => response.json()));
  const defaults = { site, languages, appearance: defaultAppearance };
  let settings = validateSettings(defaults, defaults);
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (stored) {
    try {
      settings = validateSettings(JSON.parse(stored), defaults);
    } catch (error) {
      console.warn('Ignoring invalid local settings:', error.message);
    }
  }
  applyAppearance(settings.appearance);
  applySiteConfig(settings.site);
  Object.entries(settings.languages).forEach(([id, item]) => {
    const button = document.querySelector(`[data-country="${id}"]`);
    if (!button) return;
    button.hidden = !item.enabled;
    button.setAttribute('aria-label', `${item.country} · ${item.language}`);
    button.querySelector('small').textContent = item.language;
  });
  return { ...settings, content, defaults };
};

const initReveal = () => {
  const nodes = [...document.querySelectorAll('.reveal')];
  if (!motionEnabled || !('IntersectionObserver' in window)) {
    nodes.forEach((node) => node.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
  nodes.forEach((node) => observer.observe(node));
  let frame = 0;
  const revealPassedSections = () => {
    frame = 0;
    nodes.forEach((node) => {
      if (node.classList.contains('is-visible') || node.getBoundingClientRect().top >= window.innerHeight * .94) return;
      node.classList.add('is-visible');
      observer.unobserve(node);
    });
  };
  window.addEventListener('scroll', () => {
    if (frame) return;
    frame = requestAnimationFrame(revealPassedSections);
  }, { passive: true });
  revealPassedSections();
};

const initTheme = (config) => {
  const button = document.querySelector('.theme-toggle');
  const updateLabel = () => {
    const label = root.dataset.theme === 'light' ? '切换深色模式' : '切换浅色模式';
    button?.setAttribute('aria-label', label);
    button?.setAttribute('title', label);
  };
  updateLabel();
  button?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    config.appearance.theme = root.dataset.theme;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ version: 1, site: config.site, appearance: config.appearance, languages: config.languages }));
    updateLabel();
    window.dispatchEvent(new Event('site-theme-change'));
  });
};

const initMobileMenu = () => {
  const menu = document.querySelector('#mobile-menu');
  const toggle = document.querySelector('.menu-toggle');
  const setOpen = (open) => {
    menu?.setAttribute('data-open', String(open));
    toggle?.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle?.addEventListener('click', () => setOpen(true));
  menu?.querySelector('.menu-close')?.addEventListener('click', () => setOpen(false));
  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setOpen(false); });
};

const initSettings = (config) => {
  const drawer = document.querySelector('[data-settings-drawer]');
  const backdrop = document.querySelector('[data-settings-backdrop]');
  const toggle = document.querySelector('.settings-toggle');
  const form = document.querySelector('[data-settings-form]');
  const status = document.querySelector('[data-settings-status]');
  const languageRoot = document.querySelector('[data-language-settings]');
  const confirm = document.querySelector('[data-settings-confirm]');
  const importInput = document.querySelector('[data-settings-import]');
  const activeSettings = {
    version: 1,
    site: clone(config.site),
    appearance: clone(config.appearance),
    languages: clone(config.languages),
  };
  const setOpen = (open) => {
    drawer?.setAttribute('data-open', String(open));
    drawer?.setAttribute('aria-hidden', String(!open));
    backdrop?.setAttribute('data-open', String(open));
    toggle?.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('settings-open', open);
    if (open) window.setTimeout(() => form?.querySelector('input')?.focus(), 120);
  };
  const setStatus = (message, kind = '') => {
    if (!status) return;
    status.textContent = message;
    status.dataset.kind = kind;
  };
  const setField = (name, value) => {
    const field = form?.elements.namedItem(name);
    if (!field) return;
    if (field.type === 'checkbox') field.checked = Boolean(value);
    else field.value = String(value ?? '');
  };
  const populate = (settings) => {
    setField('brand.name', settings.site.brand.name);
    setField('brand.title', settings.site.brand.title);
    setField('brand.description', settings.site.brand.description);
    setField('links.github', settings.site.links.github);
    setField('links.creator', settings.site.links.creator);
    setField('links.friendship', settings.site.links.friendship);
    setField('links.email', settings.site.links.email);
    setField('appearance.accent', settings.appearance.accent);
    setField('appearance.sourceAccent', settings.appearance.sourceAccent);
    setField('appearance.theme', settings.appearance.theme);
    setField('appearance.autoRotateSpeed', settings.appearance.autoRotateSpeed);
    setField('appearance.motion', settings.appearance.motion);
    const output = form?.querySelector('[data-speed-output]');
    if (output) output.textContent = Number(settings.appearance.autoRotateSpeed).toFixed(1);
  };
  const renderLanguages = (languages) => {
    if (!languageRoot) return;
    languageRoot.replaceChildren();
    Object.entries(languages).forEach(([id, item], index) => {
      const row = document.createElement('fieldset');
      row.className = 'language-setting';
      row.innerHTML = `
        <legend><span>${String(index + 1).padStart(2, '0')}</span>${escapeHtml(item.country)} · ${escapeHtml(item.language)}</legend>
        <label class="settings-check"><input type="checkbox" name="languages.${id}.enabled"><span><b>在地球上显示</b></span></label>
        <label><span>国家</span><input name="languages.${id}.country" maxlength="30"></label>
        <label><span>语言</span><input name="languages.${id}.language" maxlength="30"></label>
        <label class="settings-wide"><span>对话样例</span><input name="languages.${id}.sample" maxlength="100"></label>
        <label class="settings-wide"><span>情绪提示</span><input name="languages.${id}.nuance" maxlength="100"></label>`;
      languageRoot.append(row);
      setField(`languages.${id}.enabled`, item.enabled);
      setField(`languages.${id}.country`, item.country);
      setField(`languages.${id}.language`, item.language);
      setField(`languages.${id}.sample`, item.sample);
      setField(`languages.${id}.nuance`, item.nuance);
    });
  };
  const readForm = () => {
    const value = (name) => form.elements.namedItem(name)?.value ?? '';
    const checked = (name) => Boolean(form.elements.namedItem(name)?.checked);
    const candidate = {
      version: 1,
      site: {
        brand: { name: value('brand.name'), title: value('brand.title'), description: value('brand.description') },
        links: { github: value('links.github'), creator: value('links.creator'), friendship: value('links.friendship'), email: value('links.email') },
      },
      appearance: {
        accent: value('appearance.accent'),
        sourceAccent: value('appearance.sourceAccent'),
        theme: value('appearance.theme'),
        autoRotateSpeed: Number(value('appearance.autoRotateSpeed')),
        motion: checked('appearance.motion'),
      },
      languages: {},
    };
    Object.keys(config.defaults.languages).forEach((id) => {
      candidate.languages[id] = {
        country: value(`languages.${id}.country`),
        language: value(`languages.${id}.language`),
        sample: value(`languages.${id}.sample`),
        nuance: value(`languages.${id}.nuance`),
        enabled: checked(`languages.${id}.enabled`),
      };
    });
    return validateSettings(candidate, config.defaults);
  };

  populate(activeSettings);
  renderLanguages(activeSettings.languages);
  toggle?.addEventListener('click', () => setOpen(true));
  drawer?.querySelector('[data-settings-close]')?.addEventListener('click', () => setOpen(false));
  backdrop?.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setOpen(false); });
  form?.elements.namedItem('appearance.autoRotateSpeed')?.addEventListener('input', (event) => {
    const output = form.querySelector('[data-speed-output]');
    if (output) output.textContent = Number(event.target.value).toFixed(1);
  });
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const settings = readForm();
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      setStatus('已保存，正在应用设置…', 'success');
      window.location.reload();
    } catch (error) {
      setStatus(error.message, 'error');
    }
  });
  form?.querySelector('[data-settings-export]')?.addEventListener('click', () => {
    try {
      const settings = readForm();
      const blob = new Blob([`${JSON.stringify(settings, null, 2)}\n`], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'easyglobe-settings.json';
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      setStatus('设置已导出。', 'success');
    } catch (error) {
      setStatus(error.message, 'error');
    }
  });
  form?.querySelector('[data-settings-import-trigger]')?.addEventListener('click', () => importInput?.click());
  importInput?.addEventListener('change', async () => {
    const file = importInput.files?.[0];
    if (!file) return;
    try {
      const settings = validateSettings(JSON.parse(await file.text()), config.defaults);
      populate(settings);
      renderLanguages(settings.languages);
      setStatus('导入成功。检查后点击“保存设置”即可应用。', 'success');
    } catch (error) {
      setStatus(`导入失败：${error.message}`, 'error');
    } finally {
      importInput.value = '';
    }
  });
  form?.querySelector('[data-settings-reset]')?.addEventListener('click', () => confirm?.setAttribute('data-open', 'true'));
  form?.querySelector('[data-settings-reset-cancel]')?.addEventListener('click', () => confirm?.setAttribute('data-open', 'false'));
  form?.querySelector('[data-settings-reset-confirm]')?.addEventListener('click', () => {
    localStorage.removeItem(SETTINGS_KEY);
    window.location.reload();
  });
};

const initDeliverables = (deliverables) => {
  const preview = document.querySelector('[data-deliverable-preview]');
  document.querySelectorAll('[data-deliverable]').forEach((button) => button.addEventListener('click', () => {
    const item = deliverables[button.dataset.deliverable];
    if (!item || !preview) return;
    document.querySelectorAll('[data-deliverable]').forEach((tab) => tab.setAttribute('aria-selected', String(tab === button)));
    preview.classList.remove('is-switching');
    preview.innerHTML = `<div class="preview-toolbar"><i></i><i></i><i></i><span>${escapeHtml(item.path)}</span></div><div class="document-preview"><p class="doc-kicker">${escapeHtml(item.kicker)}</p><h3>${escapeHtml(item.title)}</h3><div class="parallel-copy"><p><span>原文</span>${escapeHtml(item.source)}</p><p><span>译文</span>${escapeHtml(item.target)}</p></div><div class="review-note"><b>语气说明</b><p>${escapeHtml(item.note)}</p></div></div>`;
    requestAnimationFrame(() => preview.classList.add('is-switching'));
  }));
};

const initWorkspace = (workspaceFiles) => {
  const preview = document.querySelector('[data-workspace-preview]');
  document.querySelectorAll('[data-workspace]').forEach((button) => button.addEventListener('click', () => {
    const item = workspaceFiles[button.dataset.workspace];
    if (!item || !preview) return;
    document.querySelectorAll('[data-workspace]').forEach((node) => {
      node.classList.toggle('is-active', node === button);
      node.setAttribute('aria-pressed', String(node === button));
    });
    preview.innerHTML = `<div class="editor-path">${escapeHtml(item.path)} <span>SAVED</span></div><div class="editor-content"><p class="line-no">01</p><div><h3>${escapeHtml(item.title)}</h3>${item.lines.map((line) => `<p>${escapeHtml(line)}</p>`).join('')}<div class="memory-token"><span>已连接</span> ${escapeHtml(item.memory)}</div></div></div>`;
  }));
};

const initAutomation = (automationFlows) => {
  const flow = document.querySelector('[data-automation-flow]');
  document.querySelectorAll('[data-automation]').forEach((button) => button.addEventListener('click', () => {
    const items = automationFlows[button.dataset.automation];
    if (!items || !flow) return;
    document.querySelectorAll('[data-automation]').forEach((node) => {
      node.classList.toggle('is-active', node === button);
      node.setAttribute('aria-pressed', String(node === button));
    });
    flow.innerHTML = `<div class="flow-line"></div>${items.map((item, index) => `<article style="animation-delay:${index * 70}ms"><span>0${index + 1}</span><b>${escapeHtml(item[0])}</b><small>${escapeHtml(item[1])}</small><i>${escapeHtml(item[2])}</i></article>`).join('')}`;
  }));
};

const initFaq = () => {
  document.querySelectorAll('.faq-item button').forEach((button) => button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const opening = !item.classList.contains('is-open');
    document.querySelectorAll('.faq-item').forEach((row) => {
      row.classList.remove('is-open');
      row.querySelector('button')?.setAttribute('aria-expanded', 'false');
      const sign = row.querySelector('button i');
      if (sign) sign.textContent = '+';
    });
    if (!opening) return;
    item.classList.add('is-open');
    button.setAttribute('aria-expanded', 'true');
    const sign = button.querySelector('i');
    if (sign) sign.textContent = '−';
  }));
};

const initLanguageGlobe = async (languageConfig) => {
  const canvas = document.querySelector('[data-language-globe]');
  const stage = document.querySelector('[data-language-globe-root]');
  if (!canvas || !stage || !window.d3) return;
  const configuredSpeed = Number(document.documentElement.dataset.globeSpeed || defaultAppearance.autoRotateSpeed);
  const [{ land, dots }, countryData] = await Promise.all([
    import('./assets/globe-data.js'),
    fetch('./assets/language-countries.json').then((response) => response.json()),
  ]);
  const context = canvas.getContext('2d');
  const routeLayer = stage.querySelector('.globe-route-layer');
  const routeLine = stage.querySelector('[data-language-route-line]');
  const routeGlow = stage.querySelector('[data-language-route-glow]');
  const countryButtons = [...stage.querySelectorAll('[data-country]')].filter((button) => languageConfig[button.dataset.country]?.enabled !== false);
  const countryPreview = stage.querySelector('[data-country-preview]');
  const swapButton = stage.querySelector('[data-swap-languages]');
  const resetButton = stage.querySelector('[data-reset-languages]');
  const projection = window.d3.geoOrthographic().precision(.4).clipAngle(90).rotate([24, -11]);
  const path = window.d3.geoPath(projection, context);
  const graticule = window.d3.geoGraticule10();
  const sphere = { type: 'Sphere' };
  const features = new Map(countryData.features.map((feature) => [feature.properties.id, feature]));
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let source = null;
  let target = null;
  let hovered = null;
  let dragging = false;
  let moved = false;
  let pointerStart = null;
  let rotationStart = null;
  let resumeAt = performance.now() + 5000;
  let targetRotation = null;
  let lastTime = performance.now();

  const palette = () => root.dataset.theme === 'light'
    ? { rim: 'rgba(23,33,30,.35)', grid: 'rgba(23,33,30,.16)', land: 'rgba(23,33,30,.55)', dot: 'rgba(23,33,30,.64)', soft: 'rgba(23,33,30,.08)' }
    : { rim: 'rgba(225,232,228,.36)', grid: 'rgba(201,212,208,.16)', land: 'rgba(225,232,228,.72)', dot: 'rgba(220,230,227,.74)', soft: 'rgba(220,230,227,.07)' };

  const resize = () => {
    const rect = stage.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    routeLayer?.setAttribute('viewBox', `0 0 ${width} ${height}`);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    projection.translate([width * .49, height * .48]).scale(Math.min(width * .37, height * .46));
  };

  const visible = (coordinate) => {
    const rotation = projection.rotate();
    return window.d3.geoDistance(coordinate, [-rotation[0], -rotation[1]]) < Math.PI / 2;
  };

  const drawFeature = (feature, fill, stroke, lineWidth = 1) => {
    if (!feature) return;
    context.beginPath();
    path(feature);
    context.fillStyle = fill;
    context.fill();
    context.strokeStyle = stroke;
    context.lineWidth = lineWidth;
    context.stroke();
  };

  const draw = () => {
    const color = palette();
    context.clearRect(0, 0, width, height);
    context.beginPath(); path(sphere); context.fillStyle = color.soft; context.fill(); context.strokeStyle = color.rim; context.lineWidth = 1.15; context.stroke();
    context.beginPath(); path(graticule); context.strokeStyle = color.grid; context.lineWidth = .72; context.stroke();
    context.beginPath(); path(land); context.strokeStyle = color.land; context.lineWidth = 1; context.stroke();

    context.fillStyle = color.dot;
    for (let index = 0; index < dots.length; index += 1) {
      const dot = dots[index];
      if (!visible(dot)) continue;
      const point = projection(dot);
      if (!point) continue;
      context.beginPath(); context.arc(point[0], point[1], .95, 0, Math.PI * 2); context.fill();
    }

    countryButtons.forEach((button) => {
      const id = button.dataset.country;
      const anchor = languageConfig[id]?.anchor;
      if (!anchor) return;
      const isVisible = visible(anchor);
      button.dataset.geoBound = 'true';
      button.dataset.visible = String(isVisible);
      button.setAttribute('aria-hidden', String(!isVisible));
      if (!isVisible) {
        if (hovered === id && countryPreview) countryPreview.dataset.open = 'false';
        return;
      }
      const point = projection(anchor);
      button.style.left = `${point[0]}px`;
      button.style.top = `${point[1]}px`;
      if (hovered === id && countryPreview) {
        countryPreview.style.left = `${Math.min(width - 245, Math.max(10, point[0] + 12))}px`;
        countryPreview.style.top = `${Math.min(height - 155, Math.max(10, point[1] + 12))}px`;
      }
    });

    let routePath = '';
    if (source && target) {
      const interpolate = window.d3.geoInterpolate(languageConfig[source].anchor, languageConfig[target].anchor);
      const route = { type: 'LineString', coordinates: Array.from({ length: 81 }, (_, index) => interpolate(index / 80)) };
      routePath = window.d3.geoPath(projection)(route) || '';
    }
    routeLine?.setAttribute('d', routePath);
    routeGlow?.setAttribute('d', routePath);

    const accent = getComputedStyle(root).getPropertyValue('--accent').trim();
    const sourceAccent = getComputedStyle(root).getPropertyValue('--accent-2').trim();
    if (hovered && hovered !== source && hovered !== target) drawFeature(features.get(hovered), `${accent}1a`, accent, 1.25);
    drawFeature(features.get(source), `${sourceAccent}33`, sourceAccent, 1.6);
    drawFeature(features.get(target), `${accent}38`, accent, 1.7);
    [source, target].filter(Boolean).forEach((id) => {
      const anchor = languageConfig[id].anchor;
      if (!visible(anchor)) return;
      const point = projection(anchor);
      const selectedColor = id === source ? sourceAccent : accent;
      context.beginPath(); context.arc(point[0], point[1], 4, 0, Math.PI * 2); context.fillStyle = selectedColor; context.fill();
      context.beginPath(); context.arc(point[0], point[1], 10, 0, Math.PI * 2); context.strokeStyle = `${selectedColor}8c`; context.stroke();
    });
  };

  const focusPair = (sourceId, targetId) => {
    const midpoint = window.d3.geoInterpolate(languageConfig[sourceId].anchor, languageConfig[targetId].anchor)(.5);
    targetRotation = [-midpoint[0], -midpoint[1], 0];
    resumeAt = performance.now() + 5200;
  };

  const updateSelection = () => {
    stage.querySelectorAll('[data-country]').forEach((button) => {
      button.classList.toggle('is-source', button.dataset.country === source);
      button.classList.toggle('is-target', button.dataset.country === target);
    });
    const status = stage.querySelector('.language-globe-status');
    const card = stage.querySelector('[data-compare-card]');
    const route = stage.querySelector('.compare-route');
    const sourceCopy = stage.querySelector('.compare-source');
    const targetCopy = stage.querySelector('.compare-target');
    if (swapButton) swapButton.disabled = !(source && target);
    if (resetButton) resetButton.disabled = !source;
    if (source && target) {
      stage.dataset.routeState = 'active';
      status.textContent = `${languageConfig[source].language} → ${languageConfig[target].language}`;
      route.textContent = `${languageConfig[source].language} → ${languageConfig[target].language}`;
      sourceCopy.textContent = `“${languageConfig[source].sample}” · ${languageConfig[source].nuance}`;
      targetCopy.textContent = `“${languageConfig[target].sample}” · ${languageConfig[target].nuance}`;
      card.classList.add('is-ready');
    } else if (source) {
      stage.dataset.routeState = 'idle';
      status.textContent = `原语言：${languageConfig[source].language} · 请选择目标语言`;
      route.textContent = `${languageConfig[source].language} → ?`;
      sourceCopy.textContent = `“${languageConfig[source].sample}” · ${languageConfig[source].nuance}`;
      targetCopy.textContent = '点击另一个国家建立语言对比';
      card.classList.remove('is-ready');
    } else {
      stage.dataset.routeState = 'idle';
      status.textContent = '选择原语言，再选择目标语言';
    }
    draw();
  };

  countryButtons.forEach((button) => {
    const showPreview = () => {
      const id = button.dataset.country;
      const item = languageConfig[id];
      hovered = id;
      resumeAt = performance.now() + 2600;
      if (!countryPreview || !item) return;
      countryPreview.innerHTML = `<span>COUNTRY SIGNAL</span><strong>${escapeHtml(item.country)} · ${escapeHtml(item.language)}</strong><p>“${escapeHtml(item.sample)}”</p><small>${escapeHtml(item.nuance)}</small>`;
      countryPreview.dataset.open = button.dataset.visible === 'true' ? 'true' : 'false';
    };
    const hidePreview = () => {
      if (hovered === button.dataset.country) hovered = null;
      if (countryPreview) countryPreview.dataset.open = 'false';
    };
    button.addEventListener('pointerenter', showPreview);
    button.addEventListener('focus', showPreview);
    button.addEventListener('pointerleave', hidePreview);
    button.addEventListener('blur', hidePreview);
    button.addEventListener('click', () => {
      const id = button.dataset.country;
      if (!source || target) {
        source = id;
        target = null;
        resumeAt = performance.now() + 4200;
      } else if (source === id) {
        source = null;
        target = null;
      } else {
        target = id;
        focusPair(source, target);
      }
      updateSelection();
    });
  });

  swapButton?.addEventListener('click', () => {
    if (!source || !target) return;
    [source, target] = [target, source];
    focusPair(source, target);
    updateSelection();
  });
  resetButton?.addEventListener('click', () => {
    source = null;
    target = null;
    hovered = null;
    if (countryPreview) countryPreview.dataset.open = 'false';
    updateSelection();
  });

  canvas.addEventListener('pointerdown', (event) => {
    dragging = true; moved = false; pointerStart = [event.clientX, event.clientY]; rotationStart = projection.rotate(); targetRotation = null; canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const dx = event.clientX - pointerStart[0];
    const dy = event.clientY - pointerStart[1];
    moved ||= Math.abs(dx) + Math.abs(dy) > 3;
    projection.rotate([rotationStart[0] + dx * .22, Math.max(-70, Math.min(70, rotationStart[1] - dy * .18)), 0]);
    resumeAt = performance.now() + 3500;
  });
  const releasePointer = (event) => { dragging = false; if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId); };
  canvas.addEventListener('pointerup', releasePointer);
  canvas.addEventListener('pointercancel', releasePointer);

  const animate = (time) => {
    const delta = Math.min(32, time - lastTime);
    lastTime = time;
    if (targetRotation) {
      const current = projection.rotate();
      const next = current.map((value, index) => value + (targetRotation[index] - value) * .075);
      projection.rotate(next);
      if (Math.abs(next[0] - targetRotation[0]) + Math.abs(next[1] - targetRotation[1]) < .2) targetRotation = null;
    } else if (!dragging && motionEnabled && time > resumeAt) {
      const rotation = projection.rotate();
      projection.rotate([rotation[0] + delta * Number(configuredSpeed) / 1000, rotation[1], 0]);
    }
    draw();
    requestAnimationFrame(animate);
  };
  resize();
  new ResizeObserver(resize).observe(stage);
  window.addEventListener('site-theme-change', draw);
  requestAnimationFrame(animate);
};

const boot = async () => {
  const config = await loadConfigs();
  initTheme(config);
  initMobileMenu();
  initSettings(config);
  initReveal();
  initDeliverables(config.content.deliverables);
  initWorkspace(config.content.workspaceFiles);
  initAutomation(config.content.automationFlows);
  initFaq();
  await initLanguageGlobe(config.languages);
};

boot().catch((error) => {
  console.error(error);
  document.querySelectorAll('.reveal').forEach((node) => node.classList.add('is-visible'));
});
