# www Primary Domain Design

## Goal

Make `https://www.wjhdev.cloud` the portfolio's sole public website URL while
preserving the existing API endpoints on the apex domain.

## Routing

### HTTP

All HTTP requests redirect permanently to the equivalent HTTPS URL on
`www.wjhdev.cloud`:

```text
http://wjhdev.cloud/path     -> https://www.wjhdev.cloud/path
http://www.wjhdev.cloud/path -> https://www.wjhdev.cloud/path
```

### HTTPS website

On the HTTPS virtual host:

- requests whose host is `www.wjhdev.cloud` serve the static portfolio;
- apex-domain website requests redirect with HTTP 301 to the same path and
  query string on `www.wjhdev.cloud`.

### Existing APIs

The following apex-domain routes remain proxied directly and do not redirect:

```text
https://wjhdev.cloud/api/wechat/
https://wjhdev.cloud/ordering-api/
```

They must preserve the current proxy targets, headers, timeouts, request
methods, and bodies. The same locations may remain available on the `www`
host because both names share the virtual host, but existing clients are not
required to migrate.

## Website Metadata

Update all public website references to `https://www.wjhdev.cloud`:

- canonical URL;
- Open Graph URL;
- README production link;
- footer deployment text;
- GitHub repository homepage.

No project repository, release, resume, or API URLs change.

## Implementation Shape

Use one HTTPS server block with both hostnames and an exact host check inside
the static website location:

```nginx
location / {
    if ($host = wjhdev.cloud) {
        return 301 https://www.wjhdev.cloud$request_uri;
    }
    try_files $uri $uri/ /index.html;
}
```

The API locations appear before the website location and therefore continue
to proxy without encountering the website redirect.

## Verification

Automated content tests must fail before implementation and then assert:

- canonical and Open Graph URLs use `www`;
- the Nginx template redirects apex website traffic to `www`;
- API proxy locations remain present.

Production verification must confirm:

- `https://www.wjhdev.cloud/` returns 200;
- `https://wjhdev.cloud/` returns 301 with the correct `Location`;
- paths and query strings survive the redirect;
- the resume and architecture assets load on `www`;
- apex `/api/wechat/` and `/ordering-api/` retain their baseline responses;
- Nginx configuration validation succeeds;
- desktop and mobile browser checks pass on the `www` host.

## Deployment and Rollback

Build and upload a new immutable release. Back up the active Nginx file before
installing the new template. Only switch the release symlink and reload after
`nginx -t` succeeds.

Rollback restores the previous release symlink and the timestamped Nginx
backup, validates with `nginx -t`, and reloads Nginx.
