import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzadjxuylfphlpytmwfs.supabase.co';
const supabaseAnonKey = 'sb_publishable_ls2RRkWYCU5RVdbGRg-c1A_koMxCwA1';

async function runSecurityAuditTests() {
  console.log('=== RUNNING SUPABASE SECURITY AUDIT TESTS ===\n');

  const anonClient = createClient(supabaseUrl, supabaseAnonKey);

  // Test 1: Public Anonymous application submission
  console.log('1. Testing Public Application RPC with anonymous client...');
  const { data: appData, error: appError } = await anonClient.rpc('submit_crm_application', {
    payload: {
      fullName: 'Security Test Lead',
      email: 'sec-test@example.com',
      country: 'US',
      interest: 'product',
      consent: true,
    },
  });

  if (!appError) {
    console.log('   [PASS] Public application submission RPC is accessible to anonymous users.');
  } else {
    console.log(`   [INFO] Public application RPC returned: ${appError.message}`);
  }

  // Test 2: Anonymous call to Admin Lead Assignment (must fail)
  console.log('\n2. Testing Admin Lead Assignment RPC as anonymous user (Must Fail)...');
  const { error: assignError } = await anonClient.rpc('crm_assign_lead', {
    p_lead_id: '00000000-0000-0000-0000-000000000000',
    p_distributor_id: '00000000-0000-0000-0000-000000000000',
  });

  if (assignError) {
    console.log(`   [PASS] Anonymous assignment rejected: ${assignError.message}`);
  } else {
    console.error('   [FAIL] Anonymous user was able to execute crm_assign_lead!');
  }

  // Test 3: Anonymous call to Leader Application Review (must fail)
  console.log('\n3. Testing Leader Application Review RPC as anonymous user (Must Fail)...');
  const { error: reviewError } = await anonClient.rpc('crm_review_leader_application', {
    p_application_id: '00000000-0000-0000-0000-000000000000',
    p_status: 'approved',
    p_notes: 'Unauthorized attempt',
  });

  if (reviewError) {
    console.log(`   [PASS] Anonymous review rejected: ${reviewError.message}`);
  } else {
    console.error('   [FAIL] Anonymous user was able to execute crm_review_leader_application!');
  }

  // Test 4: Unauthenticated call to send-leader-access-email Edge Function (must return 401)
  console.log('\n4. Testing Edge Function send-leader-access-email with no auth header...');
  try {
    const edgeRes = await fetch(`${supabaseUrl}/functions/v1/send-leader-access-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    });

    if (edgeRes.status === 401) {
      console.log('   [PASS] Edge Function strictly returned 401 Unauthorized for unauthenticated caller.');
    } else {
      console.log(`   [STATUS] Edge function returned ${edgeRes.status}`);
    }
  } catch (err) {
    console.log(`   [INFO] Edge function network call: ${err.message}`);
  }

  console.log('\n=== SECURITY AUDIT TESTS FINISHED ===');
}

runSecurityAuditTests();
