import { component$, createContextId, useContextProvider, useSignal, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { RouterHead } from './components/router-head/router-head';
import { Effect } from './utils/rain';
import { type WindowManager, windowManager } from './managers/window-manager';
import { type DesktopManager, desktopManager } from './managers/desktop-manager';
import { type FileSystemManager, fsManager } from './managers/file-system/manager';

import './global.css';

export type SystemManagerStore = {
	fsManager: FileSystemManager;
	desktopManager: DesktopManager;
	windowManager: WindowManager;
};

export const SystemContext = createContextId<SystemManagerStore>('system');

export default component$(() => {
	const canvasSignal = useSignal<HTMLCanvasElement | undefined>(undefined);
	const systemState = useStore<SystemManagerStore>({ fsManager, desktopManager, windowManager });

	useContextProvider(SystemContext, systemState);

	useVisibleTask$(async () => {
		await systemState.fsManager.initialize();
		await systemState.desktopManager.load(systemState.fsManager);
	});

	useVisibleTask$(({ track }) => {
		track(() => canvasSignal.value);
		if (!canvasSignal.value) return;

		const canvas = canvasSignal.value!;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const effect = new Effect(canvas.width, canvas.height);

		let lastTime = 0;
		const fps = 30;
		const nextFrame = 1000 / fps;
		let timer = 0;

		const animate = (timeStamp: number) => {
			const deltaTime = timeStamp - lastTime;
			lastTime = timeStamp;
			if (timer > nextFrame) {
				ctx.fillStyle = `rgba(0, 0, 0, 0.05)`;
				ctx.textAlign = 'center';
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.fillStyle = '#0aff0a';
				ctx.font = (effect.fontSize ?? 12) + 'px monospace';
				effect.symbols.forEach((sym) => sym.draw(ctx));
				timer = 0;
			} else {
				timer += deltaTime;
			}

			requestAnimationFrame(animate);
		};

		animate(0);
		systemState.desktopManager.resize(canvas.width, canvas.height);
	});

	return (
		<QwikCityProvider>
			<head>
				<meta charSet='utf-8' />
				<link rel='manifest' href='/manifest.json' />
				<RouterHead />
			</head>
			<body lang='en'>
				<canvas ref={canvasSignal}></canvas>
				<main>
					<RouterOutlet />
				</main>
				<ServiceWorkerRegister />
			</body>
		</QwikCityProvider>
	);
});
