import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function initSculpture() {
  const stages = [
    ...document.querySelectorAll<HTMLElement>('[data-sculpture]'),
  ];
  if (!stages.length) return;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('webgl2', {
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
  });
  if (!context) {
    stages.forEach((stage) => (stage.dataset.renderState = 'fallback'));
    return;
  }
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      context,
      alpha: true,
      antialias: true,
    });
  } catch {
    stages.forEach((stage) => (stage.dataset.renderState = 'fallback'));
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.45;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0.1, 9.5);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04);
  scene.environment = environment.texture;
  room.dispose();
  pmrem.dispose();
  const metal = new THREE.MeshPhysicalMaterial({
    color: '#e1e5ec',
    metalness: 1,
    roughness: 0.17,
    clearcoat: 1,
    clearcoatRoughness: 0.13,
    envMapIntensity: 1.5,
  });
  const blue = new THREE.MeshPhysicalMaterial({
    color: '#214cff',
    metalness: 0.3,
    roughness: 0.16,
    clearcoat: 1,
    emissive: '#0c1b70',
    emissiveIntensity: 0.13,
  });
  const assembly = new THREE.Group();
  scene.add(assembly);
  const labels = JSON.parse(
    stages[0].dataset.layerLabels || '["INTERFACE", "LOGIC", "DATA"]',
  ) as string[];
  const plateGeometry = new RoundedBoxGeometry(2.8, 0.2, 2.2, 3, 0.08);
  const panelGeometry = new THREE.PlaneGeometry(2.55, 1.95);
  const labelGeometry = new THREE.PlaneGeometry(2.45, 0.15);
  const spineGeometry = new THREE.CylinderGeometry(0.035, 0.035, 1, 12);
  const textures: THREE.CanvasTexture[] = [];
  const panelMaterials: THREE.MeshBasicMaterial[] = [];
  const panelCanvases: HTMLCanvasElement[] = [];
  const labelCanvases: HTMLCanvasElement[] = [];
  const roundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    radius: number,
    fill: string,
  ) => {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.fill();
  };
  const createTexture = (canvas: HTMLCanvasElement) => {
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    textures.push(texture);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      toneMapped: false,
    });
    panelMaterials.push(material);
    return material;
  };
  const pieces = [0, 1, 2].map(() => {
    const group = new THREE.Group();
    group.add(new THREE.Mesh(plateGeometry, metal));
    const panelCanvas = document.createElement('canvas');
    panelCanvas.width = 768;
    panelCanvas.height = 576;
    panelCanvases.push(panelCanvas);
    const panel = new THREE.Mesh(panelGeometry, createTexture(panelCanvas));
    panel.rotation.x = -Math.PI / 2;
    panel.position.y = 0.102;
    group.add(panel);
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 768;
    labelCanvas.height = 64;
    labelCanvases.push(labelCanvas);
    const label = new THREE.Mesh(labelGeometry, createTexture(labelCanvas));
    label.position.set(0, 0, 1.102);
    group.add(label);
    assembly.add(group);
    return group;
  });
  const spines = [-1, 1].map((side) => {
    const mesh = new THREE.Mesh(spineGeometry, blue);
    mesh.position.set(side * 1.1, 0, -0.8);
    assembly.add(mesh);
    return mesh;
  });
  const paintPanels = (dark: boolean) => {
    const background = dark ? '#1c2434' : '#f0f3f9',
      ink = dark ? '#dfe8ff' : '#24314c',
      muted = dark ? '#65738e' : '#c7d1e2';
    panelCanvases.forEach((canvas, index) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, 768, 576);
      ctx.fillStyle = ink;
      ctx.font = '500 29px monospace';
      ctx.fillText(`0${index + 1} / ${labels[index]}`, 50, 60);
      if (index === 0) {
        roundedRect(ctx, 48, 105, 672, 410, 18, dark ? '#273249' : '#ffffff');
        roundedRect(ctx, 48, 105, 672, 48, 18, muted);
        [72, 92, 112].forEach((x) => {
          ctx.fillStyle = '#214cff';
          ctx.beginPath();
          ctx.arc(x, 129, 5, 0, Math.PI * 2);
          ctx.fill();
        });
        roundedRect(ctx, 79, 185, 152, 298, 8, background);
        [207, 246, 285, 324].forEach((y) =>
          roundedRect(ctx, 96, y, 112, 11, 5, muted),
        );
        roundedRect(ctx, 260, 185, 290, 21, 7, ink);
        roundedRect(ctx, 260, 228, 403, 12, 5, muted);
        roundedRect(ctx, 260, 265, 192, 105, 10, '#214cff');
        roundedRect(ctx, 471, 265, 192, 105, 10, background);
        [405, 437, 469].forEach((y) =>
          roundedRect(ctx, 260, y, 403, 12, 5, muted),
        );
      } else if (index === 1) {
        ctx.strokeStyle = muted;
        ctx.lineWidth = 5;
        [
          [110, 200],
          [658, 200],
          [110, 420],
          [658, 420],
        ].forEach(([x, y]) => {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x < 384 ? 270 : 498, y);
          ctx.lineTo(x < 384 ? 270 : 498, 310);
          ctx.stroke();
        });
        roundedRect(ctx, 267, 198, 234, 224, 26, '#214cff');
        ctx.fillStyle = '#ffffff';
        ctx.font = '600 80px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('{ }', 384, 332);
        ctx.textAlign = 'left';
        [
          [100, 190],
          [648, 190],
          [100, 410],
          [648, 410],
        ].forEach(([x, y]) => roundedRect(ctx, x, y, 20, 20, 5, '#214cff'));
      } else {
        ctx.strokeStyle = muted;
        ctx.lineWidth = 3;
        [170, 384, 598].forEach((x, i) => {
          ctx.fillStyle = i === 1 ? '#214cff' : muted;
          ctx.fillRect(x - 64, 238, 128, 160);
          [238, 292, 346, 398].forEach((y) => {
            ctx.beginPath();
            ctx.ellipse(x, y, 64, 24, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          });
          ctx.fillStyle = ink;
          ctx.font = '22px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(['RELATIONAL', 'STORAGE', 'QUEUES'][i], x, 468);
          ctx.textAlign = 'left';
        });
      }
      const labelCtx = labelCanvases[index].getContext('2d');
      if (labelCtx) {
        labelCtx.fillStyle = dark ? '#55627a' : '#bec9db';
        labelCtx.fillRect(0, 0, 768, 64);
        labelCtx.fillStyle = dark ? '#ffffff' : '#14284c';
        labelCtx.font = '600 34px monospace';
        labelCtx.fillText(`0${index + 1}   ${labels[index]}`, 36, 46);
      }
    });
    textures.forEach((texture) => (texture.needsUpdate = true));
  };
  const key = new THREE.DirectionalLight('#ffffff', 4);
  key.position.set(-3, 5, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight('#8fa8ff', 5);
  rim.position.set(4, 1, -2);
  scene.add(rim);
  const fill = new THREE.DirectionalLight('#ffffff', 2);
  fill.position.set(1, -3, 2);
  scene.add(fill);
  let target = stages[0];
  let progress = 0,
    currentProgress = 0,
    frame = 0,
    lastTime = 0,
    elapsed = 0,
    intro = 0;
  let disposed = false,
    contextLost = false;
  const visibility = new Map(stages.map((stage) => [stage, false]));
  const pointer = new THREE.Vector2(),
    smoothPointer = new THREE.Vector2();
  const setTheme = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    metal.color.set(dark ? '#a4afc4' : '#e1e5ec');
    paintPanels(dark);
    metal.envMapIntensity = dark ? 1.8 : 1.5;
    renderer.toneMappingExposure = dark ? 1.5 : 1.25;
    rim.intensity = dark ? 6 : 3;
    key.intensity = dark ? 3 : 4;
  };
  setTheme();
  document.addEventListener('portfolio:theme', setTheme);
  const resize = () => {
    const rect = target.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.position.z = camera.aspect < 1 ? 10.6 : 9.1;
    camera.updateProjectionMatrix();
  };
  const mount = (stage: HTMLElement) => {
    target.dataset.renderState = 'fallback';
    target = stage;
    target.querySelector('.sculpture-render')?.append(canvas);
    resize();
    target.dataset.renderState = 'webgl';
  };
  mount(target);
  const canRender = () =>
    !disposed &&
    !contextLost &&
    !document.hidden &&
    [...visibility.values()].some(Boolean);
  const animate = (time: number) => {
    frame = 0;
    if (!canRender()) {
      target.dataset.sceneState = 'paused';
      return;
    }
    const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
    lastTime = time;
    elapsed += dt;
    intro = Math.min(1, intro + dt / 1.2);
    currentProgress = THREE.MathUtils.damp(
      currentProgress,
      target.dataset.sculpture === 'process' ? progress : 0,
      7,
      dt,
    );
    smoothPointer.lerp(pointer, 0.04);
    const easing = 1 - Math.pow(1 - intro, 3);
    const spread = Math.sin((currentProgress * Math.PI) / 2);
    assembly.rotation.set(
      0.54 + smoothPointer.y * 0.08 + spread * 0.08,
      -0.5 + Math.sin(elapsed * 0.25) * 0.07 + smoothPointer.x * 0.12,
      -0.045 + smoothPointer.x * 0.02,
    );
    assembly.position.y = Math.sin(elapsed * 0.8) * 0.035;
    assembly.scale.setScalar(0.85 + easing * 0.15);
    const spacing = 0.66 + spread * 0.55 + (1 - easing) * 0.6;
    pieces.forEach((piece, index) => {
      piece.position.y = (1 - index) * spacing;
      piece.position.x = (index - 1) * spread * 0.2;
      piece.rotation.y = (index - 1) * spread * 0.06;
    });
    spines.forEach((spine) => (spine.scale.y = spacing * 2));
    target.dataset.sceneState = 'running';
    renderer.render(scene, camera);
    frame = requestAnimationFrame(animate);
  };
  const resume = () => {
    if (canRender() && !frame) {
      lastTime = 0;
      frame = requestAnimationFrame(animate);
    }
  };
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) =>
        visibility.set(entry.target as HTMLElement, entry.isIntersecting),
      );
      const visible = [...stages]
        .reverse()
        .find((stage) => visibility.get(stage));
      if (visible && visible !== target) mount(visible);
      if (canRender()) resume();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
        lastTime = 0;
        stages.forEach((stage) => (stage.dataset.sceneState = 'paused'));
      }
    },
    { threshold: 0.05 },
  );
  stages.forEach((stage) => observer.observe(stage));
  const resizeObserver = new ResizeObserver(resize);
  stages.forEach((stage) => resizeObserver.observe(stage));
  const move = (event: PointerEvent) => {
    const rect = target.getBoundingClientRect();
    pointer.set(
      (event.clientX - rect.left) / rect.width - 0.5,
      (event.clientY - rect.top) / rect.height - 0.5,
    );
  };
  const leave = () => pointer.set(0, 0);
  stages.forEach((stage) => {
    stage.addEventListener('pointermove', move);
    stage.addEventListener('pointerleave', leave);
  });
  const onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
      target.dataset.sceneState = 'paused';
    } else resume();
  };
  document.addEventListener('visibilitychange', onVisibility);
  const lost = (event: Event) => {
    event.preventDefault();
    contextLost = true;
    cancelAnimationFrame(frame);
    frame = 0;
    target.dataset.renderState = 'fallback';
    target.dataset.sceneState = 'paused';
  };
  const restored = () => {
    contextLost = false;
    target.dataset.renderState = 'webgl';
    resume();
  };
  canvas.addEventListener('webglcontextlost', lost);
  canvas.addEventListener('webglcontextrestored', restored);
  return {
    setProgress(value: number) {
      progress = value;
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      document.removeEventListener('portfolio:theme', setTheme);
      stages.forEach((stage) => {
        stage.removeEventListener('pointermove', move);
        stage.removeEventListener('pointerleave', leave);
        stage.dataset.renderState = 'fallback';
        stage.dataset.sceneState = 'paused';
      });
      canvas.removeEventListener('webglcontextlost', lost);
      canvas.removeEventListener('webglcontextrestored', restored);
      plateGeometry.dispose();
      panelGeometry.dispose();
      labelGeometry.dispose();
      spineGeometry.dispose();
      textures.forEach((texture) => texture.dispose());
      panelMaterials.forEach((material) => material.dispose());
      metal.dispose();
      blue.dispose();
      environment.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
