import { defaultLocale } from "@/lib/locale";
import { publicUrl } from "@/lib/asset";

export default function RootPage() {
  const href = publicUrl(`/${defaultLocale}/`);
  return (
    <p>
      <a href={href}>OhMyCar</a>
      <script dangerouslySetInnerHTML={{ __html: `location.replace(${JSON.stringify(href)});` }} />
    </p>
  );
}
