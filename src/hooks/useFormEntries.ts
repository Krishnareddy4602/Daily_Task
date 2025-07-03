import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FormEntry } from '../types/database';

export const useFormEntries = (category: 'vishnu' | 'krishna') => {
  const [entries, setEntries] = useState<FormEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEntries();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel(`entries_${category}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'form_entries',
          filter: `category=eq.${category}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setEntries(prev => [payload.new as FormEntry, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setEntries(prev => prev.map(entry => 
              entry.id === payload.new.id ? payload.new as FormEntry : entry
            ));
          } else if (payload.eventType === 'DELETE') {
            setEntries(prev => prev.filter(entry => entry.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [category]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('form_entries')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async (entry: Omit<FormEntry, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('form_entries')
        .insert([entry]);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add entry');
      throw err;
    }
  };

  return { entries, loading, error, addEntry };
};