export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type ChatLink = {
  type: "Course" | "Program" | "CareerPath";
  id: number;
  title: string;
};

export type ChatResponse = {
  reply: string;
  links: ChatLink[];
};
