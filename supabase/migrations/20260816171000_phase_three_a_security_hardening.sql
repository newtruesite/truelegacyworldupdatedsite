-- Remove redundant permissive SELECT policies and make function grants explicit.
DROP POLICY IF EXISTS "Members view permitted booking types" ON public.crm_booking_types;
DROP POLICY IF EXISTS "Members view permitted availability" ON public.crm_availability_windows;

REVOKE ALL ON FUNCTION public.crm_get_booking_page(TEXT, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.crm_get_booking_slots(TEXT, TEXT, DATE) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.crm_book_meeting(TEXT, TEXT, TIMESTAMPTZ, JSONB) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.crm_update_meeting_status(UUID, TEXT) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.crm_get_booking_page(TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.crm_get_booking_slots(TEXT, TEXT, DATE) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.crm_book_meeting(TEXT, TEXT, TIMESTAMPTZ, JSONB) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.crm_update_meeting_status(UUID, TEXT) TO authenticated;
