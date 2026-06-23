import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Use auth-helpers so cookie format matches middleware.js and Layout.js
export const supabase = createClientComponentClient();
