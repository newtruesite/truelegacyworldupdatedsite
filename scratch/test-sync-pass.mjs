import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzadjxuylfphlpytmwfs.supabase.co';
const supabaseKey = 'sb_publishable_ls2RRkWYCU5RVdbGRg-c1A_koMxCwA1';

const client = createClient(supabaseUrl, supabaseKey);

async function syncAndTest() {
  console.log('1. Invoking provision-leader-accounts edge function to sync all accounts...');
  const { data: fnData, error: fnErr } = await client.functions.invoke('provision-leader-accounts', {});
  console.log('Function response:', fnErr || fnData);

  console.log('\n2. Testing login with email: elle26@gmail.com and password: Legacy@Ming2026! ...');
  const { data: d1, error: e1 } = await client.auth.signInWithPassword({
    email: 'elle26@gmail.com',
    password: 'Legacy@Ming2026!'
  });

  if (e1) {
    console.log('elle26@gmail.com login failed:', e1.message);
  } else {
    console.log('SUCCESS! elle26@gmail.com logged in successfully:', d1.user?.id);
  }

  console.log('\n3. Testing login with email: mingwaysia@gmail.com and password: Legacy@Ming2026! ...');
  const { data: d2, error: e2 } = await client.auth.signInWithPassword({
    email: 'mingwaysia@gmail.com',
    password: 'Legacy@Ming2026!'
  });

  if (e2) {
    console.log('mingwaysia@gmail.com login failed:', e2.message);
  } else {
    console.log('SUCCESS! mingwaysia@gmail.com logged in successfully:', d2.user?.id);
  }
}

syncAndTest();
