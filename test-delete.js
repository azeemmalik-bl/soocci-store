const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cmlynjdjfjumlhhsyekp.supabase.co';
const supabaseKey = 'sb_publishable_KWNvjzI-5TOC67fq2RAefg_S49GmxWc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDelete() {
    console.log("1. Attempting to fetch a product (Read Test)...");
    const { data: readData, error: readError } = await supabase.from('products').select('id, title').limit(1);

    if (readError) {
        console.error("READ ERROR:", readError);
    } else {
        console.log("Read Success. Found:", readData.length, "items.");
    }

    // Try to delete a non-existent item to check permissions (should return count 0, not permission denied)
    // Using a fake ID
    console.log("2. Attempting DELETE on fake ID (Permission Test)...");
    const { error: deleteError, count } = await supabase
        .from('products')
        .delete()
        .eq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
        console.error("DELETE PERMISSION ERROR:", deleteError);
        console.log("Diagnosis: Admin policy for DELETE is missing/blocking.");
    } else {
        console.log("Delete Request Sent Successfully (No RLS Block).");
    }
}

testDelete();
