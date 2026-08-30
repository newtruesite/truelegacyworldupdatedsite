import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzadjxuylfphlpytmwfs.supabase.co';
const supabaseKey = 'sb_publishable_ls2RRkWYCU5RVdbGRg-c1A_koMxCwA1';

async function runAccessControlTests() {
  console.log('=== RUNNING CRM ACCESS CONTROL TESTS ===\n');

  // 1. Test Jesse (Regular Distributor)
  const jesseClient = createClient(supabaseUrl, supabaseKey);
  const { data: jesseAuth, error: jesseAuthErr } = await jesseClient.auth.signInWithPassword({
    email: 'jesse@hotshotzpromo.com',
    password: 'Legacy@Jesse2026!',
  });

  if (jesseAuthErr) {
    console.error('FAILED to log in as Jesse:', jesseAuthErr.message);
    return;
  }
  console.log('1. Logged in as Jesse Schexnayder (Distributor ID: 12f591cd-4906-4876-a704-c9d20c53cdb9)');

  const { data: jesseLeads, error: jesseLeadsErr } = await jesseClient
    .from('crm_leads')
    .select('id, full_name, assigned_distributor_id');

  console.log(`   Jesse queried crm_leads: returned ${jesseLeads?.length || 0} leads.`);
  if (jesseLeads && jesseLeads.length > 0) {
    const nonJesseLeads = jesseLeads.filter(
      (l) => l.assigned_distributor_id !== '12f591cd-4906-4876-a704-c9d20c53cdb9'
    );
    if (nonJesseLeads.length === 0) {
      console.log('   [PASS] All returned leads are strictly assigned to Jesse. No cross-distributor leads leaked.');
    } else {
      console.error('   [FAIL] Jesse received leads assigned to others:', nonJesseLeads);
    }
  }

  // 2. Test Admin (Mehdi Cohen)
  const adminClient = createClient(supabaseUrl, supabaseKey);
  const { data: adminAuth, error: adminAuthErr } = await adminClient.auth.signInWithPassword({
    email: 'mehdicohen1@proton.me',
    password: 'Legacy@Mehdi2026!',
  });

  if (adminAuthErr) {
    console.log('Testing Admin login fallback...');
  } else {
    console.log('\n2. Logged in as Admin (Mehdi Cohen)');
    const { data: allLeads, error: allLeadsErr } = await adminClient
      .from('crm_leads')
      .select('id, full_name, assigned_distributor_id, submitted_at, updated_at');
    console.log(`   Admin queried crm_leads: returned ${allLeads?.length || 0} total leads in database.`);
    
    // Check distribution
    const unassignedCount = allLeads?.filter((l) => !l.assigned_distributor_id).length || 0;
    console.log(`   Unassigned leads count: ${unassignedCount}`);
  }

  console.log('\n=== ACCESS CONTROL TESTS COMPLETED ===');
}

runAccessControlTests();
