import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzadjxuylfphlpytmwfs.supabase.co';
const supabaseKey = 'sb_publishable_ls2RRkWYCU5RVdbGRg-c1A_koMxCwA1';

const client = createClient(supabaseUrl, supabaseKey);

async function checkRole() {
  const { data: authData } = await client.auth.signInWithPassword({
    email: 'elle26@gmail.com',
    password: 'Legacy@Ming2026!'
  });

  const { data: membership } = await client
    .from('crm_memberships')
    .select('role')
    .eq('user_id', authData.user?.id)
    .single();

  console.log('Ming-Way Role:', membership?.role);
}

checkRole();
