// Mock Data Service - Replaces Supabase with local storage and mock data

export interface User {
  id: string;
  name: string;
  email: string;
  coins: number;
  streak_count: number;
  level: number;
  avatar_url?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  status: 'pending' | 'in_progress' | 'completed' | 'abandoned';
  created_at: string;
  completed_at?: string | null;
  user_id: string;
  tags?: string[];
}

export interface Reward {
  id: string;
  user_id: string;
  coins_earned: number;
  badge_awarded?: string | null;
  task_id?: string | null;
  timestamp: string;
}

// Mock user data
const mockUser: User = {
  id: 'mock-user-1',
  name: 'Quest Master',
  email: 'questmaster@timequest.com',
  coins: 1250,
  streak_count: 12,
  level: 5,
  avatar_url: null
};

// Mock tasks data
const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Complete project proposal',
    description: 'Write comprehensive project proposal for Q1 initiatives',
    duration_minutes: 60,
    status: 'pending',
    created_at: new Date().toISOString(),
    user_id: 'mock-user-1',
    tags: ['Work', 'Projects']
  },
  {
    id: 'task-2',
    title: 'Review code changes',
    description: 'Review pull requests from team members',
    duration_minutes: 30,
    status: 'completed',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    completed_at: new Date(Date.now() - 3600000).toISOString(),
    user_id: 'mock-user-1',
    tags: ['Work', 'Learning']
  },
  {
    id: 'task-3',
    title: 'Design UI mockups',
    description: 'Create retro-futuristic UI mockups for new feature',
    duration_minutes: 90,
    status: 'in_progress',
    created_at: new Date(Date.now() - 43200000).toISOString(),
    user_id: 'mock-user-1',
    tags: ['Creative', 'Work']
  },
  {
    id: 'task-4',
    title: 'Morning workout',
    description: 'Complete 30-minute HIIT workout session',
    duration_minutes: 30,
    status: 'completed',
    created_at: new Date(Date.now() - 129600000).toISOString(),
    completed_at: new Date(Date.now() - 126000000).toISOString(),
    user_id: 'mock-user-1',
    tags: ['Health', 'Exercise']
  },
  {
    id: 'task-5',
    title: 'Learn TypeScript patterns',
    description: 'Study advanced TypeScript design patterns',
    duration_minutes: 45,
    status: 'pending',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    user_id: 'mock-user-1',
    tags: ['Learning', 'Study']
  }
];

// Local storage keys
const STORAGE_KEYS = {
  USER: 'timequest_user',
  TASKS: 'timequest_tasks',
  REWARDS: 'timequest_rewards',
  AUTH_STATE: 'timequest_auth'
};

// Mock Auth Service
export class MockAuthService {
  static getCurrentUser(): User | null {
    const authState = localStorage.getItem(STORAGE_KEYS.AUTH_STATE);
    if (authState === 'authenticated') {
      return this.getUserProfile();
    }
    return null;
  }

  static signIn(email: string, password: string): Promise<{ user: User | null; error: any }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email && password) {
          localStorage.setItem(STORAGE_KEYS.AUTH_STATE, 'authenticated');
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
          localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(mockTasks));
          resolve({ user: mockUser, error: null });
        } else {
          resolve({ user: null, error: { message: 'Invalid credentials' } });
        }
      }, 1000);
    });
  }

  static signUp(email: string, password: string, name: string): Promise<{ user: User | null; error: any }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email && password && name) {
          const newUser = { ...mockUser, name, email };
          localStorage.setItem(STORAGE_KEYS.AUTH_STATE, 'authenticated');
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
          localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(mockTasks));
          resolve({ user: newUser, error: null });
        } else {
          resolve({ user: null, error: { message: 'Invalid registration data' } });
        }
      }, 1000);
    });
  }

  static signOut(): Promise<{ error: any }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.TASKS);
        localStorage.removeItem(STORAGE_KEYS.REWARDS);
        resolve({ error: null });
      }, 500);
    });
  }

  static getUserProfile(): User | null {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : mockUser;
  }

  static updateUserProfile(updates: Partial<User>): Promise<{ user: User | null; error: any }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUser = this.getUserProfile();
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
          resolve({ user: updatedUser, error: null });
        } else {
          resolve({ user: null, error: { message: 'User not found' } });
        }
      }, 500);
    });
  }
}

// Mock Task Service
export class MockTaskService {
  static getTasks(): Promise<{ data: Task[] | null; error: any }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasksData = localStorage.getItem(STORAGE_KEYS.TASKS);
        const tasks = tasksData ? JSON.parse(tasksData) : mockTasks;
        resolve({ data: tasks, error: null });
      }, 300);
    });
  }

  static createTask(task: Omit<Task, 'id' | 'created_at' | 'user_id'>): Promise<{ data: Task | null; error: any }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTask: Task = {
          ...task,
          id: `task-${Date.now()}`,
          created_at: new Date().toISOString(),
          user_id: 'mock-user-1'
        };

        const tasksData = localStorage.getItem(STORAGE_KEYS.TASKS);
        const tasks = tasksData ? JSON.parse(tasksData) : mockTasks;
        tasks.unshift(newTask);
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));

        resolve({ data: newTask, error: null });
      }, 500);
    });
  }

  static updateTask(taskId: string, updates: Partial<Task>): Promise<{ data: Task | null; error: any }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasksData = localStorage.getItem(STORAGE_KEYS.TASKS);
        const tasks = tasksData ? JSON.parse(tasksData) : mockTasks;
        
        const taskIndex = tasks.findIndex((t: Task) => t.id === taskId);
        if (taskIndex !== -1) {
          tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
          localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));

          // Award coins for completed tasks
          if (updates.status === 'completed') {
            this.awardCoinsForTask(tasks[taskIndex]);
          }

          resolve({ data: tasks[taskIndex], error: null });
        } else {
          resolve({ data: null, error: { message: 'Task not found' } });
        }
      }, 300);
    });
  }

  private static awardCoinsForTask(task: Task) {
    const coinsEarned = Math.floor(task.duration_minutes / 5) * 10; // 10 coins per 5 minutes
    const currentUser = MockAuthService.getUserProfile();
    
    if (currentUser) {
      MockAuthService.updateUserProfile({
        coins: currentUser.coins + coinsEarned
      });

      // Save reward record
      const reward: Reward = {
        id: `reward-${Date.now()}`,
        user_id: currentUser.id,
        coins_earned: coinsEarned,
        task_id: task.id,
        timestamp: new Date().toISOString()
      };

      const rewardsData = localStorage.getItem(STORAGE_KEYS.REWARDS);
      const rewards = rewardsData ? JSON.parse(rewardsData) : [];
      rewards.unshift(reward);
      localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
    }
  }
}

// Initialize mock data if not exists
export const initializeMockData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(mockTasks));
  }
};