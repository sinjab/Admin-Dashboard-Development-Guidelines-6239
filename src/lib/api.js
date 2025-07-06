import { supabase } from './supabase';

// AI Projects API
export const projectsAPI = {
  getAll: async () => {
    try {
      console.log('Fetching all projects...');
      const { data, error } = await supabase
        .from('ai_projects_ksp2024')
        .select('*')
        .order('sort_order');

      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }

      console.log('Projects fetched successfully:', data);
      return { data, error: null };
    } catch (error) {
      console.error('Projects API getAll error:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      console.log('Fetching project by ID:', id);
      const { data, error } = await supabase
        .from('ai_projects_ksp2024')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching project:', error);
        throw error;
      }

      console.log('Project fetched successfully:', data);
      return { data, error: null };
    } catch (error) {
      console.error('Projects API getById error:', error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      console.log('Creating project with data:', data);
      
      // Prepare the data for insertion
      const insertData = {
        title_en: data.title_en?.trim() || '',
        title_ar: data.title_ar?.trim() || '',
        description_en: data.description_en?.trim() || '',
        description_ar: data.description_ar?.trim() || '',
        status: data.status || 'planned',
        category: data.category || 'machine_learning',
        tech_stack: data.tech_stack || [],
        image_url: data.image_url || null,
        demo_url: data.demo_url?.trim() || null,
        github_url: data.github_url?.trim() || null,
        is_featured: data.is_featured || false,
        sort_order: data.sort_order || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Prepared insert data:', insertData);

      const { data: result, error } = await supabase
        .from('ai_projects_ksp2024')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Error creating project:', error);
        throw error;
      }

      console.log('Project created successfully:', result);
      return { data: result, error: null };
    } catch (error) {
      console.error('Projects API create error:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      console.log('Updating project with ID:', id, 'Data:', data);
      
      // Prepare the data for update
      const updateData = {
        title_en: data.title_en?.trim() || '',
        title_ar: data.title_ar?.trim() || '',
        description_en: data.description_en?.trim() || '',
        description_ar: data.description_ar?.trim() || '',
        status: data.status || 'planned',
        category: data.category || 'machine_learning',
        tech_stack: data.tech_stack || [],
        image_url: data.image_url || null,
        demo_url: data.demo_url?.trim() || null,
        github_url: data.github_url?.trim() || null,
        is_featured: data.is_featured || false,
        sort_order: data.sort_order || 0,
        updated_at: new Date().toISOString()
      };

      console.log('Prepared update data:', updateData);

      const { data: result, error } = await supabase
        .from('ai_projects_ksp2024')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating project:', error);
        throw error;
      }

      console.log('Project updated successfully:', result);
      return { data: result, error: null };
    } catch (error) {
      console.error('Projects API update error:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      console.log('Deleting project with ID:', id);
      
      const { error } = await supabase
        .from('ai_projects_ksp2024')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting project:', error);
        throw error;
      }

      console.log('Project deleted successfully');
      return { data: null, error: null };
    } catch (error) {
      console.error('Projects API delete error:', error);
      throw error;
    }
  }
};

// Research Projects API
export const researchAPI = {
  getAll: () => supabase.from('research_projects_ksp2024').select('*').order('sort_order'),
  getById: (id) => supabase.from('research_projects_ksp2024').select('*').eq('id', id).single(),
  create: (data) => supabase.from('research_projects_ksp2024').insert(data).select(),
  update: (id, data) => supabase.from('research_projects_ksp2024').update(data).eq('id', id).select(),
  delete: (id) => supabase.from('research_projects_ksp2024').delete().eq('id', id)
};

// Publications API
export const publicationsAPI = {
  getAll: () => supabase.from('publications_ksp2024').select('*').order('year', { ascending: false }),
  getById: (id) => supabase.from('publications_ksp2024').select('*').eq('id', id).single(),
  create: (data) => supabase.from('publications_ksp2024').insert(data).select(),
  update: (id, data) => supabase.from('publications_ksp2024').update(data).eq('id', id).select(),
  delete: (id) => supabase.from('publications_ksp2024').delete().eq('id', id)
};

// Blog Posts API
export const blogAPI = {
  getAll: () => supabase.from('blog_posts_ksp2024').select('*,content_categories_ksp2024(*)').order('created_at', { ascending: false }),
  getById: (id) => supabase.from('blog_posts_ksp2024').select('*,content_categories_ksp2024(*)').eq('id', id).single(),
  create: (data) => supabase.from('blog_posts_ksp2024').insert(data).select(),
  update: (id, data) => supabase.from('blog_posts_ksp2024').update(data).eq('id', id).select(),
  delete: (id) => supabase.from('blog_posts_ksp2024').delete().eq('id', id)
};

// Services API
export const servicesAPI = {
  getAll: () => supabase.from('services_ksp2024').select('*').order('sort_order'),
  getById: (id) => supabase.from('services_ksp2024').select('*').eq('id', id).single(),
  create: (data) => supabase.from('services_ksp2024').insert(data).select(),
  update: (id, data) => supabase.from('services_ksp2024').update(data).eq('id', id).select(),
  delete: (id) => supabase.from('services_ksp2024').delete().eq('id', id)
};

// Categories API
export const categoriesAPI = {
  getAll: () => supabase.from('content_categories_ksp2024').select('*').order('name'),
  create: (data) => supabase.from('content_categories_ksp2024').insert(data).select(),
  update: (id, data) => supabase.from('content_categories_ksp2024').update(data).eq('id', id).select(),
  delete: (id) => supabase.from('content_categories_ksp2024').delete().eq('id', id)
};

// Site Settings API
export const settingsAPI = {
  getAll: () => supabase.from('site_settings_ksp2024').select('*').order('category'),
  getByKey: (key) => supabase.from('site_settings_ksp2024').select('*').eq('key', key).single(),
  upsert: (data) => supabase.from('site_settings_ksp2024').upsert(data).select()
};

// Testimonials API
export const testimonialsAPI = {
  getAll: () => supabase.from('testimonials_ksp2024').select('*').order('sort_order'),
  getById: (id) => supabase.from('testimonials_ksp2024').select('*').eq('id', id).single(),
  create: (data) => supabase.from('testimonials_ksp2024').insert(data).select(),
  update: (id, data) => supabase.from('testimonials_ksp2024').update(data).eq('id', id).select(),
  delete: (id) => supabase.from('testimonials_ksp2024').delete().eq('id', id)
};