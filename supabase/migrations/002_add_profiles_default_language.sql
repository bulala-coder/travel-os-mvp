alter table public.profiles
add column if not exists default_language text not null default 'zh-TW';

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'locale'
  ) then
    update public.profiles
    set default_language = coalesce(locale, 'zh-TW')
    where default_language = 'zh-TW';
  end if;
end $$;
