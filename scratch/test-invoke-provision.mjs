import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzadjxuylfphlpytmwfs.supabase.co';
const supabaseKey = 'sb_publishable_ls2RRkWYCU5RVdbGRg-c1A_koMxCwA1';

const client = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Invoking provision-leader-accounts edge function...');
  const { data, error } = await client.functions.invoke('provision-leader-accounts', {});
  console.log('Edge function response:', error || data);
}

test();
