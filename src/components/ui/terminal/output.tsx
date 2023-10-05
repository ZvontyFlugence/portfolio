import { component$ } from '@builder.io/qwik';

export interface TerminalOutputProps {
	cmd: string;
	location: string;
	output: string;
}

const TerminalOutput = component$<TerminalOutputProps>(({ output }) => {
	return (
		<div class=''>
			<span>{output}</span>
		</div>
	);
});

export default TerminalOutput;
