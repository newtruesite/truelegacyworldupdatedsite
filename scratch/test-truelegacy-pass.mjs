import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzadjxuylfphlpytmwfs.supabase.co';
const supabaseKey = 'sb_publishable_ls2RRkWYCU5RVdbGRg-c1A_koMxCwA1';

const client = createClient(supabaseUrl, supabaseKey);

async function testPassword() {
  console.log('Testing login with TrueLegacy2026! for mingwaysia@gmail.com...');
  const { data, error } = await client.auth.signInWithPassword({
    email: 'mingwaysia@gmail.com',
    password: 'TrueLegacy2026!'
  });

  if (error) {
    console.log('Login failed:', error.message);
  } else {
    console.log('SUCCESS! TrueLegacy2026! is active and working:', data.user?.id);
  }
}

testPassword();
