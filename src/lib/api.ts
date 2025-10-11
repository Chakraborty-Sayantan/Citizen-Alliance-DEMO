export interface Experience {
  id: string;
  title: string;
  company: string;
  date: string;
  description?: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  date: string;
}

export interface User {
  name: string;
  email: string;
  title?: string;
  location?: string;
  connections?: number;
  profileViews?: number;
  about?: string;
  skills?: string[];
  experience?: Experience[];
  education?: Education[];
  profileImage?: string;
  backgroundImage?: string;
}

export interface Settings {
  emailNotifications: boolean;
  profileVisibility: boolean;
  messageNotifications: boolean;
  activityStatus: boolean;
  allowSearchEngines: boolean;
  connectionRequests: boolean;
  jobAlerts: boolean;
}


export interface Post {
  id: string;
  author: User;
  content: string;
  timestamp: string;
  likes: number;
  comments: { text: string; author: User }[];
  isLiked: boolean;
  attachment?: {
    type: "image" | "video" | "document";
    url: string;
    name?: string;
  };
}

export interface NewsArticle {
  title: string;
  source: string;
  timestamp: string;
  url: string;
}

// --- MOCK API ---

const getPostsFromStorage = (): Post[] => {
  const posts = localStorage.getItem("linkledge_posts");
  return posts ? JSON.parse(posts) : [];
};

const savePostsToStorage = (posts: Post[]) => {
  localStorage.setItem("linkledge_posts", JSON.stringify(posts));
};

export const fetchPosts = async (): Promise<Post[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return getPostsFromStorage().sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

export const createPost = async (
  post: Omit<Post, "id" | "likes" | "comments" | "isLiked" | "timestamp">
): Promise<Post> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const posts = getPostsFromStorage();
  const newPost: Post = {
    ...post,
    id: new Date().toISOString(),
    likes: 0,
    comments: [],
    isLiked: false,
    timestamp: new Date().toISOString(),
  };
  const updatedPosts = [newPost, ...posts];
  savePostsToStorage(updatedPosts);
  return newPost;
};

export const likePost = async (postId: string): Promise<Post> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const posts = getPostsFromStorage();
  const postIndex = posts.findIndex((p) => p.id === postId);

  if (postIndex === -1) {
    throw new Error("Post not found");
  }

  const post = posts[postIndex];
  post.isLiked = !post.isLiked;
  post.likes = post.isLiked ? post.likes + 1 : post.likes - 1;

  posts[postIndex] = post;
  savePostsToStorage(posts);
  return post;
};

export const commentOnPost = async (
  postId: string,
  comment: { text: string; author: User }
): Promise<Post> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const posts = getPostsFromStorage();
  const postIndex = posts.findIndex((p) => p.id === postId);

  if (postIndex === -1) {
    throw new Error("Post not found");
  }

  const post = posts[postIndex];
  post.comments.push(comment);

  posts[postIndex] = post;
  savePostsToStorage(posts);
  return post;
};

export const repostPost = async (postId: string): Promise<void> => {
  console.log(`Reposting post ${postId}`);
  await new Promise((resolve) => setTimeout(resolve, 300));
};

export const sendPost = async (postId: string): Promise<void> => {
  console.log(`Sending post ${postId}`);
  await new Promise((resolve) => setTimeout(resolve, 300));
};

export const fetchNews = async (): Promise<NewsArticle[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [
    {
      title: "OpenAI DevDay 2025: ChatGPT gets apps, AgentKit, and cheaper models",
      source: "Indian Express",
      timestamp: "2025-10-07T12:11:31Z",
      url: "https://indianexpress.com/article/technology/artificial-intelligence/openai-devday-2025-chatgpt-gets-apps-agentkit-for-developers-and-cheaper-gpt-models-10292443/",
    },
    {
      title: "AMD's AI Surge Challenges Nvidia's Dominance",
      source: "TechNewsWorld",
      timestamp: "2025-06-16T12:30:00Z",
      url: "https://www.technewsworld.com/section/it/developers",
    },
    {
      title: "The Top Trends in Tech: McKinsey Technology Trends Outlook 2025",
      source: "McKinsey",
      timestamp: "2025-07-22T12:30:00Z",
      url: "https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-top-trends-in-tech",
    },
    {
      title:
        "Google DeepMind Launches Gemini 2.5 Computer Use Model to Power AI Agents",
      source: "InfoQ",
      timestamp: "2025-10-09T12:00:00Z",
      url: "https://www.infoq.com/",
    },
  ];
};

export const fetchUserProfile = async (email: string): Promise<User | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const users: User[] = JSON.parse(
    localStorage.getItem("linkledge_users") || "[]"
  );
  const user = users.find((u) => u.email === email);
  return user || null;
};

export const updateUserProfile = async (
  email: string,
  profileData: Partial<User>
): Promise<User> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const users: User[] = JSON.parse(
    localStorage.getItem("linkledge_users") || "[]"
  );
  const userIndex = users.findIndex((u) => u.email === email);

  if (userIndex === -1) {
    throw new Error("User not found");
  }

  users[userIndex] = { ...users[userIndex], ...profileData };
  localStorage.setItem("linkledge_users", JSON.stringify(users));

  return users[userIndex];
};

export const fetchUserSettings = async (
  email: string
): Promise<Settings> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const settings = JSON.parse(
    localStorage.getItem(`linkledge_settings_${email}`) || "{}"
  );
  // Return default settings if none are found
  return {
    emailNotifications: true,
    profileVisibility: true,
    messageNotifications: true,
    activityStatus: true,
    allowSearchEngines: true,
    connectionRequests: true,
    jobAlerts: true,
    ...settings,
  };
};

export const updateUserSettings = async (
  email: string,
  settingsData: Partial<Settings>
): Promise<Settings> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const currentSettings = await fetchUserSettings(email);
  const updatedSettings = { ...currentSettings, ...settingsData };
  localStorage.setItem(
    `linkledge_settings_${email}`,
    JSON.stringify(updatedSettings)
  );
  return updatedSettings;
};