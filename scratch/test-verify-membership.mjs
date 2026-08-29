import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzadjxuylfphlpytmwfs.supabase.co';
const supabaseKey = 'sb_publishable_ls2RRkWYCU5RVdbGRg-c1A_koMxCwA1';

const client = createClient(supabaseUrl, supabaseKey);

async function verifyProfile() {
  console.log('Logging in as elle26@gmail.com ...');
  const { data: authData, error: authErr } = await client.auth.signInWithPassword({
    email: 'elle26@gmail.com',
    password: 'Legacy@Ming2026!'
  });

  if (authErr) {
    console.log('Auth error:', authErr.message);
    return;
  }

  console.log('Logged in successfully as user ID:', authData.user?.id);

  const { data: membership, error: memErr } = await client
    .from('crm_memberships')
    .select('*, distributor:crm_distributors(*)')
    .eq('user_id', authData.user?.id)
    .single();

  console.log('CRM Membership & Linked Distributor:', membership || memErr);
}

verifyProfile();
