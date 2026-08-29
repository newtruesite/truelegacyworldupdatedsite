import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzadjxuylfphlpytmwfs.supabase.co';
const supabaseKey = 'sb_publishable_ls2RRkWYCU5RVdbGRg-c1A_koMxCwA1';

const client = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Testing login for elle26@gmail.com with TrueLegacy2026! ...');
  const { data, error } = await client.auth.signInWithPassword({
    email: 'elle26@gmail.com',
    password: 'TrueLegacy2026!'
  });

  if (error) {
    console.log('Login result:', error.message);
  } else {
    console.log('SUCCESS! User logged in:', data.user?.email, data.user?.id);
  }
}

test();
