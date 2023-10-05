import { QRL } from '@builder.io/qwik';

export class CodeSymbol {
	characters: string;
	x: number;
	y: number;
	fontSize: number;
	canvasHeight: number;
	active: string = '';

	constructor(x: number, y: number, fontSize: number, canvasHeight: number) {
		this.characters = `アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥク
      スツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴ
      ッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ`;
		this.x = x;
		this.y = y;
		this.fontSize = fontSize;
		this.canvasHeight = canvasHeight;
	}

	draw(context: CanvasRenderingContext2D) {
		this.active = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
		context.fillText(this.active, this.x * this.fontSize, this.y * this.fontSize);

		if (this.y * this.fontSize > this.canvasHeight && Math.random() > 0.98) {
			this.y = 0;
		} else {
			++this.y;
		}
	}
}

export class Effect {
	width: number;
	height: number;
	fontSize: number = 15;
	columns: number;
	symbols: CodeSymbol[] = [];

	constructor(canvasWidth: number, canvasHeight: number) {
		this.width = canvasWidth;
		this.height = canvasHeight;
		this.columns = this.width / this.fontSize;
		this.#initialize();
	}

	#initialize() {
		for (let i = 0; i < this.columns; ++i) {
			this.symbols[i] = new CodeSymbol(i, 0, this.fontSize, this.height);
		}
	}

	resize(width: number, height: number) {
		this.width = width;
		this.height = height;
		this.columns = this.width / this.height;
		this.symbols = [];
		this.#initialize();
	}
}
