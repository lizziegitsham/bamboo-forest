import { createClient } from "@/lib/supabase/server";
import { signConsentForm } from "@/app/(portal)/portal/actions";

export default async function FormsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: forms } = await supabase
    .from("consent_forms")
    .select("id, title, body, consent_records(id, signed_at, user_id)")
    .order("title");

  return (
    <div>
      <h1 className="text-2xl font-semibold">Forms</h1>
      <div className="mt-6 space-y-4">
        {forms?.map((form) => {
          const signedRecord = form.consent_records?.find((record) => record.user_id === user!.id);
          return (
            <div key={form.id} className="rounded-lg border border-black/10 p-6">
              <h2 className="font-semibold">{form.title}</h2>
              <p className="mt-2 whitespace-pre-line text-sm text-zinc-600">
                {form.body}
              </p>
              {signedRecord ? (
                <p className="mt-3 text-sm text-green-700">
                  Signed on {new Date(signedRecord.signed_at).toLocaleDateString()}
                </p>
              ) : (
                <form action={signConsentForm.bind(null, form.id)} className="mt-3">
                  <button
                    type="submit"
                    className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
                  >
                    Sign this form
                  </button>
                </form>
              )}
            </div>
          );
        })}
        {!forms?.length && (
          <p className="text-sm text-zinc-500">No forms have been added yet.</p>
        )}
      </div>
    </div>
  );
}
