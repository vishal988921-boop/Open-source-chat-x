export interface Command {
  name: string;
  description: string;
  transform: (input: string) => string;
}

export const commands: Command[] = [
  {
    name: '/summarize',
    description: 'Summarize the following text',
    transform: (input: string) => `Summarize the following:\n\n${input.replace('/summarize', '').trim()}`
  },
  {
    name: '/rewrite',
    description: 'Rewrite the following text for better clarity',
    transform: (input: string) => `Rewrite the following text for better clarity and flow:\n\n${input.replace('/rewrite', '').trim()}`
  },
  {
    name: '/ideas',
    description: 'Generate ideas based on the topic',
    transform: (input: string) => `Generate 5-10 creative ideas based on the following topic:\n\n${input.replace('/ideas', '').trim()}`
  },
  {
    name: '/code',
    description: 'Write code for the following request',
    transform: (input: string) => `Write clean, well-documented code for the following request:\n\n${input.replace('/code', '').trim()}`
  }
];

export function parseCommand(input: string): string {
  const trimmedInput = input.trim();
  for (const command of commands) {
    if (trimmedInput.startsWith(command.name)) {
      return command.transform(trimmedInput);
    }
  }
  return input;
}
