export interface Experience {
  _id: string;
  title: string;
  company: string;
  startDate: Date;
  endDate: string | Date;
  description?: string;
}

export interface Education {
  _id: string;
  school: string;
  degree: string;
  startDate: Date;
  endDate: string | Date;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  title?: string;
  location?: string;
  connections: User[];
  profileViews?: number;
  about?: string;
  skills?: string[];
  experience?: Experience[];
  education?: Education[];
  profileImage?: string;
  backgroundImage?: string;
  connectionRequests?: User[];
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
  _id: string;
  author: User;
  content: string;
  timestamp: string;
  likes: string[];
  comments: {
    _id: string;
    text: string;
    user: User;
    createdAt: string;
  }[];
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

// --- Specific types for API function arguments ---
type RegisterData = {
  name: string;
  email: string;
  password: string
};
type LoginData = {
  email: string;
  password: string
};
type CreatePostData = {
  content: string;
  attachment?: {
    type: "image" | "video" | "document";
    url: string;
    name?: string;
  };
};

// --- API CONFIG ---
const API_URL = "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// --- AUTH ---
export const register = async (userData: RegisterData) => {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || 'Failed to register');
    }
    return res.json();
};

export const login = async (credentials: LoginData) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || 'Failed to login');
    }
    return res.json();
};

// --- POSTS ---
export const fetchPosts = async (): Promise<Post[]> => {
  const res = await fetch(`${API_URL}/posts`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
};

export const createPost = async (postData: CreatePostData): Promise<Post> => {
  const res = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(postData),
  });
  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
};

export const likePost = async (postId: string): Promise<Post> => {
  const res = await fetch(`${API_URL}/posts/${postId}/like`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to like post");
  return res.json();
};

export const commentOnPost = async (postId: string, comment: { text: string }): Promise<Post> => {
  const res = await fetch(`${API_URL}/posts/${postId}/comment`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(comment),
  });
  if (!res.ok) throw new Error("Failed to add comment");
  return res.json();
};

// --- USERS & PROFILE ---
export const fetchUserProfile = async (email: string): Promise<User | null> => {
  const res = await fetch(`${API_URL}/users/profile/${email}`);
  if (!res.ok) return null;
  return res.json();
};

export const updateUserProfile = async (profileData: Partial<User>): Promise<User> => {
  const res = await fetch(`${API_URL}/users/profile`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
};

export const fetchAllUsers = async (): Promise<User[]> => {
  const res = await fetch(`${API_URL}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

// --- SETTINGS ---
export const fetchUserSettings = async (): Promise<Settings> => {
    const res = await fetch(`${API_URL}/users/settings`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch settings");
    return res.json();
};

export const updateUserSettings = async (settingsData: Partial<Settings>): Promise<Settings> => {
    const res = await fetch(`${API_URL}/users/settings`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(settingsData),
    });
    if (!res.ok) throw new Error("Failed to update settings");
    return res.json();
};

// --- CONNECTIONS ---
export const sendConnectionRequest = async (toUserId: string): Promise<void> => {
    const res = await fetch(`${API_URL}/users/connections/request`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ toUserId })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.msg || "Failed to send connection request");
    }
};

export const fetchConnectionRequests = async (): Promise<User[]> => {
    const res = await fetch(`${API_URL}/users/connections/requests`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch connection requests");
    return res.json();
};

export const acceptConnectionRequest = async (fromUserId: string): Promise<void> => {
    const res = await fetch(`${API_URL}/users/connections/accept`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ fromUserId })
    });
    if (!res.ok) throw new Error("Failed to accept connection request");
};

export const rejectConnectionRequest = async (fromUserId: string): Promise<void> => {
    const res = await fetch(`${API_URL}/users/connections/reject`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ fromUserId })
    });
    if (!res.ok) throw new Error("Failed to reject connection request");
};

// --- MOCKED NEWS ---
export const fetchNews = async (): Promise<NewsArticle[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // This remains a mock as it fetches external data
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
      timestamp: "2025-10-16T12:30:00Z",
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