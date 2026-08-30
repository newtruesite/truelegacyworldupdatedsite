import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzadjxuylfphlpytmwfs.supabase.co';
const supabaseKey = 'sb_publishable_ls2RRkWYCU5RVdbGRg-c1A_koMxCwA1';

const client = createClient(supabaseUrl, supabaseKey);

async function testSubmit() {
  const payload = {
    fullName: 'Test Lead',
    email: 'testlead999@example.com',
    phone: '+15551234567',
    country: 'us',
    interest: 'duo',
    hasReferrer: true,
    referredBy: 'Jesse Schexnayder',
    referralCode: 'jesse-hotshotz',
    selectedDistributor: 'jesse-schexnayder',
    locale: 'en',
    sourcePath: '/apply?ref=jesse-hotshotz&interest=duo',
    consent: true,
    privacyVersion: '2026-08-phase-1',
    website: '',
  };

  const { data, error } = await client.rpc('submit_crm_application', { payload });
  console.log('Submission result:', data, 'Error:', error);
}

testSubmit();
