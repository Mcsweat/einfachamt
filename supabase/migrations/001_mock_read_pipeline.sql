drop policy if exists "Users can update their own documents" on public.documents;
create policy "Users can update their own documents"
on public.documents for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can create analyses for their documents" on public.analyses;
create policy "Users can create analyses for their documents"
on public.analyses for insert
to authenticated
with check (
  exists (
    select 1
    from public.documents
    where documents.id = analyses.document_id
      and documents.user_id = auth.uid()
  )
);
