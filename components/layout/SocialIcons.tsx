const SOCIAL_LINKS = [
  { name: "Facebook", href: "https://www.facebook.com/BambooForestMartialArts", Icon: FacebookIcon },
  { name: "Instagram", href: "https://www.instagram.com/bambooforestmartialarts", Icon: InstagramIcon },
  { name: "YouTube", href: "https://www.youtube.com/@bambooforestmartialarts", Icon: YouTubeIcon },
];

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M13.5 21v-7.5H16l.5-3h-3V8.5c0-.87.24-1.46 1.5-1.46H16.5V4.2c-.26-.04-1.15-.11-2.19-.11-2.17 0-3.66 1.32-3.66 3.75v2.66H8.5v3h2.15V21h2.85z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <rect x="2" y="5.5" width="20" height="13" rx="4" />
      <path d="M10.5 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SocialIcons() {
  return (
    <div className="flex items-center justify-center gap-4">
      {SOCIAL_LINKS.map(({ name, href, Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={name}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#5e703a] transition-transform hover:scale-105"
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}
