import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://idwikpthljzydsxfaaqf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlkd2lrcHRobGp6eWRzeGZhYXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NzY1MzYsImV4cCI6MjA2NzM1MjUzNn0.O78_pary-rh-rmWJhk420YHmKT962II9ITdi5xpKSfo';

if (supabaseUrl === 'https://<PROJECT-ID>.supabase.co' || supabaseAnonKey === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

// Admin Authentication Functions
export const authenticateAdmin = async (email, password) => {
  try {
    const { data, error } = await supabase.rpc('authenticate_admin', {
      p_email: email,
      p_password: password
    });

    if (error) {
      throw error;
    }

    if (data && data.length > 0) {
      const adminData = data[0];
      // Store admin session in localStorage
      localStorage.setItem('admin_session', JSON.stringify({
        id: adminData.id,
        email: adminData.email,
        full_name: adminData.full_name,
        role: adminData.role,
        is_active: adminData.is_active,
        login_time: new Date().toISOString()
      }));

      return { data: adminData, error: null };
    } else {
      return { data: null, error: { message: 'Invalid credentials' } };
    }
  } catch (error) {
    return { data: null, error };
  }
};

export const getCurrentAdmin = () => {
  try {
    const session = localStorage.getItem('admin_session');
    if (session) {
      const adminData = JSON.parse(session);
      // Check if session is still valid (24 hours)
      const loginTime = new Date(adminData.login_time);
      const now = new Date();
      const hoursDiff = (now - loginTime) / (1000 * 60 * 60);

      if (hoursDiff < 24) {
        return adminData;
      } else {
        // Session expired
        localStorage.removeItem('admin_session');
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting current admin:', error);
    return null;
  }
};

export const signOutAdmin = () => {
  localStorage.removeItem('admin_session');
  return { error: null };
};

export const updateAdminPassword = async (email, currentPassword, newPassword) => {
  try {
    const { data, error } = await supabase.rpc('update_admin_password', {
      p_email: email,
      p_current_password: currentPassword,
      p_new_password: newPassword
    });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const createAdminUser = async (email, password, fullName, role = 'admin') => {
  try {
    const { data, error } = await supabase.rpc('create_admin_user', {
      p_email: email,
      p_password: password,
      p_full_name: fullName,
      p_role: role
    });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Legacy functions for backward compatibility
export const signIn = async (email, password) => {
  return await authenticateAdmin(email, password);
};

export const signOut = async () => {
  return signOutAdmin();
};

export const getCurrentUser = async () => {
  return getCurrentAdmin();
};