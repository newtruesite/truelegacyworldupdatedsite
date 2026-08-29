import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzadjxuylfphlpytmwfs.supabase.co';
const supabaseKey = 'sb_publishable_ls2RRkWYCU5RVdbGRg-c1A_koMxCwA1';

const client = createClient(supabaseUrl, supabaseKey);

async function updateMingWayEmail() {
  console.log('1. Signing in as mingwaysia@gmail.com...');
  const { data: signinData, error: signinErr } = await client.auth.signInWithPassword({
    email: 'mingwaysia@gmail.com',
    password: 'Legacy@Ming2026!'
  });

  if (signinErr || !signinData.session) {
    console.log('Sign in failed:', signinErr?.message);
    return;
  }

  console.log('2. Updating password to TrueLegacy2026! and user metadata...');
  const { data: updateData, error: updateErr } = await client.auth.updateUser({
    email: 'elle26@gmail.com',
    password: 'TrueLegacy2026!',
    data: { name: 'Ming-Way Sia' }
  });

  if (updateErr) {
    console.log('Update user failed:', updateErr.message);
  } else {
    console.log('Update user result:', updateData.user?.email);
  }
}

updateMingWayEmail();
