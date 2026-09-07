import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "@/app/(portal)/portal/actions";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, emergency_contact")
    .eq("id", user!.id)
    .maybeSingle();

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <p className="mt-1 text-sm text-zinc-500">{user?.email}</p>

      <form action={updateProfile} className="mt-6 space-y-4">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium">
            Full name
          </label>
          <input
            id="full_name"
            name="full_name"
            defaultValue={profile?.full_name ?? ""}
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            defaultValue={profile?.phone ?? ""}
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="emergency_contact" className="block text-sm font-medium">
            Emergency contact
          </label>
          <input
            id="emergency_contact"
            name="emergency_contact"
            defaultValue={profile?.emergency_contact ?? ""}
            placeholder="Name and phone number"
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Save changes
        </button>
      </form>
    </div>
  );
}
