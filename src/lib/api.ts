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
    likes: string[];
    replies: {
        _id: string;
        text: string;
        user: User;
        createdAt: string;
    }[];
  }[];
  attachment?: {
    type: "image" | "video" | "document";
    url: string;
    name?: string;
  };
  isRepost?: boolean;
  originalPost?: Post;
  reposts: string[];
}

export interface Conversation {
  _id: string;
  participants: User[];
  messages: Message[];
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message?: string;
  fileUrl?: string;
  fileType?: 'image' | 'video' | 'document';
  createdAt: string;
  shouldShake?: boolean;
}

export interface NewsArticle {
  title: string;
  source: string;
  timestamp: string;
  url: string;
}

export interface Notification {
    _id: string;
    type: 'like' | 'comment' | 'reply' | 'repost' | 'connection_request' | 'connection_accepted';
    sender: User;
    post?: Post;
    read: boolean;
    timestamp: string;
}

export interface Job {
  job_id: string;
  employer_logo: string;
  employer_name: string;
  job_title: string;
  job_city: string;
  job_state: string;
  job_country: string;
  job_employment_type: string;
  job_description: string;
  job_apply_link: string;
  job_posted_at_datetime_utc: string;
}

interface SearchParams {
  query: string;
  location: string;
  employment_type: string;
  date_posted?: string;
}

export const searchJobs = async (params: SearchParams): Promise<Job[]> => {
    const queryParams = new URLSearchParams(Object.entries(params));
    const res = await fetch(`${API_URL}/jobs/search?${queryParams.toString()}`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch jobs");
    return res.json();
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

export const fetchPostById = async (postId: string): Promise<Post> => {
    const res = await fetch(`${API_URL}/posts/${postId}`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch post");
    return res.json();
};

export const fetchPostsByUser = async (userId: string): Promise<Post[]> => {
    const res = await fetch(`${API_URL}/posts/user/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch user posts");
    return res.json();
}

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

export const likeComment = async (postId: string, commentId: string): Promise<Post> => {
    const res = await fetch(`${API_URL}/posts/${postId}/comment/${commentId}/like`, {
        method: "POST",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to like comment");
    return res.json();
}

export const replyToComment = async (postId: string, commentId: string, reply: { text: string }): Promise<Post> => {
    const res = await fetch(`${API_URL}/posts/${postId}/comment/${commentId}/reply`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(reply),
    });
    if (!res.ok) throw new Error("Failed to add reply");
    return res.json();
}


export const deletePost = async (postId: string): Promise<void> => {
    const res = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete post');
}

export const repostPost = async (postId: string, content?: string): Promise<Post> => {
    const res = await fetch(`${API_URL}/posts/${postId}/repost`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error('Failed to repost');
    return res.json();
}

// --- MESSAGING ---
export const getConversations = async (): Promise<Conversation[]> => {
  const res = await fetch(`${API_URL}/messages/conversations`, {
      headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch conversations");
  return res.json();
}

export const getMessages = async (userId: string): Promise<Message[]> => {
  const res = await fetch(`${API_URL}/messages/${userId}`, {
      headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
}

export const sendMessage = async (userId: string, formData: FormData): Promise<Message> => {
  const res = await fetch(`${API_URL}/messages/send/${userId}`, {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
  });
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
}

// --- USERS & PROFILE ---
export const fetchUserProfile = async (email: string): Promise<User> => {
  const res = await fetch(`${API_URL}/users/profile/${email}`, {
      headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch user profile");
  return res.json();
}

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
  const res = await fetch(`${API_URL}/users/search?keyword=`, {
      headers: getAuthHeaders(),
  });
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

export const getConnections = async (): Promise<User[]> => {
  const res = await fetch(`${API_URL}/users/connections`, {
      headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch connections");
  return res.json();
}

export const sendConnectionRequest = async (toUserId: string): Promise<void> => {
  const res = await fetch(`${API_URL}/users/connect/${toUserId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.msg || "Failed to send connection request");
  }
};

export const fetchConnectionRequests = async (): Promise<User[]> => {
  const res = await fetch(`${API_URL}/users/profile/${localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).email : ''}`, {
      headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch connection requests");
  const userData = await res.json();
  return userData.connectionRequests || [];
};

export const acceptConnectionRequest = async (fromUserId: string): Promise<void> => {
  const res = await fetch(`${API_URL}/users/accept/${fromUserId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to accept connection request");
};

export const rejectConnectionRequest = async (fromUserId: string): Promise<void> => {
  const res = await fetch(`${API_URL}/users/reject/${fromUserId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to reject connection request");
};


export const disconnectUser = async (userId: string): Promise<void> => {
    const res = await fetch(`${API_URL}/users/connections/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to disconnect user");
}

// --- NOTIFICATIONS ---
export const fetchNotifications = async (): Promise<Notification[]> => {
    const res = await fetch(`${API_URL}/notifications`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch notifications");
    return res.json();
};

export const markAllNotificationsAsRead = async (): Promise<{msg: string}> => {
    const res = await fetch(`${API_URL}/notifications/read`, {
        method: 'POST',
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to mark notifications as read");
    return res.json();
};


// --- MOCKED DATA ---
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
      timestamp: "2025-10-16T12:30:00Z",
      url: "https://www.technewsworld.com/section/it/developers",
    },
  ];
};