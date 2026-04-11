import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useAvailablePeriods = () => {
  return useQuery({
    queryKey: ['availablePeriods'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dashboard')
        .select('periodo');

      if (error) throw error;

      // Extract unique periods and sort them descending
      const periods = Array.from(new Set((data || []).map(d => d.periodo).filter(Boolean)));
      return periods.sort((a, b) => b.localeCompare(a));
    },
  });
};
